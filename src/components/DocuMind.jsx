import { useEffect, useRef, useState } from "react";
import { DOCUMIND } from "../data/content";
import { useOnScreen, useReducedMotion, useReveal } from "../lib/hooks";
import { isAbort, sleep } from "../lib/motion";

// Hybrid retrieval, slowed down: dense and keyword scores arrive separately,
// then Reciprocal Rank Fusion reorders the hits.
const K = 60;

function fuse(hits) {
  const rank = (i) => [...hits].sort((a, b) => b[i] - a[i]).map((h) => h[0]);
  const dense = rank(1);
  const kw = rank(2);
  return hits
    .map((h) => ({ id: h[0], rrf: 1 / (K + dense.indexOf(h[0]) + 1) + 1 / (K + kw.indexOf(h[0]) + 1) }))
    .sort((a, b) => b.rrf - a.rrf);
}

export default function DocuMind() {
  const ref = useReveal({ threshold: 0.2 });
  const specRef = useRef(null);
  const onScreen = useOnScreen(specRef, "0px 0px -10% 0px");
  const reduced = useReducedMotion();
  const [qi, setQi] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState("idle"); // idle | scoring | fused

  const run = DOCUMIND.queries[qi];
  const denseOrder = [...run.hits].sort((a, b) => b[1] - a[1]).map((h) => h[0]);
  const fused = fuse(run.hits);
  const order = phase === "fused" ? fused.map((f) => f.id) : denseOrder;

  useEffect(() => {
    if (!onScreen) return undefined;
    const ctrl = new AbortController();
    const { signal } = ctrl;
    const go = async () => {
      for (let q = qi; ; q = (q + 1) % DOCUMIND.queries.length) {
        const text = DOCUMIND.queries[q].q;
        setQi(q);
        setPhase("idle");
        if (reduced) setTyped(text);
        else {
          for (let i = 0; i <= text.length; i++) {
            setTyped(text.slice(0, i));
            await sleep(34, signal);
          }
        }
        await sleep(350, signal);
        setPhase("scoring");
        await sleep(1900, signal);
        setPhase("fused");
        await sleep(4600, signal);
      }
    };
    go().catch((e) => {
      if (!isAbort(e)) throw e;
    });
    return () => ctrl.abort();
    // Restart from the current query when it comes back on screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onScreen, reduced]);

  const top = fused[0].id;

  return (
    <div className="wrap">
      <article className="subwork reveal" ref={ref} aria-labelledby="documind-h">
        <div className="subwork__text">
          <p className="label">Also on the AI side</p>
          <h3 id="documind-h" className="subwork__title serif" data-agent="heading">
            {DOCUMIND.title}
          </h3>
          <p className="label subwork__kind">{DOCUMIND.kind}</p>
          <p className="subwork__body" data-agent="text">
            {DOCUMIND.body}
          </p>
          <p className="subwork__metric" data-agent="metric">
            <span className="serif num">{DOCUMIND.metric.value}</span>
            <span className="label">{DOCUMIND.metric.label}</span>
          </p>
          <ul className="chips" aria-label="DocuMindAI stack">
            {DOCUMIND.stack.map((s) => (
              <li key={s} className="chip">
                {s}
              </li>
            ))}
          </ul>
          <a className="label link" href={DOCUMIND.repo} target="_blank" rel="noreferrer" data-agent="link">
            Source on GitHub ↗
          </a>
        </div>

        <div className="rag" ref={specRef} aria-hidden data-agent="figure">
          <div className="rag__bar">
            <span className="rag__icon">⌕</span>
            <span className="rag__q">
              {typed}
              <i className="rag__caret" />
            </span>
          </div>
          <div className="rag__legend label">
            <span>
              <i className="rag__sw rag__sw--d" /> dense · cosine
            </span>
            <span>
              <i className="rag__sw rag__sw--k" /> keyword · bm25
            </span>
            <span className="rag__mode" data-phase={phase}>
              {phase === "fused" ? "RRF fused, k=60" : "ranked by dense"}
            </span>
          </div>
          <ol className="rag__hits" style={{ "--n": run.hits.length }}>
            {run.hits.map((h) => {
              const idx = order.indexOf(h[0]);
              const [file, ...rest] = h[0].split(" — ");
              return (
                <li
                  key={`${qi}-${h[0]}`}
                  className="rag__hit"
                  style={{ "--y": idx }}
                  data-top={phase === "fused" && h[0] === top}
                  data-on={phase !== "idle"}
                >
                  <span className="rag__rank num">{idx + 1}</span>
                  <span className="rag__doc">
                    <span className="rag__file">{file}</span>
                    <span className="rag__snip">{rest.join(" — ")}</span>
                  </span>
                  <span className="rag__scores">
                    <span className="rag__score">
                      <i className="rag__fill rag__fill--d" style={{ "--v": h[1] }} />
                      <span className="num">{h[1].toFixed(2)}</span>
                    </span>
                    <span className="rag__score">
                      <i className="rag__fill rag__fill--k" style={{ "--v": h[2] }} />
                      <span className="num">{h[2].toFixed(2)}</span>
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
          <p className="rag__foot label" data-on={phase === "fused"}>
            → answer grounded in <b>{top.split(" — ")[0]}</b>
          </p>
        </div>
      </article>
    </div>
  );
}
