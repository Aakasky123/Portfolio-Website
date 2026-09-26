import { useEffect, useRef, useState } from "react";
import { NAV, SITE } from "../data/content";
import { store, toggleVision, useStore } from "../lib/store";
import CursorMark from "./CursorMark";
import "./nav.css";

function useActiveSection(ids) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const onScroll = () => {
      const probe = window.innerHeight * 0.4;
      let current = null;
      for (const el of els) {
        if (el.getBoundingClientRect().top <= probe) current = el.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);
  return active;
}

const SECTION_IDS = [...NAV.map((n) => n.id), "contact"];

export function VisionSwitch({ compact = false }) {
  const vision = useStore((s) => s.vision);
  const on = vision === "on";
  return (
    <button
      type="button"
      className={`vswitch ${compact ? "vswitch--compact" : ""}`}
      data-on={on}
      aria-pressed={on}
      onClick={toggleVision}
      title="Toggle agent vision (V)"
    >
      <span className="sr-only">Agent vision</span>
      <span className="vswitch__track" aria-hidden>
        <span className="vswitch__opt">Human</span>
        <span className="vswitch__opt">Agent</span>
        <span className="vswitch__thumb" />
      </span>
      {!compact && <span className="kbd" aria-hidden>V</span>}
    </button>
  );
}

export default function Nav() {
  const active = useActiveSection(SECTION_IDS);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const barRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // V toggles the agent's view, anywhere except while typing.
  useEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      const typing = t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "v" || e.key === "V") toggleVision();
      if (e.key === "Escape" && store.get().vision === "on") store.set({ vision: "off" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="nav" data-scrolled={scrolled} data-open={open}>
      <div className="nav__inner wrap">
        <a href="#top" className="nav__brand" onClick={close} data-agent="link">
          <CursorMark className="nav__mark" />
          <span className="nav__name">{SITE.name}</span>
        </a>

        <nav className="nav__links" aria-label="Sections">
          {NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="nav__link"
              aria-current={active === item.id ? "true" : undefined}
              data-agent="link"
            >
              <span className="nav__n mono">{item.n}</span>
              <span className="nav__label">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <VisionSwitch />
          <a href="#contact" className="btn btn--ink nav__cta" data-agent="button">
            Contact
          </a>
          <button
            type="button"
            className="nav__menu"
            aria-expanded={open}
            aria-controls="nav-sheet"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span className="nav__burger" aria-hidden />
          </button>
        </div>
      </div>
      <div className="nav__progress" ref={barRef} aria-hidden />

      <div id="nav-sheet" className="sheet" hidden={!open}>
        <nav className="sheet__links" aria-label="Sections">
          {[...NAV, { id: "contact", n: "05", label: "Contact" }].map((item, i) => (
            <a key={item.id} href={`#${item.id}`} onClick={close} style={{ "--i": i }}>
              <span className="mono sheet__n">{item.n}</span>
              <span className="serif">{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="sheet__foot">
          <VisionSwitch compact />
          <a className="label link" href={SITE.resumeUrl} download>
            Résumé PDF
          </a>
        </div>
      </div>
    </header>
  );
}
