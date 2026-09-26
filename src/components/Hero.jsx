import { useEffect, useRef } from "react";
import { HERO, SITE } from "../data/content";
import { useClock } from "../lib/hooks";
import HeroAgent from "./HeroAgent";
import "./hero.css";

function Word({ children, i, italic, target }) {
  const Tag = italic ? "em" : "span";
  return (
    <span className="hero__w" style={{ "--i": i }}>
      <Tag className="hero__wi" data-hero-target={target}>
        {children}
      </Tag>
    </span>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const { time, zone } = useClock(SITE.timeZone);

  // Scroll: the couplet drifts apart and the deck recedes.
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const p = Math.min(1, Math.max(0, window.scrollY / (el.offsetHeight || 1)));
        el.style.setProperty("--p", p.toFixed(4));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section id="top" className="hero" ref={ref} aria-labelledby="hero-title">
      <div className="hero__frame" aria-hidden>
        <i /><i /><i /><i />
      </div>

      <div className="hero__meta wrap">
        <p className="label hero__kicker" data-agent="text">
          <span className="hero__live" aria-hidden />
          {HERO.kicker}
        </p>
        <p className="label hero__clock num" data-agent="text" data-hero-target="clock">
          Jersey City&nbsp;&nbsp;{time}&nbsp;{zone}
        </p>
        <p className="label hero__coords num" aria-hidden>
          {SITE.coords}
        </p>
      </div>

      <h1 id="hero-title" className="hero__title wrap">
        <span className="sr-only">Agents that act. Systems that hold.</span>
        <span className="hero__line hero__line--a" data-agent="heading" aria-hidden>
          <Word i={0}>Agents</Word>{" "}
          <span className="hero__pair">
            <Word i={1}>that</Word>{" "}
            <Word i={2} italic target="act">
              act.
            </Word>
          </span>
        </span>
        <span className="hero__line hero__line--b" data-agent="heading" aria-hidden>
          <Word i={3}>Systems</Word>{" "}
          <span className="hero__pair">
            <Word i={4}>that</Word>{" "}
            <Word i={5} italic target="hold">
              hold.
            </Word>
          </span>
        </span>
      </h1>

      <div className="hero__deck wrap">
        <p className="hero__intro" data-agent="text" data-hero-target="intro">
          {HERO.intro}
        </p>

        <dl className="hero__facts">
          <div data-agent="text">
            <dt className="label">Now</dt>
            <dd>{HERO.now}</dd>
          </div>
          <div data-agent="text">
            <dt className="label">Open to</dt>
            <dd>{HERO.open}</dd>
          </div>
        </dl>

        <div className="hero__cta">
          <a href="#demo" className="btn btn--ink" data-agent="button" data-hero-target="cta">
            Watch the agent work <span className="btn__arrow btn__arrow--down" aria-hidden>↓</span>
          </a>
          <a href={SITE.resumeUrl} download className="btn btn--line" data-agent="button" data-hero-target="resume">
            Résumé <span className="mono hero__pdf">PDF</span>
          </a>
          <p className="hero__hint label">
            or press <span className="kbd">V</span> to see this page the way the agent does
          </p>
        </div>
      </div>

      <ul className="hero__stats wrap" aria-label="Highlights">
        {HERO.stats.map((s, i) => (
          <li key={s.unit} className="hero__stat" style={{ "--i": i }} data-agent="metric" data-hero-target={`stat-${i}`}>
            <span className="hero__statv serif num">{s.value}</span>
            <span className="label hero__statu">{s.unit}</span>
            <span className="hero__statl">{s.label}</span>
          </li>
        ))}
      </ul>

      <HeroAgent heroRef={ref} />
    </section>
  );
}
