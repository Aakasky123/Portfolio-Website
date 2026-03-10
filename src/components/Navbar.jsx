import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "../ThemeToggle";

export default function Navbar({ items, activeSection, name, resumeUrl }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [activeSection]);

  return (
    <>
      <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
        <div className="nav-shell mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full px-4 py-3 sm:px-5">
          <a
            href="#home"
            className="min-w-0 text-sm font-semibold tracking-[0.24em] text-[var(--color-heading)] transition hover:text-[var(--color-brand)] sm:text-base"
          >
            <span className="block truncate uppercase">{name}</span>
          </a>

          <nav className="hidden items-center gap-1 lg:flex">
            {items.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`nav-link ${activeSection === item.id ? "nav-link-active" : ""}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 sm:flex">
            <ThemeToggle />
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary"
            >
              Resume
            </a>
          </div>

          <div className="flex items-center gap-2 sm:hidden">
            <ThemeToggle compact />
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary px-3 py-2 text-sm"
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
        className={`mobile-menu-shell sm:hidden ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <nav
          id="mobile-navigation"
          className="panel mx-auto mt-3 flex max-w-6xl flex-col gap-2 p-3"
        >
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
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
