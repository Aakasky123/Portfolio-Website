// The agent's pointer. Used as the brand mark, the favicon, and the
// on-page cursor, so the site is signed by the thing it's about.
export default function CursorMark({ className = "", title }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      width="32"
      height="32"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title && <title>{title}</title>}
      <path
        d="M8 3.5v22.2l5.6-5.4 3.9 8.6 3.6-1.6-3.9-8.4h7.9z"
        fill="var(--signal)"
        stroke="var(--ink)"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
