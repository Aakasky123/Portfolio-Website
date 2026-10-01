import { useState } from "react";
import { STACK, USED_IN } from "../data/content";
import { useReveal } from "../lib/hooks";
import Chapter from "./Chapter";
import "./stack.css";

const WHERE = ["AT&T", "Flipkart", "TARS", "DocuMindAI", "SyncStream"];

export default function StackSection() {
  const [where, setWhere] = useState(null);
  const [peek, setPeek] = useState(null);
  const active = peek ?? where;
  const wallRef = useReveal({ threshold: 0.1 });

  const count = active ? Object.values(USED_IN).filter((w) => w.includes(active)).length : null;

  return (
    <section id="stack" className="section" aria-labelledby="stack-h">
      <span id="stack-h" className="sr-only">
        03 — The stack
      </span>
      <Chapter
        n="03"
        name="The stack"
        meta="Tools, and where they were used"
        title={["What I reach for."]}
        lead="Grouped the way my résumé groups them. Pick a place to see what I actually used there. The dimmed ones stay in the toolbox."
      />

      <div className="wrap">
        <div className="where" role="group" aria-label="Filter by where it was used">
          <span className="label">Used at</span>
          <button type="button" aria-pressed={where === null} onClick={() => setWhere(null)}>
            Everywhere
          </button>
          {WHERE.map((w) => (
            <button
              key={w}
              type="button"
              aria-pressed={where === w}
              onClick={() => setWhere(where === w ? null : w)}
              onMouseEnter={() => setPeek(w)}
              onMouseLeave={() => setPeek(null)}
              onFocus={() => setPeek(w)}
              onBlur={() => setPeek(null)}
            >
              {w}
            </button>
          ))}
          <span className="label where__count num" aria-live="polite">
            {active ? `${count} tools at ${active}` : "all tools"}
          </span>
        </div>

        <div className="wall" ref={wallRef} data-filter={active ? "on" : "off"}>
          {STACK.map((group, gi) => (
            <div key={group.id} className="wall__row reveal-kid" style={{ "--d": `${gi * 0.06}s` }}>
              <p className="label wall__cat">
                <span className="num">{String(gi + 1).padStart(2, "0")}</span> {group.label}
              </p>
              <ul className="wall__items serif" data-agent="text">
                {group.items.map((item) => {
                  const used = USED_IN[item] ?? [];
                  const hit = active ? used.includes(active) : false;
                  return (
                    <li key={item} data-hit={hit}>
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
