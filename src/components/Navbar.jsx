import { useEffect, useState } from "react";
import { motion as Motion } from "framer-motion";
import { Menu, X, FileDown } from "lucide-react";

export default function Navbar({ items, activeSection, resumeUrl, onNavigate }) {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const handleClick = (event, id) => {
    setOpen(false);
    onNavigate(event, id);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a
          href="#top"
          onClick={(e) => handleClick(e, "top")}
          className="font-mono text-sm font-semibold tracking-tight text-fg"
        >
          <span className="text-amber">~/</span>aakash
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {items.map((item) => {
            const active = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={`relative rounded px-3 py-1.5 font-mono text-xs tracking-widest uppercase transition-colors ${
                  active ? "text-amber" : "text-mute hover:text-fg"
                }`}
              >
                {item.label}
                {active && (
                  <Motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-3 -bottom-[1px] h-px bg-amber"
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
              </a>
            );
          })}
          <a
            href={resumeUrl}
            download
            className="ml-3 inline-flex items-center gap-2 border border-line-strong px-3.5 py-1.5 font-mono text-xs tracking-widest text-fg uppercase transition-colors hover:border-amber hover:text-amber"
          >
            <FileDown size={13} />
            Resume
          </a>
        </div>

        <button
          type="button"
          className="text-mute md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Scroll progress */}
      <div
        aria-hidden
        className="absolute bottom-[-1px] left-0 h-px bg-amber glow-dot"
        style={{ width: `${progress * 100}%` }}
      />

      {open && (
        <div className="border-t border-line bg-ink px-4 pb-4 md:hidden">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={`block py-3 font-mono text-sm tracking-widest uppercase ${
                activeSection === item.id ? "text-amber" : "text-mute"
              }`}
            >
              {item.label}
            </a>
          ))}
          <a
            href={resumeUrl}
            download
            className="mt-2 inline-flex items-center gap-2 border border-line-strong px-4 py-2 font-mono text-xs tracking-widest text-fg uppercase"
          >
            <FileDown size={13} />
            Resume
          </a>
        </div>
      )}
    </header>
  );
}
