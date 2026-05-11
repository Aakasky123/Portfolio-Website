import { motion, useReducedMotion } from "framer-motion";
import SectionHeader from "./SectionHeader";

const MotionSection = motion.section;

export default function AboutSection({ about, subtitle, capabilities = [] }) {
  const reduceMotion = useReducedMotion();

  return (
    <MotionSection
      id="about"
      className="section-anchor section-shell"
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="panel p-5 sm:p-7 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:gap-12">
          <SectionHeader title="About" subtitle={subtitle} />

          <div className="grid gap-7">
            <div className="grid gap-5 text-sm leading-8 text-[var(--color-text-muted)] sm:text-base">
              {about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {capabilities.map((capability) => (
                <article className="capability-card" key={capability.title}>
                  <p className="capability-metric">{capability.metric}</p>
                  <h3 className="capability-title">{capability.title}</h3>
                  <p className="capability-desc">{capability.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
