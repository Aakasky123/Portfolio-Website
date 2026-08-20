import { ASCII_PORTRAIT } from "../data/asciiPortrait";

export default function AsciiPortrait() {
  return (
    <div className="ticks border border-line bg-panel">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="font-mono text-[11px] tracking-widest text-mute uppercase">
          aakash.jpg → ascii
        </span>
        <span className="font-mono text-[11px] tracking-widest text-dim uppercase">
          108×50
        </span>
      </div>
      <pre
        aria-label="ASCII art portrait of Aakash Siricilla"
        className="overflow-hidden px-3 py-4 font-mono text-fg/80 select-none"
        style={{ fontSize: "clamp(3.6px, 1.26vw, 5.3px)", lineHeight: 1.15 }}
      >
        {ASCII_PORTRAIT.trim()}
      </pre>
      <div className="border-t border-line px-4 py-2.5 font-mono text-[11px] tracking-wider text-dim uppercase">
        <span className="text-amber">$</span> render --charset &quot; .':;i1tfLCG08@&quot;
      </div>
    </div>
  );
}
