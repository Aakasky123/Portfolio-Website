import { useEffect, useMemo, useState } from "react";

const easeOut = (t) => 1 - Math.pow(1 - t, 3);

// Animates the numeric part of strings like "~40M/day", "~1,200", "-70%".
export default function CountUp({ value, duration = 1500, delay = 300 }) {
  const parsed = useMemo(() => {
    const match = value.match(/^([^\d]*)([\d,.]+)(.*)$/);
    if (!match) return null;
    const [, prefix, numStr, suffix] = match;
    return {
      prefix,
      suffix,
      target: parseFloat(numStr.replace(/,/g, "")),
      decimals: (numStr.split(".")[1] || "").length,
    };
  }, [value]);

  const [n, setN] = useState(0);

  useEffect(() => {
    if (!parsed) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(parsed.target);
      return undefined;
    }
    let start = null;
    let id = null;
    const timer = window.setTimeout(() => {
      id = window.setInterval(() => {
        const now = performance.now();
        if (start === null) start = now;
        const p = Math.min(1, (now - start) / duration);
        setN(parsed.target * easeOut(p));
        if (p >= 1) window.clearInterval(id);
      }, 30);
    }, delay);
    return () => {
      window.clearTimeout(timer);
      if (id) window.clearInterval(id);
    };
  }, [parsed, duration, delay]);

  if (!parsed) return value;

  const formatted = n.toLocaleString("en-US", {
    minimumFractionDigits: parsed.decimals,
    maximumFractionDigits: parsed.decimals,
  });
  return (
    <>
      {parsed.prefix}
      {formatted}
      {parsed.suffix}
    </>
  );
}
