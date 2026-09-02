export default function Marquee({ items }) {
  const row = [...items, ...items];
  return (
    <div
      className="marquee relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-line bg-ink-2/60 py-3"
      aria-label="Technology stack"
    >
      <div className="marquee-track">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            aria-hidden={i >= items.length || undefined}
            className="flex items-center gap-6 pr-6 font-mono text-[12px] tracking-[0.2em] whitespace-nowrap text-mute uppercase"
          >
            {item}
            <span className="text-amber">◆</span>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent" />
    </div>
  );
}
