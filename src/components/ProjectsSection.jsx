import { motion, useReducedMotion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import ProjectCard from "./ProjectCard";

export default function ProjectsSection({ projects, subtitle }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id="projects"
      className="section-anchor section-shell"
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col gap-10">
        <SectionHeader title="Featured Projects" subtitle={subtitle} />

        <div className="grid gap-5 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
