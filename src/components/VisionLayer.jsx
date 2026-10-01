import { useEffect, useRef, useState } from "react";
import { store, useStore } from "../lib/store";
import { confidence } from "../lib/motion";
import "./vision.css";

// How the agent sees the page.
//
// One fixed layer re-renders whatever is underneath through a backdrop
// filter (inverted, desaturated), and every element tagged [data-agent] gets
// a detection box, tracked every frame. No DOM is cloned; the page underneath
// stays fully interactive.

const BOOT_HOLD = 1500;
const CLICKABLE = /^(A|BUTTON|INPUT|SELECT|TEXTAREA|SUMMARY|LABEL)$/;

function isClickable(el) {
  return CLICKABLE.test(el.tagName) || el.getAttribute("role") === "button" || el.hasAttribute("data-agent-click");
}

function textSample(el) {
  return (el.getAttribute("aria-label") || el.textContent || el.dataset.agent || "").trim().slice(0, 80);
}

export default function VisionLayer() {
  const vision = useStore((s) => s.vision);
  // hidden | shown | leaving | entering
  const [phase, setPhase] = useState(vision === "boot" ? "shown" : "hidden");
  // Stays true through the boot hand-over scan, not just the hold.
  const [intro, setIntro] = useState(vision === "boot");
  const marksRef = useRef(null);
  const hudRef = useRef(null);
  const crossRef = useRef(null);
  const coordRef = useRef(null);
  const frameNo = useRef(1);

  const booting = vision === "boot";

  // Drive the phase from the store.
  useEffect(() => {
    if (vision === "on") {
      setPhase((p) => (p === "shown" ? p : "entering"));
      // Everything should be visible to the agent, even what hasn't scrolled in yet.
      document.querySelectorAll("[data-in]").forEach((el) => (el.dataset.in = "true"));
    } else if (vision === "off") {
      setPhase((p) => (p === "hidden" ? p : "leaving"));
    }
    document.documentElement.dataset.vision = vision;
  }, [vision]);

  // Boot: hold the agent's view for a beat, then scan into the human view.
  useEffect(() => {
    if (!booting) return undefined;
    let done = false;
    const handOver = () => {
      if (done) return;
      done = true;
      store.set({ vision: "off" });
    };
    const id = setTimeout(handOver, BOOT_HOLD);
    const skip = () => handOver();
    window.addEventListener("wheel", skip, { passive: true, once: true });
    window.addEventListener("touchstart", skip, { passive: true, once: true });
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });
    return () => {
      clearTimeout(id);
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchstart", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [booting]);

  const onAnimationEnd = (e) => {
    if (e.target !== e.currentTarget) return;
    if (phase === "leaving") {
      setPhase("hidden");
      setIntro(false);
      document.documentElement.classList.remove("is-booting");
    } else if (phase === "entering") {
      setPhase("shown");
    }
  };

  // Track every [data-agent] element while the layer is up.
  useEffect(() => {
    if (phase === "hidden") return undefined;
    const layer = marksRef.current;
    const nodes = new Map(); // element -> box node
    const pool = [];
    let raf = 0;
    let lastHud = "";
    let els = [];

    const collect = () => {
      els = Array.from(document.querySelectorAll("[data-agent]"));
    };
    collect();
    const mo = new MutationObserver(collect);
    mo.observe(document.body, { childList: true, subtree: true });

    const make = () => {
      const n = pool.pop() || document.createElement("div");
      if (!n.firstChild) {
        n.className = "vbox";
        n.innerHTML = '<span class="vbox__label"></span><i class="vbox__dot"></i>';
      }
      n.classList.remove("is-new");
      void n.offsetWidth;
      n.classList.add("is-new");
      layer.appendChild(n);
      return n;
    };

    const tick = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const seen = new Set();
      let actionable = 0;
      let i = 0;

      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2 || r.bottom < -40 || r.top > vh + 40 || r.right < 0 || r.left > vw) continue;
        seen.add(el);
        let n = nodes.get(el);
        if (!n) {
          n = make();
          n.style.animationDelay = `${Math.min(i, 24) * 28}ms`;
          nodes.set(el, n);
          const role = el.dataset.agent;
          const click = isClickable(el);
          n.dataset.role = role;
          n.dataset.click = click;
          n._conf = confidence(textSample(el));
          n._label = "";
        }
        i += 1;
        const click = n.dataset.click === "true";
        if (click) actionable += 1;

        n.style.transform = `translate3d(${r.left}px, ${r.top}px, 0)`;
        n.style.width = `${r.width}px`;
        n.style.height = `${r.height}px`;

        const at = `⌖ ${Math.round(r.left + r.width / 2)},${Math.round(r.top + r.height / 2)}`;
        // Narrow targets get coordinates only, so neighbours' labels don't collide.
        const label = click ? (r.width < 120 ? at : `${n.dataset.role} ${at}`) : `${n.dataset.role} ${n._conf}`;
        if (label !== n._label) {
          n._label = label;
          n.firstChild.textContent = label;
        }
        // Flip the label inside the box when it would fall off the top.
        n.classList.toggle("is-flip", r.top < 78);
      }

      for (const [el, n] of nodes) {
        if (!seen.has(el)) {
          nodes.delete(el);
          n.remove();
          pool.push(n);
        }
      }

      frameNo.current += 1;
      const hud = `${seen.size} elements · ${actionable} actionable · frame ${String(frameNo.current).padStart(5, "0")}`;
      if (hud !== lastHud && hudRef.current) {
        lastHud = hud;
        hudRef.current.textContent = hud;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      nodes.forEach((n) => n.remove());
    };
  }, [phase]);

  // Crosshair + click-space coordinates under the human's mouse.
  useEffect(() => {
    if (phase === "hidden") return undefined;
    const onMove = (e) => {
      if (!crossRef.current) return;
      crossRef.current.style.setProperty("--x", `${e.clientX}px`);
      crossRef.current.style.setProperty("--y", `${e.clientY}px`);
      crossRef.current.dataset.live = "true";
      if (coordRef.current) coordRef.current.textContent = `x ${e.clientX}  y ${e.clientY}`;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [phase]);

  if (phase === "hidden") return null;

  return (
    <div className="vision" data-phase={phase} data-boot={intro} aria-hidden>
      <div className="vision__filter" onAnimationEnd={onAnimationEnd} />
      <div className="vision__marks">
        <div className="vision__texture" />
        <div className="vision__boxes" ref={marksRef} />
        <div className="vision__hud">
          <span className="vision__title">
            <span className="vision__rec" />
            {intro ? (booting ? "TARS · observing page" : "Handing control to human") : "Agent vision"}
          </span>
          <span className="vision__stats" ref={hudRef} />
          {!intro && (
            <>
              <span className="vision__note">What a computer-use agent perceives: elements, roles, confidence, click targets.</span>
              <span className="vision__esc">
                <span className="kbd">V</span> or <span className="kbd">Esc</span> to return
              </span>
            </>
          )}
        </div>
      </div>
      <div className="vision__scan" />
      <div className="vision__cross" ref={crossRef}>
        <span className="vision__coord" ref={coordRef} />
      </div>
    </div>
  );
}
