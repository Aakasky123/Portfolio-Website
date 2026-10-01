import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useStore } from "../lib/store";
import { useOnScreen, useReducedMotion } from "../lib/hooks";
import { confidence, glide, isAbort, sleep, travelTime } from "../lib/motion";
import { SITE } from "../data/content";
import CursorMark from "./CursorMark";
import "./agent.css";

// Distance (px) at which human activity makes the agent stop and wait.
// Collaborative robots do the same thing: speed & separation monitoring.
const SAFETY_RADIUS = 170;
const RESUME_AFTER = 1700;

function localHour() {
  const h = new Intl.DateTimeFormat("en-US", { timeZone: SITE.timeZone, hour: "numeric", hour12: false }).format(new Date());
  return Number(h) % 24;
}

// The agent's plan for the hero. Each step: where to look, what it says.
function buildPlan() {
  return [
    { kind: "shot" },
    {
      id: "act", ax: 0.35, ay: 0.62, role: "token · verb",
      plan: "locate verb, line 1", tag: "OBS", say: '"act." — the claim', verify: "read-back ✓",
    },
    {
      id: "hold", ax: 0.4, ay: 0.62, role: "token · verb",
      plan: "locate verb, line 2", tag: "OBS", say: '"hold." — the promise', verify: "read-back ✓",
    },
    {
      id: "intro", ax: 0.12, ay: 0.3, role: "text · paragraph",
      plan: "read intro", tag: "OBS",
      say: (el) => `${el.textContent.trim().split(/\s+/).length} words · parsed`,
      verify: "entities: agents, backends, 40M/day",
    },
    {
      id: "stat-0", ax: 0.3, ay: 0.4, role: "metric",
      plan: "parse metric", tag: "OBS", say: "40M → 40,000,000 events/day", verify: "unit ✓",
    },
    {
      id: "cta", ax: 0.55, ay: 0.55, role: "button · clickable", hover: true,
      plan: 'click "Watch the agent work"?', tag: "GATE", say: "navigation is the human's call", verify: "skipped · waiting for you",
    },
    {
      id: "clock", ax: 0.75, ay: 0.6, role: "text · time",
      plan: "read local time", tag: "OBS",
      say: () => {
        const h = localHour();
        return h >= 7 && h < 24 ? "Jersey City · Aakash is likely awake" : "Jersey City · Aakash is likely asleep";
      },
      verify: "tz America/New_York ✓",
    },
    {
      id: "resume", ax: 0.5, ay: 0.55, role: "link · pdf", hover: true,
      plan: "inspect link", tag: "OBS", say: "Aakash_Resume.pdf · 31 KB", verify: "href ✓ same-origin",
    },
    {
      id: "stat-1", ax: 0.3, ay: 0.4, role: "metric",
      plan: "parse metric", tag: "OBS", say: "1,200 automated tests", verify: "unit ✓",
    },
  ];
}

