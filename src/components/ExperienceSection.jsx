import { motion, useReducedMotion } from "framer-motion";
import SectionHeader from "./SectionHeader";

export default function ExperienceSection({ experience, subtitle }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id="experience"
      className="section-anchor section-shell"
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <SectionHeader title="Experience" subtitle={subtitle} />

      <div className="mt-10 grid gap-6">
        {experience.map((item, index) => (
          <article
            key={`${item.company}-${item.time}`}
            className="timeline-card panel overflow-hidden"
          >
            <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[220px_minmax(0,1fr)]">
              <div className="relative">
                <span className="timeline-dot" aria-hidden="true" />
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-brand)]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="mt-4 inline-flex rounded-full border border-[var(--color-border)] bg-white/[0.04] px-3 py-1.5 text-sm text-[var(--color-text-muted)]">
                  {item.time}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold tracking-[-0.03em] text-[var(--color-heading)]">
                  {item.company}
                </h3>

                <ul className="mt-5 grid gap-3">
                  {item.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-3 text-sm leading-7 text-[var(--color-text-muted)] sm:text-[0.96rem]"
                    >
                      <span className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand)]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>
    </motion.section>
  );
}
