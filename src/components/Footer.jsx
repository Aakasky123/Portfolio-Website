export default function Footer({ name, socials }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6">
        <p className="font-mono text-xs text-dim">
          © {new Date().getFullYear()} {name} · Built with React, deployed on Vercel
        </p>
        <div className="flex gap-5">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="font-mono text-xs tracking-widest text-dim uppercase transition-colors hover:text-amber"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
