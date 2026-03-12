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

      <div className="mt-10 grid gap-5">
        {experience.map((item, index) => (
          <article
            key={`${item.company}-${item.time}`}
            className="panel relative overflow-hidden"
          >
            <div className="grid gap-5 p-5 sm:p-7 lg:grid-cols-[140px_minmax(0,1fr)] lg:gap-7">
              {/* Left rail */}
              <div className="flex flex-row items-center gap-3 lg:flex-col lg:items-start lg:border-r lg:border-[var(--color-border)] lg:pr-6">
                <span className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[var(--color-brand)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="hidden h-px w-3 bg-[var(--color-border)] lg:block" />
                <p className="text-[0.82rem] text-[var(--color-text-muted)]">
                  {item.time}
                </p>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-lg font-semibold tracking-[-0.02em] text-[var(--color-heading)] sm:text-xl">
                  {item.company}
                </h3>

                <ul className="mt-4 grid gap-2.5">
                  {item.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-3 text-sm leading-[1.75] text-[var(--color-text-muted)] sm:text-[0.94rem]"
                    >
                      <span className="mt-[0.65rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand)] opacity-70" />
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

