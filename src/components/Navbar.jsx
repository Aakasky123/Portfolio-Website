import { useState } from "react";
import { Menu, X, FileDown } from "lucide-react";

export default function Navbar({ items, activeSection, resumeUrl, onNavigate }) {
  const [open, setOpen] = useState(false);

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
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className={`rounded px-3 py-1.5 font-mono text-xs tracking-widest uppercase transition-colors ${
                activeSection === item.id
                  ? "text-amber"
                  : "text-mute hover:text-fg"
              }`}
            >
              {item.label}
            </a>
          ))}
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
