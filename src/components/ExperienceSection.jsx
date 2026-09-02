import { motion as Motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

export default function ExperienceSection({ experience }) {
  return (
    <section id="experience" className="scroll-mt-24 py-16 sm:py-24">
      <SectionHeader index="02" title="Experience" subtitle="Production systems, measured outcomes." />

      <div className="relative">
        {/* Timeline rail that draws itself in */}
        <div className="absolute top-2 bottom-2 left-[3px] hidden w-px bg-line md:block" />
        <Motion.div
          className="absolute top-2 bottom-2 left-[3px] hidden w-px origin-top bg-amber md:block"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />

        {experience.map((job, i) => (
          <Reveal key={job.company} delay={i * 0.05}>
            <article
              className={`relative grid gap-4 py-8 md:grid-cols-[220px_1fr] md:gap-10 md:pl-8 ${
                i > 0 ? "border-t border-line" : ""
              }`}
            >
              <span className="glow-dot absolute top-[42px] left-0 hidden h-[7px] w-[7px] rounded-full bg-amber md:block" />
              <div>
                <p className="font-mono text-xs tracking-wider text-amber">{job.time}</p>
                <p className="mt-1 font-mono text-xs tracking-wider text-dim">{job.place}</p>
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-fg">{job.company}</h3>
                <p className="mt-0.5 font-mono text-xs tracking-wider text-mute uppercase">
                  {job.role}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {job.bullets.map((b) => (
                    <li key={b} className="flex gap-3 text-sm leading-relaxed text-mute">
                      <span className="mt-[9px] h-1 w-1 shrink-0 bg-amber" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
