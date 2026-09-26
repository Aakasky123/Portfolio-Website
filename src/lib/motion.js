// Motion primitives for the agent. Its pointer moves on minimum-jerk
// trajectories (the smooth profile robot arms use), with a slight arc so
// it reads as deliberate rather than mechanical.

export const minJerk = (t) => t * t * t * (10 + t * (-15 + 6 * t));

export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export const lerp = (a, b, t) => a + (b - a) * t;

export class Aborted extends Error {
  constructor() {
    super("aborted");
    this.name = "AbortError";
  }
}

export const isAbort = (err) => err && err.name === "AbortError";

export function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new Aborted());
    const id = setTimeout(resolve, ms);
    signal?.addEventListener(
      "abort",
      () => {
        clearTimeout(id);
        reject(new Aborted());
      },
      { once: true }
    );
  });
}

// Animate a point from `from` to `to`. Resolves when done.
export function glide({ from, to, duration, curve = 0.12, signal, onFrame }) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(new Aborted());
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const t0 = performance.now();
    let raf = 0;

    const onAbort = () => {
      cancelAnimationFrame(raf);
      reject(new Aborted());
    };
    signal?.addEventListener("abort", onAbort, { once: true });

    const step = (now) => {
      const t = clamp((now - t0) / duration, 0, 1);
      const s = minJerk(t);
      const arc = Math.sin(Math.PI * s) * curve * len;
      onFrame(from.x + dx * s + nx * arc, from.y + dy * s + ny * arc);
      if (t < 1) raf = requestAnimationFrame(step);
      else {
        signal?.removeEventListener("abort", onAbort);
        resolve();
      }
    };
    raf = requestAnimationFrame(step);
  });
}

// Duration that scales with distance, like a person's (Fitts-ish).
export const travelTime = (from, to, base = 380, perPx = 0.55, max = 1100) =>
  Math.min(max, base + Math.hypot(to.x - from.x, to.y - from.y) * perPx);

// Stable pseudo-confidence for a string, 0.900–0.999.
export function confidence(text = "") {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (0.9 + ((h >>> 0) % 100) / 1000).toFixed(3);
}
