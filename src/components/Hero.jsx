import { motion as Motion } from "framer-motion";
import { ArrowDown, FileDown } from "lucide-react";
import AgentTrace from "./AgentTrace";

export default function Hero({ content, onNavigate }) {
  return (
    <section id="top" className="relative pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10" />

      <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <Motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-xs tracking-[0.25em] text-amber uppercase">
            {content.heroEyebrow}
          </p>
          <h1 className="mt-5 font-display text-4xl leading-[1.08] font-semibold tracking-tight text-fg sm:text-5xl lg:text-[3.4rem]">
            {content.heroHeadline[0]}
            <br />
            <span className="text-mute">{content.heroHeadline[1]}</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-mute sm:text-lg">
            {content.heroSub}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              onClick={(e) => onNavigate(e, "work")}
              className="inline-flex items-center gap-2 bg-amber px-5 py-2.5 font-mono text-xs font-semibold tracking-widest text-ink uppercase transition-colors hover:bg-amber-deep hover:text-fg"
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
          </div>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <AgentTrace lines={content.agentTrace} />
        </Motion.div>
      </div>

      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="mt-16 grid gap-px border border-line bg-line sm:grid-cols-3"
      >
        {content.heroStats.map((stat) => (
          <div key={stat.value} className="bg-ink-2 px-6 py-5">
            <p className="font-display text-2xl font-semibold text-amber">{stat.value}</p>
            <p className="mt-1.5 text-sm leading-snug text-mute">{stat.label}</p>
          </div>
        ))}
      </Motion.div>
    </section>
  );
}
