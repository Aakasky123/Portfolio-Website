import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

export default function SkillsSection({ skills }) {
  return (
    <section id="skills" className="scroll-mt-24 py-16 sm:py-24">
      <SectionHeader index="03" title="Skills" subtitle="The stack I reach for." />
      <div className="border border-line">
        {skills.map((group, i) => (
          <Reveal key={group.category}>
            <div
              className={`grid gap-3 px-5 py-5 sm:px-6 md:grid-cols-[240px_1fr] md:gap-8 ${
                i > 0 ? "border-t border-line" : ""
              } ${i === 0 ? "bg-amber-soft" : ""}`}
            >
              <p
                className={`font-mono text-xs tracking-[0.2em] uppercase ${
                  i === 0 ? "text-amber" : "text-mute"
                }`}
              >
                {group.category}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="border border-line bg-ink-2 px-2.5 py-1 font-mono text-[12px] text-fg"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
