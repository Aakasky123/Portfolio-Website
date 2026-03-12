import { motion, useReducedMotion } from "framer-motion";
import SectionHeader from "./SectionHeader";

const SKILL_GROUPS = [
  {
    title: "Programming Languages",
    items: ["Python", "Java", "JavaScript", "TypeScript", "SQL", "C/C++"],
  },
  {
    title: "Backend / Frameworks",
    items: ["Spring Boot", "Flask", "Node.js", "Express.js", "gRPC", "Nginx", "Kafka"],
  },
  {
    title: "Frontend",
    items: ["React", "HTML", "CSS"],
  },
  {
    title: "Databases",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Elasticsearch", "Redis"],
  },
  {
    title: "AI / Machine Learning",
    items: ["NumPy", "Pandas", "Scikit-learn", "PyTorch", "TensorFlow", "Matplotlib", "Seaborn"],
  },
  {
    title: "Cloud / DevOps",
    items: ["AWS", "Azure", "Docker", "Kubernetes", "Terraform", "CI/CD"],
  },
  {
    title: "Tools / Platforms",
    items: ["Git", "GitHub", "Jenkins", "Jira", "Postman", "Tableau", "VS Code"],
  },
];

export default function SkillsSection({ skills, subtitle }) {
  const reduceMotion = useReducedMotion();
  const groupedSkills = SKILL_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((skill) => skills.includes(skill)),
  })).filter((group) => group.items.length > 0);

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
        <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:items-start lg:gap-12 lg:p-10">
          <div className="skills-intro lg:pt-1">
            <SectionHeader title="Skills" subtitle={subtitle} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {groupedSkills.map((group) => (
              <div key={group.title} className="skill-category">
                <h3 className="skill-category-title">{group.title}</h3>
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
    </motion.section>
  );
}
