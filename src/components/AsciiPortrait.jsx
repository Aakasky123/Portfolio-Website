import { useEffect, useMemo, useRef, useState } from "react";
import { ASCII_PORTRAIT } from "../data/asciiPortrait";

const NOISE = ".':;i1tfLCG08@";
const SWEEP_MS = 1700; // top-to-bottom resolve sweep
const JITTER_MS = 900; // per-char randomness on top of the sweep
const TICK_MS = 40;

const randomGlyph = () => NOISE[(Math.random() * NOISE.length) | 0];

function makeNoiseFrame(art) {
  return {
    resolved: art.replace(/[^ \n]/g, " "),
    flicker: art.replace(/[^ \n]/g, randomGlyph),
  };
}

function buildSchedule(art) {
  const lines = art.split("\n");
  const rows = lines.length;
  return lines.map((line, row) =>
    Array.from(line, (ch) =>
      ch === " " ? null : (row / rows) * SWEEP_MS + Math.random() * JITTER_MS
    )
  );
}

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function AsciiPortrait() {
  const art = useMemo(() => ASCII_PORTRAIT.trim(), []);
  const lines = useMemo(() => art.split("\n"), [art]);
  const scheduleRef = useRef(null);
  const [run, setRun] = useState(0);
  // null = fully decoded, show the final art
  const [frame, setFrame] = useState(() =>
    prefersReducedMotion() ? null : makeNoiseFrame(art)
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setFrame(null);
      setProgress(100);
      return undefined;
    }

    scheduleRef.current = buildSchedule(art);
    let start = null;

    const id = window.setInterval(() => {
      const now = performance.now();
      if (start === null) start = now;
      const t = now - start;
      const schedule = scheduleRef.current;
      let total = 0;
      let done = 0;
      const resolved = [];
      const flicker = [];

      for (let r = 0; r < lines.length; r++) {
        const line = lines[r];
        let resLine = "";
        let flickLine = "";
        for (let c = 0; c < line.length; c++) {
          const at = schedule[r][c];
          if (at === null) {
            resLine += " ";
            flickLine += " ";
            continue;
          }
          total += 1;
          if (t >= at) {
            done += 1;
            resLine += line[c];
            flickLine += " ";
          } else {
            resLine += " ";
            flickLine += randomGlyph();
          }
        }
        resolved.push(resLine);
        flicker.push(flickLine);
      }

      setProgress(Math.round((done / total) * 100));
      if (done >= total) {
        setFrame(null);
        window.clearInterval(id);
      } else {
        setFrame({ resolved: resolved.join("\n"), flicker: flicker.join("\n") });
      }
    }, TICK_MS);

    return () => window.clearInterval(id);
  }, [art, lines, run]);

  const replay = () => {
    if (prefersReducedMotion()) return;
    setProgress(0);
    setFrame(makeNoiseFrame(art));
    setRun((n) => n + 1);
  };

  const decoding = frame !== null;
  const preClass = "overflow-hidden px-3 py-4 font-mono select-none";
  const preStyle = { fontSize: "clamp(3.6px, 1.26vw, 5.9px)", lineHeight: 1.15 };

  return (
    <div
      className="ticks cursor-pointer border border-line bg-panel"
      title="Replay decode"
      onClick={replay}
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="font-mono text-[11px] tracking-widest text-mute uppercase">
          aakash.jpg → ascii
        </span>
        <span
          className={`font-mono text-[11px] tracking-widest uppercase ${
            decoding ? "text-amber" : "text-dim"
          }`}
        >
          {decoding ? `decoding… ${progress}%` : "108×50"}
        </span>
      </div>

      <div className="relative">
        <pre aria-hidden={decoding || undefined} className={`${preClass} text-fg/80`} style={preStyle}>
          {decoding ? frame.resolved : art}
        </pre>
        {decoding && (
          <pre
            aria-hidden
            className={`${preClass} absolute inset-0 text-amber/35`}
            style={preStyle}
          >
            {frame.flicker}
          </pre>
        )}
        <span className="sr-only">ASCII art portrait of Aakash Siricilla</span>
      </div>

      <div className="border-t border-line px-4 py-2.5 font-mono text-[11px] tracking-wider text-dim uppercase">
        <span className="text-amber">$</span> render --charset &quot; .':;i1tfLCG08@&quot;
      </div>
    </div>
  );
}
