import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "../ThemeToggle";

export default function Navbar({ items, activeSection, name, resumeUrl, onNavigate }) {
  const [open, setOpen] = useState(false);

  const handleSectionClick = (event, id) => {
    onNavigate(event, id);
    setOpen(false);
  };

  useEffect(() => {
    setOpen(false);
  }, [activeSection]);

  return (
    <>
      <header className="nav-header sticky top-0 z-50">
        <div className="nav-shell mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <a
            href="#home"
            onClick={(event) => handleSectionClick(event, "home")}
            className="nav-brand min-w-0"
          >
            <span className="block truncate uppercase">{name}</span>
          </a>

          <div className="hidden items-center gap-2 lg:flex">
            <ThemeToggle />
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-action"
            >
              Resume
            </a>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle compact />
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-action px-3 py-2 text-sm"
            >
              Resume
            </a>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="icon-button"
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={open}
              aria-controls="mobile-navigation"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`mobile-menu-shell lg:hidden ${open ? "pointer-events-auto opacity-100" : "hidden pointer-events-none opacity-0"}`}
      >
        <nav
          id="mobile-navigation"
          className="panel mx-auto mt-3 flex max-w-6xl flex-col gap-2 p-3"
        >
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(event) => handleSectionClick(event, item.id)}
              className={`mobile-nav-link ${activeSection === item.id ? "mobile-nav-link-active" : ""}`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
