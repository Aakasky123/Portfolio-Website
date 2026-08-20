import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ASCII_PORTRAIT } from "../data/asciiPortrait";

const NOISE = ".':;i1tfLCG08@";
const SWEEP_MS = 1700; // top-to-bottom resolve sweep
const JITTER_MS = 900; // per-char randomness on top of the sweep
const TICK_MS = 40;
const SPARKLE_MS = 90;
const SPARKLE_RATE = 0.03;

const randomGlyph = () => NOISE[(Math.random() * NOISE.length) | 0];

function makeNoiseFrame(art) {
  return {
    base: art.replace(/[^ \n]/g, " "),
    over: art.replace(/[^ \n]/g, randomGlyph),
  };
}

// Punch random holes in the art and show amber glyphs in them.
function makeSparkleFrame(art) {
  let base = "";
  let over = "";
  for (const ch of art) {
    if (ch !== " " && ch !== "\n" && Math.random() < SPARKLE_RATE) {
      base += " ";
      over += randomGlyph();
    } else {
      base += ch;
      over += ch === "\n" ? "\n" : " ";
    }
  }
  return { base, over };
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
  // Strip only the wrapping newlines — trim() would also eat the first
  // line's leading spaces and shift the top of the portrait left.
  const art = useMemo(() => ASCII_PORTRAIT.replace(/^\n+|\n+\s*$/g, ""), []);
  const lines = useMemo(() => art.split("\n"), [art]);
  const rootRef = useRef(null);
  const [run, setRun] = useState(0);
  // null = fully decoded, show the final art
  const [frame, setFrame] = useState(() =>
    prefersReducedMotion() ? null : makeNoiseFrame(art)
  );
  const [progress, setProgress] = useState(0);
  const [hover, setHover] = useState(false);
  const [sparkle, setSparkle] = useState(null);

  const replay = useCallback(() => {
    if (prefersReducedMotion()) return;
    setProgress(0);
    setFrame(makeNoiseFrame(art));
    setRun((n) => n + 1);
  }, [art]);

  // Decode animation
  useEffect(() => {
    if (prefersReducedMotion()) {
      setFrame(null);
      setProgress(100);
      return undefined;
    }

    const schedule = buildSchedule(art);
    let start = null;

    const id = window.setInterval(() => {
      const now = performance.now();
      if (start === null) start = now;
      const t = now - start;
      let total = 0;
      let done = 0;
      const base = [];
      const over = [];

      for (let r = 0; r < lines.length; r++) {
        const line = lines[r];
        let baseLine = "";
        let overLine = "";
        for (let c = 0; c < line.length; c++) {
          const at = schedule[r][c];
          if (at === null) {
            baseLine += " ";
            overLine += " ";
            continue;
          }
          total += 1;
          if (t >= at) {
            done += 1;
            baseLine += line[c];
            overLine += " ";
          } else {
            baseLine += " ";
            overLine += randomGlyph();
          }
        }
        base.push(baseLine);
        over.push(overLine);
      }

      setProgress(Math.round((done / total) * 100));
      if (done >= total) {
        setFrame(null);
        window.clearInterval(id);
      } else {
        setFrame({ base: base.join("\n"), over: over.join("\n") });
      }
    }, TICK_MS);

    return () => window.clearInterval(id);
  }, [art, lines, run]);

  // Replay when the panel scrolls fully out of view and back in
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    let wasOut = false;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const out = rect.bottom < 0 || rect.top > window.innerHeight;
      if (out) {
        wasOut = true;
      } else if (wasOut && rect.top > -rect.height * 0.25) {
        wasOut = false;
        replay();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [replay]);

  const decoding = frame !== null;

  // Hover glitch shimmer (only once decoded)
  useEffect(() => {
    if (!hover || decoding || prefersReducedMotion()) {
      setSparkle(null);
      return undefined;
    }
    setSparkle(makeSparkleFrame(art));
    const id = window.setInterval(() => setSparkle(makeSparkleFrame(art)), SPARKLE_MS);
    return () => {
      window.clearInterval(id);
      setSparkle(null);
    };
  }, [hover, decoding, art]);

  const shown = decoding ? frame : sparkle ?? { base: art, over: null };
  const preClass = "overflow-hidden font-mono select-none";
  const preStyle = { fontSize: "clamp(3.6px, 1.26vw, 5.9px)", lineHeight: 1.15 };

  return (
    <div
      ref={rootRef}
      className="ticks cursor-pointer border border-line bg-panel"
      title="Replay decode"
      onClick={replay}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
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

      <div className="px-3 py-4">
        <div className="relative mx-auto w-fit">
          <pre aria-hidden={decoding || undefined} className={`${preClass} text-fg/80`} style={preStyle}>
            {shown.base}
          </pre>
          {shown.over !== null && (
            <pre aria-hidden className={`${preClass} absolute inset-0 text-amber/35`} style={preStyle}>
              {shown.over}
            </pre>
          )}
          <span className="sr-only">ASCII art portrait of Aakash Siricilla</span>
        </div>
      </div>

      <div className="border-t border-line px-4 py-2.5 font-mono text-[11px] tracking-wider text-dim uppercase">
        <span className="text-amber">$</span> render --charset &quot; .':;i1tfLCG08@&quot;
      </div>
    </div>
  );
}
