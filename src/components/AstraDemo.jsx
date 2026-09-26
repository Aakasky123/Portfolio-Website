import { useEffect, useLayoutEffect, useReducer, useRef, useState } from "react";
import { DEMO, SITE } from "../data/content";
import { glide, isAbort, sleep, travelTime } from "../lib/motion";
import { useReducedMotion } from "../lib/hooks";
import CursorMark from "./CursorMark";
import "./astra.css";

// A scripted run of Astra filling in a job application: Aakash's, addressed
// to whoever is reading. It stops at the submit button and waits for a human.

const F = DEMO.fields;
const OPTIONS = ["0–1 years", "2–3 years", "4+ years"];
const VAULT_DOTS = "••••••••••••";

const LOOP = [
  { k: "observe", label: "Observe", kinds: ["OBS"] },
  { k: "decide", label: "Decide", kinds: ["PLAN"] },
  { k: "act", label: "Act", kinds: ["ACT"] },
  { k: "verify", label: "Verify", kinds: ["VRFY"] },
];

const EMPTY = { name: "", email: "", years: "", link: "", password: "", why: "" };

const initial = {
  status: "idle", // idle | running | gate | submitting | approved | denied
  values: EMPTY,
  focus: null,
  menu: false,
  hover: null,
  shot: 0,
  masked: false,
  log: [],
  kind: null,
  verified: 0,
  runId: "",
  duration: 0,
};

function reducer(s, a) {
  switch (a.type) {
    case "start":
      return { ...initial, status: "running", runId: a.runId };
    case "log":
      return {
        ...s,
        log: [...s.log, a.line],
        kind: a.line.kind,
        verified: s.verified + (a.line.kind === "VRFY" ? 1 : 0),
      };
    case "value":
      return { ...s, values: { ...s.values, [a.id]: a.value } };
    case "set":
      return { ...s, ...a.patch };
    default:
      return s;
  }
}

const hex = () => Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, "0");

function Field({ id, label, wide, children, state, fieldRefs, box }) {
  const focused = state.focus === id;
  return (
    <div className={`fx-field ${wide ? "fx-field--wide" : ""}`} data-box={box}>
      <span className="fx-label">{label}</span>
      <div
        className="fx-input"
        data-focus={focused}
        data-kind={id}
        data-agent={id === "years" ? "select" : "input"}
        data-agent-click=""
        ref={(el) => (fieldRefs.current[id] = el)}
      >
        {children}
        {focused && id !== "years" && id !== "password" && <i className="fx-caret" />}
      </div>
    </div>
  );
}

