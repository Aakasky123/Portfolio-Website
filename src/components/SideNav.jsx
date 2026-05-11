import { ArrowUp, BriefcaseBusiness, Code2, GraduationCap, Home, Layers3, Mail, UserRound } from "lucide-react";

const ICONS = {
  home: Home,
  about: UserRound,
  projects: Layers3,
  experience: BriefcaseBusiness,
  skills: Code2,
  education: GraduationCap,
  contact: Mail,
};

export default function SideNav({ items, activeSection, onNavigate }) {
  return (
    <aside className="side-nav-shell" aria-label="Section navigation">
      <nav className="side-nav">
        {items.map((item) => {
          const Icon = ICONS[item.id] ?? ArrowUp;
          const active = activeSection === item.id;

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(event) => onNavigate(event, item.id)}
              className={`side-nav-link ${active ? "side-nav-link-active" : ""}`}
              aria-current={active ? "true" : undefined}
              title={item.label}
            >
              <span className="side-nav-icon">
                <Icon size={16} />
              </span>
              <span className="side-nav-label">{item.label}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
