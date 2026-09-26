import { useEffect, useRef } from "react";
import { ASCII_PORTRAIT } from "../data/asciiPortrait";
import { useReducedMotion } from "../lib/hooks";

// The ASCII portrait, re-rendered as an engraving: horizontal scanlines whose
// thickness follows the darkness of the image. It draws itself like a scanner
// on first sight; under the cursor the lines swell apart like a loupe.

const RAMP = " .':;i1tfLCG08@";
const CHAR_ASPECT = 0.52; // a mono cell is ~0.52 as wide as it is tall
const LINES = 92;
const LENS = 120;

function parse() {
  const lines = ASCII_PORTRAIT.replace(/^\n+|\n+\s*$/g, "").split("\n");
  const rows = lines.length;
  const cols = Math.max(...lines.map((l) => l.length));
  const bright = new Float32Array(rows * cols);
  const mask = new Float32Array(rows * cols);
  for (let r = 0; r < rows; r++) {
    const line = lines[r];
    const first = line.search(/\S/);
    const last = line.length - 1 - line.split("").reverse().join("").search(/\S/);
    for (let c = 0; c < cols; c++) {
      const ch = line[c] ?? " ";
      const inside = first >= 0 && c >= first && c <= last;
      // Feather the silhouette edge over a couple of cells so lines taper.
      mask[r * cols + c] = inside ? Math.min(1, (c - first + 0.6) / 2.4, (last - c + 0.6) / 2.4) : 0;
      // Spaces inside the silhouette are the darkest pixels, not background.
      bright[r * cols + c] = ch === " " ? 0 : RAMP.indexOf(ch) / (RAMP.length - 1);
    }
  }
  return { rows, cols, bright, mask, aspect: (cols * CHAR_ASPECT) / rows };
}

const DATA = parse();

function sample(field, u, v) {
  const { rows, cols } = DATA;
  const x = Math.min(cols - 1.001, Math.max(0, u * cols - 0.5));
  const y = Math.min(rows - 1.001, Math.max(0, v * rows - 0.5));
  const x0 = x | 0;
  const y0 = y | 0;
  const fx = x - x0;
  const fy = y - y0;
  const i = y0 * cols + x0;
  const a = field[i] * (1 - fx) + field[i + 1] * fx;
  const b = field[i + cols] * (1 - fx) + field[i + cols + 1] * fx;
  return a * (1 - fy) + b * fy;
}

export default function Portrait() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = 0;
    let H = 0;
    let ink = "#121211";
    let signal = "#ff4f12";
    let progress = reduced ? 1 : 0;
    let mouse = null;
    let lens = 0; // eased 0..1
    let raf = 0;
    let revealStart = null;

    // Precompute thickness per line per sample once per size.
    let cache = null;
    const STEP = 1.5;

    const build = () => {
      const n = Math.ceil(W / STEP) + 1;
      cache = [];
      const gap = H / LINES;
      for (let l = 0; l < LINES; l++) {
        const v = (l + 0.5) / LINES;
        const t = new Float32Array(n);
        for (let k = 0; k < n; k++) {
          const u = (k * STEP) / W;
          const m = sample(DATA.mask, u, v);
          if (m < 0.02) continue;
          const b = sample(DATA.bright, u, v);
          const dark = Math.pow(1 - b, 1.15);
          t[k] = m * gap * (0.1 + 0.8 * dark);
        }
        cache.push({ y: v * H, t });
      }
    };

    const layout = () => {
      const w = wrap.clientWidth;
      W = w;
      H = w / DATA.aspect;
      canvas.style.height = `${H}px`;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const cs = getComputedStyle(wrap);
      ink = cs.getPropertyValue("--ink").trim() || ink;
      signal = cs.getPropertyValue("--signal").trim() || signal;
      build();
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const n = cache[0]?.t.length ?? 0;
      const reach = progress * (LINES + 24);
      for (let l = 0; l < LINES; l++) {
        const lineP = Math.min(1, Math.max(0, (reach - l) / 24));
        if (lineP <= 0) break;
        const { y, t } = cache[l];
        const kMax = Math.floor(lineP * (n - 1));
        // Scanner head: the line being drawn right now glows signal.
        ctx.fillStyle = lineP < 1 ? signal : ink;
        ctx.beginPath();
        let open = false;
        const top = [];
        const bot = [];
        for (let k = 0; k <= kMax; k++) {
          const x = k * STEP;
          let th = t[k];
          let yy = y;
          if (lens > 0.001 && mouse) {
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const d = Math.hypot(dx, dy);
            if (d < LENS) {
              const f = (1 - d / LENS) ** 2 * lens;
              yy = y + dy * 0.55 * f;
              th = th * (1 + 1.1 * f);
            }
          }
          if (th > 0.05) {
            top.push(x, yy - th / 2);
            bot.push(x, yy + th / 2);
            open = true;
          } else if (open) {
            flush(top, bot);
            top.length = 0;
            bot.length = 0;
            open = false;
          }
        }
        if (open) flush(top, bot);
        ctx.fill();
      }
    };

    function flush(top, bot) {
      ctx.moveTo(top[0], top[1]);
      for (let i = 2; i < top.length; i += 2) ctx.lineTo(top[i], top[i + 1]);
      for (let i = bot.length - 2; i >= 0; i -= 2) ctx.lineTo(bot[i], bot[i + 1]);
      ctx.closePath();
    }

    const loop = (now) => {
      let busy = false;
      if (progress < 1) {
        if (revealStart === null) revealStart = now;
        progress = Math.min(1, (now - revealStart) / 2200);
        busy = true;
      }
      const target = mouse ? 1 : 0;
      if (Math.abs(lens - target) > 0.002) {
        lens += (target - lens) * 0.14;
        busy = true;
      } else lens = target;
      draw();
      raf = busy || mouse ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };

    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(wrap);

    // Start the scan when the portrait comes into view.
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && progress < 1) {
          kick();
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (!reduced) io.observe(wrap);

    const onMove = (e) => {
      if (reduced) return;
      const r = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
      kick();
    };
    const onLeave = () => {
      mouse = null;
      kick();
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced]);

  return (
    <figure className="portrait">
      <div className="portrait__frame" ref={wrapRef} data-agent="person">
        <canvas ref={canvasRef} className="portrait__canvas" role="img" aria-label="Portrait of Aakash Siricilla, drawn in horizontal scanlines" />
        <i className="portrait__c portrait__c--tl" aria-hidden />
        <i className="portrait__c portrait__c--br" aria-hidden />
      </div>
      <figcaption className="portrait__cap">
        <span className="label">Fig. 4 — The human</span>
        <span className="label">{LINES} scanlines · from 5,400 ASCII cells</span>
      </figcaption>
    </figure>
  );
}
