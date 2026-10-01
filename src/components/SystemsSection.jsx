import { EXPERIENCE, SYSTEMS } from "../data/content";
import { useReveal } from "../lib/hooks";
import Chapter from "./Chapter";
import Stream from "./Stream";
import SyncStream from "./SyncStream";
import "./systems.css";

// Wrap numbers in the log so the outcomes scan at a glance.
const NUM = /((?<![A-Za-z+\d.,])~?\d[\d,.]*(?:\s?(?:%|(?:ms|k|M|x|RPS|hours|minutes|min)\b))?(?:\/(?:day|month|week))?)/g;
function highlight(text) {
  const parts = text.split(NUM);
  return parts.map((p, i) => (i % 2 ? <b key={i}>{p}</b> : p));
}

function Outcomes() {
  const ref = useReveal({ threshold: 0.2 });
  return (
    <div className="wrap">
      <div className="outcomes__head">
        <p className="label">Measured outcomes · AT&amp;T</p>
        <p className="label outcomes__legend">
          <i className="outcomes__sw" /> what was cut
        </p>
      </div>
      <ol className="outcomes" ref={ref}>
        {SYSTEMS.outcomes.map((o, i) => (
          <li key={o.label} className="outcome reveal-kid" style={{ "--d": `${i * 0.07}s`, "--r": o.ratio }} data-agent="metric">
            <p className="label outcome__label">{o.label}</p>
            <p className="outcome__big serif num">{o.big}</p>
            <p className="outcome__ft mono">
              <s>{o.from}</s> <span aria-hidden>→</span> <span>{o.to}</span>
            </p>
            <div className="outcome__bar" aria-hidden>
              <i />
            </div>
            <p className="outcome__note">{o.note}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Job({ job, i }) {
  const ref = useReveal({ threshold: 0.2 });
  return (
    <article className="job reveal" ref={ref} style={{ "--d": `${i * 0.05}s` }} aria-labelledby={`job-${i}`}>
      <div className="job__when">
        <p className="label num">{job.time}</p>
        <p className="label job__place">{job.place}</p>
      </div>
      <div className="job__main">
        <h3 id={`job-${i}`} className="job__co serif" data-agent="heading">
          {job.company}
        </h3>
        <p className="job__role">{job.role}</p>
        <p className="job__sum" data-agent="text">
          {job.summary}
        </p>
        <ul className="chips job__stack" aria-label={`${job.company} stack`}>
          {job.stack.map((s) => (
            <li key={s} className="chip">
              {s}
            </li>
          ))}
        </ul>
        <details className="job__log">
          <summary data-agent="button">
            <span className="job__plus" aria-hidden />
            <span className="label">Full log</span>
            <span className="label job__count num">{String(job.log.length).padStart(2, "0")} entries</span>
          </summary>
          <ol className="job__entries">
            {job.log.map((line, j) => (
              <li key={j}>
                <span className="mono job__n num">{String(j + 1).padStart(2, "0")}</span>
                <p>{highlight(line)}</p>
              </li>
            ))}
          </ol>
        </details>
      </div>
    </article>
  );
}

export default function SystemsSection() {
  return (
    <section id="systems" className="section systems" aria-labelledby="systems-h">
      <span id="systems-h" className="sr-only">
        02 — The systems
      </span>
      <Chapter n="02" name="The systems" meta="AT&T · Flipkart" title={SYSTEMS.headline} lead={SYSTEMS.lead} />

      <Stream />
      <Outcomes />

      <div className="wrap jobs">
        <div className="jobs__head">
          <p className="label">Experience</p>
          <p className="label">4+ years in production</p>
        </div>
        {EXPERIENCE.map((job, i) => (
          <Job key={job.company} job={job} i={i} />
        ))}
      </div>

      <SyncStream />
    </section>
  );
}
