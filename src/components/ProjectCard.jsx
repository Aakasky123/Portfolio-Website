import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function ProjectCard({ project, index }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className="project-card group flex h-full flex-col overflow-hidden"
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="project-media">
        <img
          src={project.img}
          alt={project.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
        <div className="project-media-overlay" />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-semibold tracking-[-0.03em] text-[var(--color-heading)]">
            {project.title}
          </h3>
        </div>

        <p className="mt-4 flex-1 text-sm leading-7 text-[var(--color-text-muted)] sm:text-[0.95rem]">
          {project.desc}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span key={tag} className="tag-chip">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {project.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="project-link"
            >
              <span>{link.label}</span>
              <ArrowUpRight size={16} />
            </a>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
