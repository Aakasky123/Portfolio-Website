import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, FileText, Github, Linkedin, Mail, MapPin } from "lucide-react";

const SOCIAL_ICONS = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Email: Mail,
};

export default function Hero({ content }) {
  const reduceMotion = useReducedMotion();
  const heroTransition = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
      };

  const panelTransition = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 30, scale: 0.985 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <section id="home" className="section-anchor section-shell pt-10 sm:pt-14">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,420px)] lg:items-center">
        <motion.div {...heroTransition} className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-soft)] px-4 py-2 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-[var(--color-brand)]">
            <span className="h-2 w-2 rounded-full bg-[var(--color-brand)] shadow-[0_0_18px_var(--color-brand)]" />
            {content.name}
          </div>

          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[0.95] tracking-[-0.06em] text-[var(--color-heading)] sm:text-5xl lg:text-7xl">
            {content.role}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--color-text-muted)] sm:text-lg">
            {content.summary}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={content.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary justify-center sm:justify-start"
            >
              <FileText size={18} />
              Resume
            </a>
            <a href="#projects" className="cta-secondary justify-center sm:justify-start">
              <span>Projects</span>
              <ArrowRight size={17} />
            </a>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {content.socials.map((social) => {
              const Icon = SOCIAL_ICONS[social.label];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={social.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  className="pill-link"
                >
                  {Icon ? <Icon size={16} /> : null}
                  {social.label}
                </a>
              );
            })}
          </div>
        </motion.div>

        <motion.aside {...panelTransition} className="panel hero-panel overflow-hidden">
          <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-brand)]/60 to-transparent" />

          <div className="grid gap-6 p-5 sm:p-7">
            <div className="relative overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] bg-[radial-gradient(circle_at_top,_rgba(125,211,252,0.2),_transparent_60%),linear-gradient(180deg,_rgba(255,255,255,0.04),_rgba(255,255,255,0.01))] p-4">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(125,211,252,0.08),transparent_55%)]" />
              <div className="relative flex items-center justify-center">
                <img
                  src={content.profilePhotoUrl}
                  alt={`${content.name} headshot`}
                  loading="eager"
                  width={320}
                  height={320}
                  className="h-56 w-56 rounded-[1.5rem] object-cover shadow-[0_30px_80px_-40px_rgba(56,189,248,0.85)] sm:h-72 sm:w-72"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--color-brand)]">
                  Based in
                </p>
                <div className="mt-2 flex items-start gap-3">
                  <span className="icon-badge mt-1">
                    <MapPin size={16} />
                  </span>
                  <div>
                    <p className="text-xl font-semibold text-[var(--color-heading)]">
                      {content.location}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[var(--color-text-muted)]">
                      {content.name}
                    </p>
                  </div>
                </div>
              </div>

              <a
                href={content.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-[var(--color-border)] bg-white/5 px-4 py-2 text-sm font-medium text-[var(--color-heading)] transition hover:border-[var(--color-border-strong)] hover:bg-white/10"
              >
                Resume
              </a>
            </div>

            <div className="grid gap-3">
              {content.heroFacts.map((fact) => (
                <div
                  key={fact}
                  className="flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white/[0.03] px-4 py-3 text-sm text-[var(--color-text-muted)]"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-brand)]/80" />
                  <span>{fact}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
