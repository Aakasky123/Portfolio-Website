import { ABOUT } from "../data/content";
import { useReveal } from "../lib/hooks";
import Portrait from "./Portrait";
import "./about.css";

export default function AboutSection() {
  const headRef = useReveal({ threshold: 0.4 });
  const bodyRef = useReveal({ threshold: 0.2 });
  const factsRef = useReveal({ threshold: 0.2 });
  return (
    <section id="about" className="section about" aria-labelledby="about-h">
      <div className="wrap">
        <div className="chapter__bar about__bar">
          <span className="label chapter__n">(04)</span>
          <span className="label chapter__name">The human</span>
          <span className="chapter__rule about__rule" aria-hidden />
          <span className="label chapter__meta">About</span>
        </div>

        <div className="about__grid">
          <Portrait />

          <div className="about__text">
            <h2 id="about-h" className="about__title serif lines" ref={headRef} data-agent="heading">
              <span>
                <span>{ABOUT.headline}</span>
              </span>
            </h2>
            <div className="about__body reveal" ref={bodyRef} style={{ "--d": "0.15s" }}>
              {ABOUT.body.map((p) => (
                <p key={p.slice(0, 20)} data-agent="text">
                  {p}
                </p>
              ))}
            </div>

            <div ref={factsRef}>
              <dl className="facts">
                {ABOUT.facts.map((f, i) => (
                  <div key={f.k} className="reveal-kid" style={{ "--d": `${0.1 + i * 0.06}s` }} data-agent="text">
                    <dt className="label">{f.k}</dt>
                    <dd>{f.v}</dd>
                  </div>
                ))}
              </dl>

              <ol className="edu">
                {ABOUT.education.map((e, i) => (
                  <li key={e.school} className="reveal-kid" style={{ "--d": `${0.35 + i * 0.08}s` }} data-agent="text">
                    <p className="label num edu__time">{e.time}</p>
                    <div>
                      <p className="edu__degree serif">{e.degree}</p>
                      <p className="edu__school">{e.school}</p>
                      <p className="label edu__detail">{e.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
