import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, FileText, Github, Linkedin, Mail } from "lucide-react";
import EngineeringConsole from "./EngineeringConsole";

const SOCIAL_ICONS = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Email: Mail,
};

const MotionDiv = motion.div;

export default function Hero({ content }) {
  const reduceMotion = useReducedMotion();

  const heroTransition = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <section id="home" className="section-anchor hero-section section-shell pt-10 sm:pt-14">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(390px,0.95fr)] lg:items-start lg:gap-10 xl:gap-12">
        <MotionDiv {...heroTransition} className="relative lg:pr-3">
          <div className="hero-name-badge flex w-fit items-center gap-2 rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface-soft)] px-4 py-2 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-[var(--color-brand)]">
            <span className="h-2 w-2 rounded-full bg-[var(--color-brand)] shadow-[0_0_18px_var(--color-brand)]" />
            Backend-heavy full-stack
          </div>

          <h1 className="hero-title max-w-[12ch] text-4xl font-semibold tracking-[-0.06em] text-[var(--color-heading)] sm:max-w-none sm:text-5xl lg:text-[5.4rem] xl:text-7xl">
            {content.role}
          </h1>

          <p className="hero-summary mt-7 max-w-[34rem] text-base text-[var(--color-text-muted)] sm:mt-8 sm:text-lg">
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
              Download Resume
            </a>
            <a href="#projects" className="cta-secondary justify-center sm:justify-start">
              <span>View Projects</span>
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
        </MotionDiv>

        <EngineeringConsole content={content} />
      </div>
    </section>
  );
}
