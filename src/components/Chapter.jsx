import { useReveal } from "../lib/hooks";
import "./chapter.css";

// Chapter opener: machine-voice index bar, human-voice headline, lead.
export default function Chapter({ n, name, meta, title, lead, children }) {
  const barRef = useReveal({ threshold: 0.6 });
  const titleRef = useReveal({ threshold: 0.35 });
  const leadRef = useReveal({ threshold: 0.3 });
  return (
    <header className="chapter wrap">
      <div className="chapter__bar" ref={barRef}>
        <span className="label chapter__n">({n})</span>
        <span className="label chapter__name">{name}</span>
        <span className="chapter__rule" aria-hidden />
        {meta && <span className="label chapter__meta">{meta}</span>}
      </div>
      <h2 className="chapter__title serif lines" ref={titleRef} data-agent="heading">
        {title.map((line, i) => (
          <span key={line} style={{ "--i": i }}>
            <span>{line}</span>
          </span>
        ))}
      </h2>
      {lead && (
        <div className="chapter__lead reveal" ref={leadRef} style={{ "--d": "0.25s" }}>
          <p data-agent="text">{lead}</p>
          {children}
        </div>
      )}
    </header>
  );
}
