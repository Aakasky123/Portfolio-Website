import { motion, useReducedMotion } from "framer-motion";
import SectionHeader from "./SectionHeader";

const MotionSection = motion.section;

const SKILL_GROUPS = [
  {
    title: "Languages",
    items: ["Java", "Python", "TypeScript", "SQL", "C/C++"],
  },
  {
    title: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "HTML", "CSS"],
  },
  {
    title: "Backend & APIs",
    items: ["Spring Boot", "FastAPI", "REST APIs", "WebSockets", "JWT Authentication", "Async Processing"],
  },
  {
    title: "Databases & Messaging",
    items: ["PostgreSQL", "MySQL", "Redis", "Qdrant", "FAISS"],
  },
  {
    title: "Cloud & DevOps",
    items: ["Docker", "Kubernetes", "CI/CD", "AWS", "Git", "GitHub Actions"],
  },
  {
    title: "Systems & Tools",
    items: ["Celery", "MLflow", "Prometheus", "Grafana", "Pandas", "NumPy"],
  },
];

export default function SkillsSection({ skills, subtitle }) {
  const reduceMotion = useReducedMotion();
  const groupedSkills = SKILL_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((skill) => skills.includes(skill)),
  })).filter((group) => group.items.length > 0);

  return (
    <MotionSection
      id="skills"
      className="section-anchor section-shell"
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="panel overflow-hidden">
        <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:items-start lg:gap-12 lg:p-10">
          <div className="skills-intro lg:pt-1">
            <SectionHeader title="Skills" subtitle={subtitle} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {groupedSkills.map((group) => (
              <div key={group.title} className="skill-category">
                <div className="skill-category-header">
                  <h3 className="skill-category-title">{group.title}</h3>
                  <span className="skill-count">{group.items.length}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <span key={skill} className="skill-chip">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MotionSection>
  );
}
