import { useRef } from "react";
import { motion as Motion, useReducedMotion } from "framer-motion";
import { ArrowDown, FileDown } from "lucide-react";
import AsciiPortrait from "./AsciiPortrait";
import CountUp from "./CountUp";

const ease = [0.22, 1, 0.36, 1];

function StaggeredLine({ text, className, startIndex }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <Motion.span
            className="inline-block"
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.15 + (startIndex + i) * 0.055, ease }}
          >
            {word}
          </Motion.span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}

export default function Hero({ content, onNavigate }) {
  const sectionRef = useRef(null);
  const reduced = useReducedMotion();
  const firstLineWords = content.heroHeadline[0].split(" ").length;

  const onMouseMove = (event) => {
    const el = sectionRef.current;
    if (!el || reduced) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--hx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--hy", `${event.clientY - rect.top}px`);
  };

  return (
    <section
      id="top"
      ref={sectionRef}
      onMouseMove={onMouseMove}
      className="relative pt-32 pb-16 sm:pt-40 sm:pb-24"
    >
      {/* Backdrop: grid + drifting light + cursor spotlight */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="grid-bg absolute inset-0" />
        <div className="blob blob-a left-[-10%] top-[-10%] h-[420px] w-[420px] bg-amber/20" />
        <div className="blob blob-b right-[-5%] top-[20%] h-[360px] w-[360px] bg-amber-deep/15" />
        <div className="hero-spot absolute inset-0" />
      </div>

      <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div>
          <Motion.p
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease }}
            className="font-mono text-xs tracking-[0.25em] text-amber uppercase"
          >
            {content.heroEyebrow}
          </Motion.p>

          <h1 className="mt-5 font-display text-4xl leading-[1.08] font-semibold tracking-tight text-fg sm:text-5xl lg:text-[3.4rem]">
            <StaggeredLine text={content.heroHeadline[0]} startIndex={0} />
            <br />
            <StaggeredLine
              text={content.heroHeadline[1]}
              className="text-mute"
              startIndex={firstLineWords}
            />
          </h1>

          <Motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75, ease }}
            className="mt-6 max-w-xl text-base leading-relaxed text-mute sm:text-lg"
          >
            {content.heroSub}
          </Motion.p>

          <Motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a
              href="#work"
              onClick={(e) => onNavigate(e, "work")}
              className="shine inline-flex items-center gap-2 bg-amber px-5 py-2.5 font-mono text-xs font-semibold tracking-widest text-ink uppercase transition-colors hover:bg-amber-deep hover:text-fg"
            >
              View work
              <ArrowDown size={14} />
            </a>
            <a
              href={content.resumeUrl}
              download
              className="inline-flex items-center gap-2 border border-line-strong px-5 py-2.5 font-mono text-xs tracking-widest text-fg uppercase transition-colors hover:border-amber hover:text-amber"
            >
              <FileDown size={14} />
              Resume
            </a>
            <div className="ml-1 flex items-center gap-4">
              {content.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="font-mono text-xs tracking-widest text-mute uppercase underline-offset-4 transition-colors hover:text-amber hover:underline"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </Motion.div>
        </div>

        <Motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease }}
        >
          <AsciiPortrait />
        </Motion.div>
      </div>

      <Motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.05, ease }}
        className="mt-16 grid gap-px border border-line bg-line sm:grid-cols-3"
      >
        {content.heroStats.map((stat, i) => (
          <div key={stat.value} className="group bg-ink-2 px-6 py-5 transition-colors hover:bg-panel-2">
            <p className="font-display text-2xl font-semibold text-amber tabular-nums">
              <CountUp value={stat.value} delay={1100 + i * 150} />
            </p>
            <p className="mt-1.5 text-sm leading-snug text-mute">{stat.label}</p>
          </div>
        ))}
      </Motion.div>
    </section>
  );
}
