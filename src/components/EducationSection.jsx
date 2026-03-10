import { motion, useReducedMotion } from "framer-motion";
import SectionHeader from "./SectionHeader";

export default function EducationSection({ education }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id="education"
      className="section-anchor section-shell"
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <SectionHeader title="Education" />

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {education.map((item) => (
          <article key={`${item.school}-${item.time}`} className="panel p-5 sm:p-6">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-brand)]">
              {item.time}
            </p>
            <h3 className="mt-4 text-xl font-semibold tracking-[-0.03em] text-[var(--color-heading)]">
              {item.school}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-muted)] sm:text-[0.96rem]">
              {item.degree}
            </p>
          </article>
        ))}
      </div>
    </motion.section>
  );
}
