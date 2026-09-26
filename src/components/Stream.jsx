import { useEffect, useRef, useState } from "react";
import { useMedia, useOnScreen, useReducedMotion } from "../lib/hooks";
import "./stream.css";

// 40M events/day is ~463 per second. On desktop every dot is one event,
// emitted at that rate. They leave 12 upstream sources, get keyed into
// partitions, and fan out to consumers. A few are anomalies: most get paged,
// some are recognized as seasonal and suppressed.

const PER_SECOND = 40_000_000 / 86_400;
const SOURCES = 12;
const SINKS = ["correlate", "score · ML", "store · PG"];
const ANOMALY_RATE = 1 / 420;
const BATCH_WINDOW = 4.2; // seconds on screen; hours in production

const smooth = (t) => t * t * (3 - 2 * t);

function readColors(el) {
  const cs = getComputedStyle(el);
  return {
    ink: cs.getPropertyValue("--ink").trim() || "#121211",
    signal: cs.getPropertyValue("--signal").trim() || "#ff4f12",
    mute: cs.getPropertyValue("--mute").trim() || "#66635c",
  };
}

export default function Stream() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const countRef = useRef(null);
  const rateRef = useRef(null);
  const modeRef = useRef("stream");
  const [mode, setMode] = useState("stream");
  const onScreen = useOnScreen(wrapRef, "100px 0px");
  const reduced = useReducedMotion();
  const narrow = useMedia("(max-width: 760px)");
  const openedAt = useRef(performance.now());

  modeRef.current = mode;

  // "Since you opened this page" keeps counting even while off screen.
  useEffect(() => {
    const id = setInterval(() => {
      const n = Math.floor(((performance.now() - openedAt.current) / 1000) * PER_SECOND);
      if (countRef.current) countRef.current.textContent = n.toLocaleString("en-US");
    }, 100);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const sample = narrow ? 2 : 1; // one dot per `sample` events
    const lanes = narrow ? 4 : 6;
    let W = 0;
    let H = 0;
    let colors = readColors(wrap);
    let still = null; // redraws the still frame (reduced motion) after a resize

    const layout = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      colors = readColors(wrap);
      still?.();
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(canvas);

    const top = 70;
    const bottom = () => H - 34;
    const srcY = (i) => top + ((bottom() - top) * (i + 0.5)) / SOURCES;
    const laneY = (i) => top + 18 + ((bottom() - top - 36) * (i + 0.5)) / lanes;
    const sinkY = (i) => top + ((bottom() - top) * (i + 0.5)) / SINKS.length;
    const xA = () => W * (narrow ? 0.24 : 0.2);
    const xWall = () => W * (narrow ? 0.34 : 0.3);
    const xB = () => W * 0.74;
    const xScore = () => W * 0.86;

    // Uneven source weights so the flow looks like real traffic.
    const weights = Array.from({ length: SOURCES }, (_, i) => 0.5 + ((i * 7919) % 13) / 9);
    const wSum = weights.reduce((a, b) => a + b, 0);
    const pickSource = () => {
      let r = Math.random() * wSum;
      for (let i = 0; i < SOURCES; i++) if ((r -= weights[i]) <= 0) return i;
      return SOURCES - 1;
    };

    const ps = [];
    const marks = []; // anomaly detections on screen
    let carry = 0;
    let last = performance.now();
    let raf = 0;
    let windowStart = performance.now();
    let flushing = false;
    let queued = 0;

    const yAt = (p) => {
      const a = xA();
      const b = xB();
      let y;
      if (p.x < a) y = srcY(p.src) + (laneY(p.lane) - srcY(p.src)) * smooth(Math.max(0, p.x) / a);
      else if (p.x < b) y = laneY(p.lane);
      else y = laneY(p.lane) + (sinkY(p.sink) - laneY(p.lane)) * smooth((p.x - b) / (W - b));
      return y + p.o;
    };

    const spawn = (n) => {
      for (let i = 0; i < n; i++) {
        const lane = (Math.random() * lanes) | 0;
        ps.push({
          x: -Math.random() * 12,
          src: pickSource(),
          lane,
          sink: Math.min(SINKS.length - 1, Math.floor((lane / lanes) * SINKS.length + Math.random() * 0.6)),
          o: (Math.random() - 0.5) * (narrow ? 5 : 7),
          v: 0.85 + Math.random() * 0.3,
          a: Math.random() < ANOMALY_RATE,
          held: false,
          scored: false,
        });
      }
    };

    const drawStatic = () => {
      ctx.save();
      ctx.font = `500 10px ${getComputedStyle(document.body).getPropertyValue("--f-mono")}`;
      ctx.textBaseline = "middle";
      // sources
      ctx.fillStyle = colors.mute;
      for (let i = 0; i < SOURCES; i++) {
        const y = srcY(i);
        ctx.globalAlpha = 0.9;
        ctx.fillRect(0, y - 3, 3, 6);
        if (!narrow) ctx.fillText(`SRC·${String(i + 1).padStart(2, "0")}`, 10, y);
      }
      // lanes
      ctx.globalAlpha = 1;
      for (let i = 0; i < lanes; i++) {
        const y = laneY(i);
        ctx.fillStyle = colors.ink;
        ctx.globalAlpha = 0.07;
        ctx.fillRect(xA(), y - 4, xB() - xA(), 8);
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = colors.mute;
        ctx.fillText(`P${i}`, xA() + 6, y - 12);
      }
      // sinks
      ctx.textAlign = "right";
      for (let i = 0; i < SINKS.length; i++) {
        const y = sinkY(i);
        ctx.globalAlpha = 1;
        ctx.fillStyle = colors.ink;
        ctx.fillRect(W - 3, y - 10, 3, 20);
        ctx.fillStyle = colors.mute;
        ctx.fillText(SINKS[i].toUpperCase(), W - 10, y - 18);
      }
      // scoring line
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = colors.signal;
      for (let y = top; y < bottom(); y += 6) ctx.fillRect(xScore(), y, 1, 3);
      ctx.restore();
    };

    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const batch = modeRef.current === "batch";
      const wall = xWall();

      // emit
      carry += (PER_SECOND / sample) * dt;
      const n = carry | 0;
      carry -= n;
      spawn(n);

      // batch window: hold everything at the wall, then flush in one go
      if (batch) {
        const age = (now - windowStart) / 1000;
        if (!flushing && age > BATCH_WINDOW) {
          flushing = true;
          windowStart = now;
        } else if (flushing && age > 1.1) {
          flushing = false;
          windowStart = now;
        }
      } else {
        flushing = false;
      }

      ctx.clearRect(0, 0, W, H);
      drawStatic();

      // Slow enough that ~463 dots a second read as a mass, not a sprinkle.
      const speed = Math.max(140, W * 0.15);
      queued = 0;
      ctx.fillStyle = colors.ink;
      ctx.globalAlpha = 0.62;

      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        let nx = p.x + speed * p.v * dt;
        if (batch && !flushing && (p.held || (p.x <= wall && nx > wall - 2))) {
          // pile up behind the wall until the window closes
          p.held = true;
          nx = wall - 2 - (queued % 40) * 0.6 - Math.floor(queued / 40) * 0.45;
          queued += 1;
        } else if (p.held) {
          p.held = false;
          p.v *= 1.25;
        }
        p.x = nx;

        if (p.x > W + 4) {
          ps.splice(i, 1);
          continue;
        }

        const y = yAt(p);
        if (p.a) continue; // anomalies drawn on top
        ctx.fillRect(p.x, y, 2, 2);
      }

      // anomalies + scoring
      ctx.globalAlpha = 1;
      ctx.fillStyle = colors.signal;
      for (const p of ps) {
        if (!p.a) continue;
        const y = yAt(p);
        ctx.fillRect(p.x - 1, y - 1, 4, 4);
        if (!p.scored && p.x >= xScore()) {
          p.scored = true;
          marks.push({ x: p.x, y, t0: now, seasonal: Math.random() < 0.3, batch });
        }
      }

      // detection boxes (labels stack instead of overlapping)
      ctx.font = `500 10px ${getComputedStyle(document.body).getPropertyValue("--f-mono")}`;
      ctx.textBaseline = "alphabetic";
      ctx.textAlign = "left";
      const placed = [];
      for (let i = marks.length - 1; i >= 0; i--) {
        const m = marks[i];
        const age = (now - m.t0) / 1000;
        if (age > 2.2) {
          marks.splice(i, 1);
          continue;
        }
        const alpha = age < 1.6 ? 1 : 1 - (age - 1.6) / 0.6;
        const c = m.seasonal ? colors.ink : colors.signal;
        const bx = m.x - 12;
        const by = m.y - 12;
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = c;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(bx, by, 24, 24);
        const label = m.seasonal ? "seasonal · suppressed" : m.batch ? "anomaly · detected late" : `anomaly 0.9${(m.x | 0) % 10} · paged`;
        const tw = ctx.measureText(label).width + 8;
        const lx = Math.min(bx, W - tw - 2);
        let ly = by - 15;
        for (const q of placed) {
          if (lx < q.x + q.w && q.x < lx + tw && Math.abs(ly - q.y) < 15) ly = q.y - 16;
        }
        placed.push({ x: lx, y: ly, w: tw });
        ctx.fillStyle = c;
        ctx.fillRect(lx, ly, tw, 14);
        ctx.fillStyle = m.seasonal ? "#eeece7" : colors.ink;
        ctx.fillText(label, lx + 4, ly + 10.5);
      }

      // batch wall
      if (batch) {
        ctx.globalAlpha = flushing ? 0.2 : 1;
        ctx.fillStyle = colors.ink;
        for (let y = top - 16; y < bottom() + 10; y += 7) ctx.fillRect(wall, y, 1.5, 4);
        ctx.globalAlpha = 1;
        ctx.fillStyle = colors.ink;
        ctx.textAlign = "center";
        const left = Math.max(0, BATCH_WINDOW - (now - windowStart) / 1000);
        ctx.fillText(flushing ? "FLUSHING BATCH" : `NEXT BATCH IN ${left.toFixed(1)}s`, wall, top - 24);
        ctx.textAlign = "left";
      }
      ctx.globalAlpha = 1;

      if (rateRef.current) rateRef.current.textContent = batch ? `${queued.toLocaleString("en-US")} waiting` : "~463 / s";

      raf = requestAnimationFrame(frame);
    };

    if (reduced || !onScreen) {
      // Reduced motion gets a still frame of the flow instead of the animation.
      if (reduced) {
        spawn(1800);
        for (const p of ps) p.x = Math.random() * W;
        still = () => {
          ctx.clearRect(0, 0, W, H);
          drawStatic();
          ctx.fillStyle = colors.ink;
          ctx.globalAlpha = 0.62;
          for (const p of ps) ctx.fillRect(p.x, yAt(p), 2, 2);
          ctx.globalAlpha = 1;
        };
        still();
      }
      return () => ro.disconnect();
    }

    // Pre-warm: arrive to a pipeline that's already flowing, not an empty one.
    if (ps.length === 0) {
      const crossing = W / Math.max(140, W * 0.15);
      spawn(Math.round((PER_SECOND / sample) * crossing));
      for (const p of ps) p.x = Math.random() * W;
    }
    raf = requestAnimationFrame((t) => {
      last = t;
      frame(t);
    });
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    const mo = new MutationObserver(() => (colors = readColors(wrap)));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-vision"] });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [onScreen, reduced, narrow]);

  return (
    <figure className="stream" ref={wrapRef} data-agent="chart" aria-labelledby="stream-cap">
      <div className="stream__hud">
        <div className="stream__readout">
          <span className="label">{mode === "batch" ? "Backlog" : "Throughput"}</span>
          <span className="stream__big serif num" ref={rateRef}>
            ~463 / s
          </span>
        </div>
        <div className="stream__readout">
          <span className="label">Since you opened this page</span>
          <span className="stream__big serif num">
            <span ref={countRef}>0</span>
          </span>
        </div>
        <div className="stream__readout">
          <span className="label">Time to detect</span>
          <span className="stream__big serif num">{mode === "batch" ? "hours" : "< 10 min"}</span>
        </div>
        <div className="stream__mode" role="group" aria-label="Pipeline mode">
          <button type="button" aria-pressed={mode === "stream"} onClick={() => setMode("stream")}>
            Stream <span className="label">now</span>
          </button>
          <button type="button" aria-pressed={mode === "batch"} onClick={() => setMode("batch")}>
            Batch <span className="label">before</span>
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} className="stream__canvas" aria-hidden />

      <figcaption id="stream-cap" className="stream__cap">
        <span className="label">
          {narrow ? "1 dot = 2 events" : "1 dot = 1 event"} · 12+ upstream systems → partitioned topic → consumers
        </span>
        <span className="label">
          {mode === "batch"
            ? "Before: events sat in batch windows and reconciliation ran later"
            : "Simulated at the production rate · orange = anomaly"}
        </span>
      </figcaption>
    </figure>
  );
}
