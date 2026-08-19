import { useEffect, useState } from "react";

const KIND_STYLES = {
  obs: { label: "OBS", className: "text-mute" },
  plan: { label: "PLAN", className: "text-fg" },
  act: { label: "ACT", className: "text-fg" },
  verify: { label: "VRFY", className: "text-green" },
  gate: { label: "GATE", className: "text-amber" },
  mem: { label: "MEM", className: "text-mute" },
};

export default function AgentTrace({ lines }) {
  const [visible, setVisible] = useState(1);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setVisible((v) => (v >= lines.length ? 1 : v + 1));
    }, 1500);
    return () => window.clearInterval(timer);
  }, [lines.length]);

  return (
    <div className="ticks border border-line bg-panel">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="font-mono text-[11px] tracking-widest text-mute uppercase">
          astra · agent loop
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[11px] tracking-widest text-green uppercase">
          <span className="h-1.5 w-1.5 rounded-full bg-green" />
          running
        </span>
      </div>
      <div className="min-h-[240px] space-y-2.5 px-4 py-4 font-mono text-[12.5px] leading-relaxed sm:text-[13px]">
        {lines.slice(0, visible).map((line, i) => {
          const kind = KIND_STYLES[line.kind] ?? KIND_STYLES.obs;
          return (
            <div key={`${line.text}-${i}`} className="flex gap-3">
              <span className={`w-10 shrink-0 text-right text-[11px] leading-[1.7] ${kind.className}`}>
                {kind.label}
              </span>
              <span className="text-mute">{line.text}</span>
            </div>
          );
        })}
        <div className="flex gap-3">
          <span className="w-10 shrink-0" />
          <span className="cursor-blink text-amber">▌</span>
        </div>
      </div>
      <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 font-mono text-[11px] tracking-wider text-dim uppercase">
        <span>screenshot → decide → act → verify</span>
      </div>
    </div>
  );
}
