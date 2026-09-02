import { useState } from "react";
import { ArrowUpRight, Send } from "lucide-react";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";

const inputClass =
  "w-full border border-line bg-ink-2 px-4 py-3 text-sm text-fg placeholder:text-dim focus:border-amber focus:outline-none transition-colors";

export default function ContactSection({ contact }) {
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    try {
      const response = await fetch(contact.formAction, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (response.ok) {
        form.reset();
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="scroll-mt-24 py-16 sm:py-24">
      <SectionHeader index="05" title="Contact" subtitle={contact.heading} />
      <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <Reveal>
          <p className="max-w-md leading-relaxed text-mute">{contact.sub}</p>
          <div className="mt-8 space-y-3">
            <a
              href={`mailto:${contact.email}`}
              className="group flex items-center gap-2 font-display text-xl font-semibold text-fg transition-colors hover:text-amber sm:text-2xl"
            >
              {contact.email}
              <ArrowUpRight
                size={18}
                className="text-dim transition-colors group-hover:text-amber"
              />
            </a>
            <a
              href={contact.phoneHref}
              className="block font-mono text-sm text-mute transition-colors hover:text-amber"
            >
              {contact.phone}
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form onSubmit={handleSubmit} className="ticks border border-line bg-panel p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <input className={inputClass} type="text" name="name" placeholder="Name" required />
              <input className={inputClass} type="email" name="email" placeholder="Email" required />
            </div>
            <textarea
              className={`${inputClass} mt-4 min-h-[130px] resize-y`}
              name="message"
              placeholder="What are you building?"
              required
            />
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={status === "sending"}
                className="shine inline-flex items-center gap-2 bg-amber px-5 py-2.5 font-mono text-xs font-semibold tracking-widest text-ink uppercase transition-colors hover:bg-amber-deep hover:text-fg disabled:opacity-60"
              >
                <Send size={13} />
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
              {status === "sent" && (
                <span className="font-mono text-xs tracking-wider text-green uppercase">
                  Sent — talk soon.
                </span>
              )}
              {status === "error" && (
                <span className="font-mono text-xs tracking-wider text-amber uppercase">
                  Something broke — email me directly.
                </span>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
