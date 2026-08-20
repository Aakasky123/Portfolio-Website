import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

export default function AboutSection({ about, facts, education }) {
  return (
    <section id="about" className="scroll-mt-24 py-16 sm:py-24">
      <SectionHeader index="04" title="About" subtitle="Backend rigor, agent-level ambition." />
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <Reveal>
          <div className="space-y-5">
            {about.map((p) => (
              <p key={p.slice(0, 24)} className="leading-relaxed text-mute">
                {p}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <dl className="border border-line">
            {facts.map((fact, i) => (
              <div
                key={fact.label}
                className={`flex flex-col gap-1 px-5 py-3.5 sm:flex-row sm:items-baseline sm:gap-4 ${
                  i > 0 ? "border-t border-line" : ""
                }`}
              >
                <dt className="w-24 shrink-0 font-mono text-[11px] tracking-widest text-dim uppercase">
                  {fact.label}
                </dt>
                <dd className="text-sm text-fg">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {education.map((edu, i) => (
          <Reveal key={edu.school} delay={i * 0.08}>
            <div className="h-full border border-line bg-ink-2 px-5 py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-base font-semibold text-fg">{edu.school}</h3>
                <span className="font-mono text-[11px] tracking-wider text-dim">{edu.time}</span>
              </div>
              <p className="mt-1 text-sm text-mute">{edu.degree}</p>
              <p className="mt-1 font-mono text-[11px] tracking-wide text-dim">{edu.detail}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
