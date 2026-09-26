import { useEffect, useRef, useState } from "react";
import { SYNCSTREAM } from "../data/content";
import { useOnScreen, useReducedMotion, useReveal } from "../lib/hooks";

// Two clients in one room. Scrub either one; the other follows after a
// simulated WebSocket round-trip. Room state survives both.

const LENGTH = 214; // seconds, 3:34
const BARS = 28;

const fmt = (t) => {
  const s = Math.max(0, Math.floor(t));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

function Frame({ t }) {
  return (
    <div className="ss__frame" aria-hidden>
      {Array.from({ length: BARS }, (_, i) => {
        const h = 0.18 + 0.82 * Math.abs(Math.sin(t * 0.9 + i * 0.55) * Math.cos(t * 0.37 + i * 0.21));
        return <i key={i} style={{ transform: `scaleY(${h.toFixed(3)})` }} />;
      })}
      <span className="ss__tc num">{fmt(t)}</span>
    </div>
  );
}

function Client({ name, who, t, onSeek, playing }) {
  return (
    <div className="ss__client">
      <p className="ss__who">
        <span className="label">{name}</span>
        <span className="label ss__whoami">{who}</span>
      </p>
      <Frame t={t} />
      <div className="ss__scrub">
        <span className="mono num">{fmt(t)}</span>
        <input
          type="range"
          min="0"
          max={LENGTH}
          step="0.1"
          value={t}
          onChange={(e) => onSeek(Number(e.target.value))}
          aria-label={`${name} playhead`}
          style={{ "--v": t / LENGTH }}
        />
        <span className="mono num">{fmt(LENGTH)}</span>
      </div>
      <p className="label ss__state">{playing ? "▶ playing" : "❚❚ paused"}</p>
    </div>
  );
}

export default function SyncStream() {
  const ref = useReveal({ threshold: 0.2 });
  const boxRef = useRef(null);
  const onScreen = useOnScreen(boxRef);
  const reduced = useReducedMotion();
  const [a, setA] = useState(42);
  const [b, setB] = useState(42);
  const [playing, setPlaying] = useState(true);
  const [packet, setPacket] = useState(null); // { dir, ms, id }
  const [msgs, setMsgs] = useState(0);
  const timers = useRef([]);

  // Both clients advance together while playing (30 fps is plenty here).
  useEffect(() => {
    if (!playing || !onScreen || reduced) return undefined;
    let last = performance.now();
    let raf = 0;
    const tick = (now) => {
      const dt = (now - last) / 1000;
      if (dt >= 1 / 30) {
        last = now;
        setA((v) => (v + dt) % LENGTH);
        setB((v) => (v + dt) % LENGTH);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, onScreen, reduced]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Real round-trips are 30–60 ms; replayed at 1/6 speed so you can see them.
  const SLOW = 6;
  const send = (dir, apply) => {
    const ms = 28 + Math.round(Math.random() * 36);
    setPacket({ dir, ms, id: performance.now() });
    setMsgs((m) => m + 1);
    timers.current.push(setTimeout(apply, ms * SLOW));
  };

  const seekA = (t) => {
    setA(t);
    send("ab", () => setB(t));
  };
  const seekB = (t) => {
    setB(t);
    send("ba", () => setA(t));
  };
  const toggle = () => {
    const next = !playing;
    setPlaying(next);
    send("ab", () => {});
  };

  const drift = Math.abs(a - b);

  return (
    <div className="wrap">
      <article className="subwork subwork--flip reveal" ref={ref} aria-labelledby="ss-h">
        <div className="subwork__text">
          <p className="label">Also on the systems side</p>
          <h3 id="ss-h" className="subwork__title serif" data-agent="heading">
            {SYNCSTREAM.title}
          </h3>
          <p className="label subwork__kind">{SYNCSTREAM.kind}</p>
          <p className="subwork__body" data-agent="text">
            {SYNCSTREAM.body}
          </p>
          <p className="subwork__try">
            <span className="label label--signal">Try it</span> Drag either playhead. The other client follows over the
            socket.
          </p>
          <ul className="chips" aria-label="SyncStream stack">
            {SYNCSTREAM.stack.map((s) => (
              <li key={s} className="chip">
                {s}
              </li>
            ))}
          </ul>
          <a className="label link" href={SYNCSTREAM.repo} target="_blank" rel="noreferrer" data-agent="link">
            Source on GitHub ↗
          </a>
        </div>

        <div className="ss" ref={boxRef} data-agent="figure">
          <div className="ss__bar">
            <span className="label">room #k7f2 · 2 members</span>
            <span className="label ss__persist">state persisted ✓</span>
          </div>
          <div className="ss__clients">
            <Client name="Client A" who="you" t={a} onSeek={seekA} playing={playing} />
            <div className="ss__wire" aria-hidden>
              <span className="ss__line" />
              {packet && <span key={packet.id} className={`ss__packet ss__packet--${packet.dir}`} style={{ "--ms": `${packet.ms * SLOW}ms` }} />}
              <span className="ss__lat mono num">{packet ? `${packet.ms} ms` : "idle"}</span>
            </div>
            <Client name="Client B" who="a friend" t={b} onSeek={seekB} playing={playing} />
          </div>
          <div className="ss__foot">
            <button type="button" className="btn btn--line ss__play" onClick={toggle}>
              {playing ? "Pause room" : "Play room"}
            </button>
            <span className="label num">drift {drift < 0.05 ? "0.00" : drift.toFixed(2)} s</span>
            <span className="label num">
              {msgs} msgs · ws shown at 1/{SLOW} speed
            </span>
          </div>
        </div>
      </article>
    </div>
  );
}