export default function HeroAgent({ heroRef }) {
  const pointerRef = useRef(null);
  const tagRef = useRef(null);
  const boxRef = useRef(null);
  const labelRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const stepRef = useRef(0);
  const shotRef = useRef(41);
  const hoverElRef = useRef(null);
  const targetElRef = useRef(null);
  const placedRef = useRef(false);

  const [caption, setCaption] = useState({ tag: "INIT", text: "attaching to page" });
  const [yielding, setYielding] = useState(false);
  const [entered, setEntered] = useState(false);

  const vision = useStore((s) => s.vision);
  const reduced = useReducedMotion();
  const onScreen = useOnScreen(heroRef, "-15% 0px");
  const active = entered && onScreen && vision === "off" && !reduced && !yielding;

  // Enter shortly after the boot scan hands the page to the human.
  useEffect(() => {
    if (vision !== "off" || entered || reduced) return undefined;
    const id = setTimeout(() => setEntered(true), 500);
    return () => clearTimeout(id);
  }, [vision, entered, reduced]);

  const place = (x, y) => {
    pos.current = { x, y };
    const el = pointerRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    // Keep the caption inside the hero: it hangs right of the pointer and
    // slides left as the pointer nears the edge.
    const tag = tagRef.current;
    const w = heroRef.current?.offsetWidth ?? 0;
    if (tag && w) {
      const tw = tag.offsetWidth;
      const off = Math.max(12 - x, Math.min(16, w - 12 - tw - x));
      tag.style.transform = `translateX(${off - 16}px)`;
    }
  };

  const rectOf = (el) => {
    const h = heroRef.current.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return { x: r.left - h.left, y: r.top - h.top, w: r.width, h: r.height };
  };

  const showBox = (el, label) => {
    const box = boxRef.current;
    if (!box) return;
    const r = rectOf(el);
    const pad = 8;
    targetElRef.current = el;
    // Position while hidden (no transition), then lock on.
    box.style.transform = `translate3d(${r.x - pad}px, ${r.y - pad}px, 0)`;
    box.style.width = `${r.w + pad * 2}px`;
    box.style.height = `${r.h + pad * 2}px`;
    labelRef.current.textContent = label;
    void box.offsetWidth;
    box.dataset.show = "true";
  };

  const hideBox = () => {
    if (boxRef.current) boxRef.current.dataset.show = "false";
    targetElRef.current = null;
  };

  const setHover = (el) => {
    hoverElRef.current?.classList.remove("is-agent-hover");
    hoverElRef.current = el;
    el?.classList.add("is-agent-hover");
  };

  const pulse = () => {
    const el = pointerRef.current;
    if (!el) return;
    el.classList.remove("is-click");
    void el.offsetWidth;
    el.classList.add("is-click");
  };

  // A new caption changes the tag's width; re-clamp it where it stands.
  useLayoutEffect(() => {
    place(pos.current.x, pos.current.y);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caption]);

  // Keep the box glued to its target while the page scrolls.
  useEffect(() => {
    const onScroll = () => {
      const t = targetElRef.current;
      const box = boxRef.current;
      if (!t || !box || box.dataset.show !== "true") return;
      const r = rectOf(t);
      box.style.transform = `translate3d(${r.x - 8}px, ${r.y - 8}px, 0)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The loop.
  useEffect(() => {
    if (!active) return undefined;
    const hero = heroRef.current;
    const ctrl = new AbortController();
    const { signal } = ctrl;
    const plan = buildPlan();

    const run = async () => {
      if (!placedRef.current) {
        placedRef.current = true;
        place(hero.offsetWidth + 30, hero.offsetHeight * 0.62);
        setCaption({ tag: "INIT", text: "attached · observing page" });
      } else {
        setCaption({ tag: "RESUME", text: "continuing plan" });
        await sleep(650, signal);
      }

      for (;;) {
        const step = plan[stepRef.current % plan.length];

        if (step.kind === "shot") {
          shotRef.current += 1;
          hero.classList.remove("is-shot");
          void hero.offsetWidth;
          hero.classList.add("is-shot");
          setCaption({
            tag: "OBS",
            text: `screenshot #${String(shotRef.current).padStart(4, "0")} · ${window.innerWidth}×${window.innerHeight}`,
          });
          await sleep(1300, signal);
          stepRef.current += 1;
          continue;
        }

        const el = hero.querySelector(`[data-hero-target="${step.id}"]`);
        if (!el || el.getClientRects().length === 0) {
          stepRef.current += 1;
          continue;
        }
        const r = rectOf(el);
        const aim = { x: r.x + r.w * step.ax, y: r.y + r.h * step.ay };

        setCaption({ tag: "PLAN", text: step.plan });
        await glide({
          from: pos.current,
          to: aim,
          duration: travelTime(pos.current, aim),
          curve: 0.1,
          signal,
          onFrame: place,
        });

        showBox(el, `${step.role} · ${confidence(step.id + step.role)}`);
        if (step.hover) setHover(el);
        const say = typeof step.say === "function" ? step.say(el) : step.say;
        setCaption({ tag: step.tag, text: say });
        if (step.tag !== "GATE") pulse();
        await sleep(1500, signal);

        setCaption({ tag: step.tag === "GATE" ? "HOLD" : "VRFY", text: step.verify });
        await sleep(900, signal);
        setHover(null);
        hideBox();
        stepRef.current += 1;
        await sleep(250, signal);
      }
    };

    run().catch((err) => {
      if (!isAbort(err)) throw err;
    });

    return () => {
      ctrl.abort();
      setHover(null);
      hideBox();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Speed & separation monitoring: human activity nearby → stop, back off, wait.
  useEffect(() => {
    if (!entered || reduced) return undefined;
    const hero = heroRef.current;
    let resumeTimer = 0;
    let backing = null;

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== "mouse" && e.type === "pointermove") return;
      const h = hero.getBoundingClientRect();
      const hx = e.clientX - h.left;
      const hy = e.clientY - h.top;
      const dx = pos.current.x - hx;
      const dy = pos.current.y - hy;
      const d = Math.hypot(dx, dy);
      const near = d < SAFETY_RADIUS || (e.type === "pointerdown" && d < SAFETY_RADIUS * 1.6);
      if (!near) return;

      clearTimeout(resumeTimer);
      setYielding(true);
      setCaption({ tag: "HOLD", text: "human nearby · yielding" });

      // Step back out of the way along the line away from the human.
      if (!backing && d > 0.5) {
        const k = (SAFETY_RADIUS + 30 - d) / d;
        const to = {
          x: Math.min(hero.offsetWidth - 20, Math.max(20, pos.current.x + dx * k)),
          y: Math.min(hero.offsetHeight - 20, Math.max(20, pos.current.y + dy * k)),
        };
        const ctrl = new AbortController();
        backing = ctrl;
        glide({ from: pos.current, to, duration: 420, curve: 0, signal: ctrl.signal, onFrame: place })
          .catch(() => {})
          .finally(() => {
            if (backing === ctrl) backing = null;
          });
      }

      resumeTimer = setTimeout(() => setYielding(false), RESUME_AFTER);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    return () => {
      clearTimeout(resumeTimer);
      backing?.abort();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entered, reduced]);

  if (reduced) return null;

  return (
    <div className="hagent" aria-hidden data-yield={yielding} data-on={entered && vision === "off"}>
      <div className="dbox" ref={boxRef} data-show="false">
        <span className="dbox__label" ref={labelRef} />
        <i className="dbox__c dbox__c--tl" />
        <i className="dbox__c dbox__c--tr" />
        <i className="dbox__c dbox__c--bl" />
        <i className="dbox__c dbox__c--br" />
      </div>

      <div className="apointer" ref={pointerRef}>
        <span className="apointer__ring" />
        <CursorMark className="apointer__mark" />
        <span className="apointer__tag" ref={tagRef}>
          <span className="apointer__who">TARS</span>
          <span className="apointer__step" data-tag={caption.tag}>
            <b>{caption.tag}</b> {caption.text}
          </span>
        </span>
      </div>
    </div>
  );
}
