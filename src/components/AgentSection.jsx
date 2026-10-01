import { TARS } from "../data/content";
import { useReveal } from "../lib/hooks";
import Chapter from "./Chapter";
import TarsDemo from "./TarsDemo";
import DocuMind from "./DocuMind";
import "./sections.css";

function Principles() {
  const ref = useReveal({ threshold: 0.25 });
  return (
    <ol className="principles" ref={ref}>
      {TARS.principles.map((p, i) => (
        <li key={p.n} className="principle reveal-kid" style={{ "--d": `${i * 0.08}s` }}>
          <span className="principle__n serif" aria-hidden>
            {p.n}.
          </span>
          <h3 className="principle__title serif" data-agent="heading">
            {p.title}
          </h3>
          <p className="principle__body" data-agent="text">
            {p.body}
          </p>
        </li>
      ))}
    </ol>
  );
}

export default function AgentSection() {
  const demoRef = useReveal({ threshold: 0.1 });
  const metaRef = useReveal({ threshold: 0.5 });
  return (
    <section id="agent" className="section" aria-labelledby="agent-h">
      <span id="agent-h" className="sr-only">
        01 — The agent: TARS
      </span>
      <Chapter n="01" name="The agent" meta="TARS — computer-use agent" title={TARS.headline} lead={TARS.lead}>
        <p className="chapter__cue">
          <span className="label label--signal">Live demo ↓</span> {TARS.demoLead}
        </p>
      </Chapter>

      <div id="demo" className="wrap section__demo reveal" ref={demoRef}>
        <TarsDemo />
      </div>

      <div className="wrap">
        <div className="demo__meta reveal" ref={metaRef}>
          <p className="label">Simulated in your browser. The real TARS runs on your machine.</p>
          <ul className="chips" aria-label="TARS stack">
            {TARS.stack.map((s) => (
              <li key={s} className="chip">
                {s}
              </li>
            ))}
          </ul>
          <a className="label link demo__src" href="#contact" data-agent="link">
            Source on request →
          </a>
        </div>
        <Principles />
      </div>

      <DocuMind />
    </section>
  );
}
