import { useState } from "react";
import { CONTACT, SITE } from "../data/content";
import { useReveal } from "../lib/hooks";
import "./contact.css";

export default function Contact() {
  const titleRef = useReveal({ threshold: 0.3 });
  const bodyRef = useReveal({ threshold: 0.15 });
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [receipt, setReceipt] = useState(null);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SITE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${SITE.email}`;
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    try {
      const res = await fetch(SITE.formAction, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(String(res.status));
      setReceipt({ name: data.get("name"), email: data.get("email"), chars: String(data.get("message")).length });
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="contact" aria-labelledby="contact-h">
      <div className="wrap">
        <div className="chapter__bar contact__bar">
          <span className="label chapter__n">(05)</span>
          <span className="label chapter__name">Contact</span>
          <span className="chapter__rule about__rule" aria-hidden />
          <span className="label chapter__meta">Replies within a day</span>
        </div>

        <h2 id="contact-h" className="contact__title serif lines" ref={titleRef} data-agent="heading">
          <span>
            <span>
              {CONTACT.headline}
              <i className="contact__caret" aria-hidden />
            </span>
          </span>
        </h2>

        <div className="contact__grid reveal" ref={bodyRef}>
          <div className="contact__direct">
            <p className="contact__body" data-agent="text">
              {CONTACT.body}
            </p>

            <div className="contact__email">
              <a className="contact__addr serif" href={`mailto:${SITE.email}`} data-agent="link">
                {SITE.email}
              </a>
              <button type="button" className="contact__copy label" onClick={copy} data-agent="button">
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>

            <ul className="contact__links">
              <li>
                <a className="link" href={SITE.phoneHref} data-agent="link">
                  {SITE.phone}
                </a>
              </li>
              <li>
                <a className="link" href={SITE.github} target="_blank" rel="noreferrer" data-agent="link">
                  GitHub ↗
                </a>
              </li>
              <li>
                <a className="link" href={SITE.linkedin} target="_blank" rel="noreferrer" data-agent="link">
                  LinkedIn ↗
                </a>
              </li>
              <li>
                <a className="link" href={SITE.resumeUrl} download data-agent="link">
                  Résumé (PDF)
                </a>
              </li>
            </ul>
          </div>

          <form className="cform" onSubmit={submit} data-status={status}>
            <p className="label cform__title">Or leave a message</p>
            <label className="cform__field">
              <span className="label">Name</span>
              <input name="name" type="text" autoComplete="name" required data-agent="input" />
            </label>
            <label className="cform__field">
              <span className="label">Email</span>
              <input name="email" type="email" autoComplete="email" required data-agent="input" />
            </label>
            <label className="cform__field">
              <span className="label">Message</span>
              <textarea name="message" rows="4" required placeholder="What are you building?" data-agent="input" />
            </label>
            <div className="cform__foot">
              <button type="submit" className="btn btn--ink" disabled={status === "sending"} data-agent="button">
                {status === "sending" ? "Sending…" : "Send message"} <span className="btn__arrow" aria-hidden>→</span>
              </button>
              <p className="cform__status mono" role="status">
                {status === "sent" && receipt && (
                  <>
                    <b>Sent ✓</b> read-back: {receipt.name} &lt;{receipt.email}&gt; · {receipt.chars} chars
                  </>
                )}
                {status === "error" && (
                  <>
                    <b className="cform__err">Didn’t go through.</b> Email {SITE.email} directly.
                  </>
                )}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
