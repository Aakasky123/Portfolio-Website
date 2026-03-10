import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Mail, Phone } from "lucide-react";
import SectionHeader from "./SectionHeader";

export default function ContactSection({ contact, subtitle }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id="contact"
      className="section-anchor section-shell"
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="panel p-5 sm:p-7">
          <SectionHeader title="Contact" subtitle={subtitle} />

          <div className="mt-8 grid gap-4">
            <div className="contact-chip">
              <span className="icon-badge">
                <Mail size={16} />
              </span>
              <div>
                <p className="text-sm leading-7 text-[var(--color-text-muted)]">
                  Prefer email? Reach me at{" "}
                  <a className="text-[var(--color-heading)] underline decoration-[var(--color-brand)] underline-offset-4" href={`mailto:${contact.email}`}>
                    {contact.email}
                  </a>
                  .
                </p>
              </div>
            </div>

            <div className="contact-chip">
              <span className="icon-badge">
                <Phone size={16} />
              </span>
              <div>
                <p className="text-sm leading-7 text-[var(--color-text-muted)]">
                  Or use the quick form — Or call me at{" "}
                  <a className="text-[var(--color-heading)] underline decoration-[var(--color-brand)] underline-offset-4" href={contact.phoneHref}>
                    {contact.phone}
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>

        <form action={contact.formAction} method="POST" className="panel p-5 sm:p-7">
          <div className="grid gap-4">
            <label>
              <span className="sr-only">Your name</span>
              <input
                name="name"
                placeholder="Your name"
                className="input-shell"
                aria-label="Your name"
              />
            </label>

            <label>
              <span className="sr-only">Email</span>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input-shell"
                aria-label="Email"
              />
            </label>

            <label>
              <span className="sr-only">Message</span>
              <textarea
                name="message"
                placeholder="Message"
                rows={5}
                className="input-shell min-h-[160px] resize-y"
                aria-label="Message"
              />
            </label>

            <button type="submit" className="cta-primary mt-2 justify-center sm:justify-start">
              <span>Send</span>
              <ArrowRight size={17} />
            </button>
          </div>
        </form>
      </div>
    </motion.section>
  );
}
