import { motion, useReducedMotion } from "framer-motion";
import SectionHeader from "./SectionHeader";

export default function SkillsSection({ skills, subtitle }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id="skills"
      className="section-anchor section-shell"
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="panel overflow-hidden">
        <div className="grid gap-10 p-5 sm:p-7 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:items-start">
          <SectionHeader title="Skills" subtitle={subtitle} />

          <div className="flex flex-wrap gap-3">
            {skills.map((skill) => (
              <span key={skill} className="skill-chip">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
