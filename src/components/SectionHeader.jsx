export default function SectionHeader({ title, subtitle, align = "left" }) {
  const center = align === "center";

  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--color-heading)] sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-4 text-base leading-7 text-[var(--color-text-muted)] sm:text-lg">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