export default function AstraDemo() {
  const [state, dispatch] = useReducer(reducer, initial);
  const [run, setRun] = useState(0);
  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  reducedRef.current = reduced;

  const rootRef = useRef(null);
  const screenRef = useRef(null);
  const pointerRef = useRef(null);
  const fieldRefs = useRef({});
  const optionRefs = useRef([]);
  const submitRef = useRef(null);
  const logRef = useRef(null);
  const approveRef = useRef(null);
  const decide = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  // Start the first run when the demo is properly in view.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || reduced) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRun((r) => (r === 0 ? 1 : r));
          io.disconnect();
        }
      },
      { threshold: 0.45 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  // Keep the newest trace line in view.
  useLayoutEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [state.log.length]);

  useEffect(() => {
    if (state.status === "gate") approveRef.current?.focus({ preventScroll: true });
  }, [state.status]);

  // The run itself.
  useEffect(() => {
    if (run === 0) return undefined;
    const ctrl = new AbortController();
    const { signal } = ctrl;
    const fast = reducedRef.current;
    const t0 = performance.now();
    const screen = screenRef.current;

    dispatch({ type: "start", runId: `0x${hex()}` });

    const stamp = () => ((performance.now() - t0) / 1000).toFixed(2).padStart(5, "0");
    const log = (kind, text) =>
      dispatch({ type: "log", line: { kind, text, t: stamp(), key: `${performance.now()}-${Math.random()}` } });
    const set = (patch) => dispatch({ type: "set", patch });
    const wait = (ms) => sleep(fast ? Math.min(ms, 40) : ms, signal);

    const place = (x, y) => {
      pos.current = { x, y };
      if (pointerRef.current) pointerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };
    const aim = (el, ax = 0.18, ay = 0.6) => {
      const s = screen.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return { x: r.left - s.left + r.width * ax, y: r.top - s.top + r.height * ay };
    };
    const moveTo = async (el, ax, ay) => {
      const to = aim(el, ax, ay);
      if (fast) return place(to.x, to.y);
      await glide({
        from: pos.current,
        to,
        duration: travelTime(pos.current, to, 320, 0.45, 850),
        curve: 0.08,
        signal,
        onFrame: place,
      });
    };
    const click = async () => {
      const p = pointerRef.current;
      if (p) {
        p.classList.remove("is-click");
        void p.offsetWidth;
        p.classList.add("is-click");
      }
      await wait(140);
    };
    const type = async (id, text, msPerChar) => {
      if (fast) return dispatch({ type: "value", id, value: text });
      for (let i = 1; i <= text.length; i++) {
        dispatch({ type: "value", id, value: text.slice(0, i) });
        const ch = text[i - 1];
        const pause = ch === " " ? 1.6 : /[.,@]/.test(ch) ? 2.2 : 1;
        await sleep(msPerChar * pause * (0.6 + Math.random() * 0.8), signal);
      }
    };
    const shot = async (n, what) => {
      set({ shot: n });
      log("OBS", `screenshot #${n} · ${what}`);
      await wait(1100);
      set({ shot: 0 });
    };
    const fill = async (id, plan, text, ms) => {
      log("PLAN", plan);
      await wait(260);
      await moveTo(fieldRefs.current[id]);
      await click();
      set({ focus: id });
      log("ACT", `click · type ${text.length > 24 ? `${text.length} chars` : `"${text}"`}`);
      await type(id, text, ms);
      await wait(200);
      log("VRFY", "read-back matches intent ✓");
      await wait(380);
    };

    const script = async () => {
      place(screen.offsetWidth * 0.82, screen.offsetHeight * 0.92);
      await wait(500);
      await shot(1, "form · 6 fields, 1 button");
      await wait(200);

      await fill("name", "full_name ← profile.name", F.name, 42);
      await fill("email", "email ← profile.email", F.email, 30);

      log("PLAN", `experience ← "${F.years}"`);
      await wait(260);
      await moveTo(fieldRefs.current.years, 0.78);
      await click();
      set({ focus: "years", menu: true });
      log("ACT", "open dropdown · 3 options");
      await wait(420);
      await moveTo(optionRefs.current[2], 0.3, 0.5);
      set({ hover: "opt-2" });
      await wait(160);
      await click();
      dispatch({ type: "value", id: "years", value: F.years });
      set({ menu: false, hover: null });
      log("VRFY", "option[2] selected ✓");
      await wait(380);

      await fill("link", "portfolio ← profile.github", F.link, 30);

      log("PLAN", "password ← vault://careers-portal");
      await wait(260);
      await moveTo(fieldRefs.current.password);
      await click();
      set({ focus: "password" });
      log("ACT", "inject from vault · value never enters the model");
      await wait(320);
      dispatch({ type: "value", id: "password", value: VAULT_DOTS });
      set({ masked: true });
      await wait(260);
      log("VRFY", "field filled ✓ · masked in screenshots");
      await wait(380);

      await fill("why", "why ← compose · ≤ 100 chars · tone: direct", F.why, 24);
      set({ focus: null });

      await shot(2, "form complete · password masked");
      log("PLAN", 'click "Submit application"');
      await wait(240);
      await moveTo(submitRef.current, 0.5, 0.55);
      set({ hover: "submit" });
      await wait(260);
      log("GATE", "submit is irreversible → holding for human approval");
      set({ status: "gate" });

      const decision = await new Promise((resolve, reject) => {
        decide.current = resolve;
        signal.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError")), { once: true });
      });
      decide.current = null;

      if (decision === "approve") {
        log("HUMAN", "approved by you");
        set({ status: "submitting" });
        await wait(300);
        await click();
        log("ACT", 'click "Submit application"');
        await wait(1000);
        set({ status: "approved", hover: null, duration: (performance.now() - t0) / 1000 });
        log("VRFY", "confirmation page detected ✓");
      } else {
        log("HUMAN", "denied by you");
        set({ hover: null });
        await wait(200);
        log("ABORT", "nothing submitted · session closed");
        set({ status: "denied", duration: (performance.now() - t0) / 1000 });
      }
    };

    script().catch((err) => {
      if (!isAbort(err)) throw err;
    });
    return () => ctrl.abort();
  }, [run]);

  const onDecide = (d) => decide.current?.(d);
  const replay = () => setRun((r) => r + 1);

  const { status, values, log, kind } = state;
  const gateOpen = status === "gate";
  const done = status === "approved" || status === "denied";
  const loopActive = LOOP.find((l) => l.kinds.includes(kind))?.k;
  const statusText = {
    idle: "standing by",
    running: "running",
    gate: "waiting for you",
    submitting: "running",
    approved: "done · submitted",
    denied: "done · aborted",
  }[status];

  return (
    <div className="astra" ref={rootRef}>
      <div className="astra__stage">
        {/* The screen Astra is operating */}
        <div className="astra__screen" ref={screenRef} data-shot={state.shot > 0} aria-hidden>
          <div className="fx-chrome">
            <span className="fx-url" data-agent="url">
              <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden>
                <path d="M4.5 7V5a3.5 3.5 0 0 1 7 0v2M3.5 7h9v7h-9z" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              {DEMO.url}
            </span>
            <span className="fx-allow">allow-listed ✓</span>
          </div>

          <div className="fx-page" data-state={status}>
            <header className="fx-head">
              <span className="fx-logo">
                <i />
                Your&nbsp;Company
              </span>
              <span className="fx-nav">Careers</span>
            </header>

            {status === "approved" ? (
              <div className="fx-done">
                <span className="fx-check">✓</span>
                <h4>Application received</h4>
                <p>Thanks, Aakash. The hiring team will review your application and be in touch.</p>
              </div>
            ) : (
              <>
                <div className="fx-title">
                  <p className="fx-eyebrow">Apply · Remote · Full-time</p>
                  <h4>{DEMO.role}</h4>
                </div>
                {status === "denied" && <div className="fx-banner">Submission cancelled by a human. Nothing was sent.</div>}
                <div className="fx-form">
                  <Field id="name" label="Full name" state={state} fieldRefs={fieldRefs} box="input · 0.992">
                    {values.name}
                  </Field>
                  <Field id="email" label="Email" state={state} fieldRefs={fieldRefs} box="input · 0.989">
                    {values.email}
                  </Field>
                  <Field id="years" label="Experience" state={state} fieldRefs={fieldRefs} box="select · 0.981">
                    <span className={values.years ? "" : "fx-ph"}>{values.years || "Select…"}</span>
                    <span className="fx-chev">⌄</span>
                    {state.menu && (
                      <span className="fx-menu">
                        {OPTIONS.map((o, i) => (
                          <span
                            key={o}
                            ref={(el) => (optionRefs.current[i] = el)}
                            className="fx-opt"
                            data-hover={state.hover === `opt-${i}`}
                          >
                            {o}
                          </span>
                        ))}
                      </span>
                    )}
                  </Field>
                  <Field id="link" label="GitHub or portfolio" state={state} fieldRefs={fieldRefs} box="input · 0.986">
                    {values.link}
                  </Field>
                  <Field id="password" label="Candidate-portal password" wide state={state} fieldRefs={fieldRefs} box="input[password] · 0.994">
                    <span className="fx-dots">{values.password}</span>
                    {values.password && <span className="fx-vault">vault · hidden from model</span>}
                    {state.masked && <span className="fx-mask">masked</span>}
                  </Field>
                  <Field id="why" label="Why should we hire you?" wide state={state} fieldRefs={fieldRefs} box="textarea · 0.978">
                    <span className="fx-area">{values.why}</span>
                  </Field>
                  <div className="fx-actions">
                    <span
                      className="fx-submit"
                      ref={submitRef}
                      data-hover={state.hover === "submit"}
                      data-busy={status === "submitting"}
                      data-box="button · 0.997"
                      data-agent="button"
                      data-agent-click=""
                    >
                      {status === "submitting" ? "Submitting…" : "Submit application"}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          {!reduced && (
            <div className="apointer astra__pointer" ref={pointerRef}>
              <span className="apointer__ring" />
              <CursorMark className="apointer__mark" />
            </div>
          )}
          <div className="astra__viewfinder" />
        </div>

        {/* Approval gate: outside the aria-hidden screen so it's reachable */}
        {gateOpen && (
          <div className="gate" role="alertdialog" aria-labelledby="gate-title" aria-describedby="gate-desc">
            <p className="label gate__kicker">
              <span className="gate__pulse" aria-hidden /> Approval required
            </p>
            <h4 id="gate-title" className="gate__title">
              Astra wants to click <em>“Submit application.”</em>
            </h4>
            <p id="gate-desc" className="gate__desc">
              Submitting can’t be undone, so the agent won’t do it on its own. It will wait for as long as you take.
            </p>
            <div className="gate__actions">
              <button type="button" className="btn btn--ink" ref={approveRef} onClick={() => onDecide("approve")}>
                Approve
              </button>
              <button type="button" className="btn btn--line" onClick={() => onDecide("deny")}>
                Deny
              </button>
            </div>
          </div>
        )}
        {status === "idle" && reduced && (
          <div className="gate gate--start">
            <p className="gate__desc">Watch Astra fill in a job application, step by step.</p>
            <div className="gate__actions">
              <button type="button" className="btn btn--ink" onClick={replay}>
                Run Astra
              </button>
            </div>
          </div>
        )}
      </div>

      {/* The trace */}
      <aside className="astra__trace" aria-label="Agent trace">
        <div className="trace__head">
          <span className="label trace__title">Astra · trace</span>
          <span className="label trace__run num">{state.runId || "run —"}</span>
          <span className="trace__status" data-status={status}>
            <i aria-hidden />
            <span className="label">{statusText}</span>
          </span>
        </div>

        <ol className="trace__log mono" ref={logRef} data-agent="log">
          {log.map((l, i) => (
            <li key={l.key} data-kind={l.kind}>
              <span className="trace__i num">{String(i + 1).padStart(2, "0")}</span>
              <span className="trace__t num">{l.t}</span>
              <b className="trace__k">{l.kind}</b>
              <span className="trace__x">{l.text}</span>
            </li>
          ))}
          {status !== "idle" && !done && (
            <li className="trace__cursor" aria-hidden>
              <span className="trace__i" />
              <span className="trace__t" />
              <span className="trace__blink">▍</span>
            </li>
          )}
        </ol>

        {done && (
          <div className="receipt" role="status">
            <p className="label receipt__title">Audit receipt · {state.runId}</p>
            <dl className="receipt__rows mono">
              <div><dt>steps</dt><dd>{log.length}</dd></div>
              <div><dt>verified</dt><dd>{state.verified}/{state.verified}</dd></div>
              <div><dt>human approvals</dt><dd>{status === "approved" ? "1 (you)" : "0"}</dd></div>
              <div><dt>secrets shown to model</dt><dd>0</dd></div>
              <div><dt>submitted</dt><dd>{status === "approved" ? "yes" : "no"}</dd></div>
              <div><dt>duration</dt><dd>{state.duration.toFixed(1)} s</dd></div>
            </dl>
            <div className="receipt__actions">
              {status === "approved" ? (
                <a className="btn btn--ink" href={`mailto:${SITE.email}?subject=${encodeURIComponent("Saw Astra apply — let's talk")}`}>
                  Make it official <span className="btn__arrow" aria-hidden>→</span>
                </a>
              ) : (
                <span className="receipt__note">No harm done. That’s what the gate is for.</span>
              )}
              <button type="button" className="btn btn--line" onClick={replay}>
                Replay
              </button>
            </div>
          </div>
        )}

        <div className="trace__loop" aria-hidden>
          {LOOP.map((l, i) => (
            <span key={l.k} className="trace__node" data-on={loopActive === l.k}>
              {l.label}
              {i < LOOP.length - 1 && <i />}
            </span>
          ))}
          <span className="trace__node trace__node--gate" data-on={gateOpen}>
            Gate
          </span>
        </div>
      </aside>

      <p className="sr-only" aria-live="polite">
        {status === "gate" && "Astra has filled in the application and is waiting for your approval to submit it."}
        {status === "approved" && "Application submitted after your approval."}
        {status === "denied" && "Submission denied. Nothing was sent."}
      </p>
    </div>
  );
}
