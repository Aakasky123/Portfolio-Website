import Reveal from "./Reveal";

export default function SectionHeader({ index, title, subtitle }) {
  return (
    <Reveal className="mb-10 sm:mb-14">
      <p className="font-mono text-xs tracking-[0.25em] text-amber uppercase">
        {index} <span className="text-dim">/</span> {title}
      </p>
      {subtitle && (
        <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          {subtitle}
        </h2>
      )}
      <div className="mt-6 h-px w-full bg-line" />
    </Reveal>
  );
}
