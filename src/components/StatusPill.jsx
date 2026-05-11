export default function StatusPill({ children, tone = "brand" }) {
  return (
    <span className={`status-pill status-pill-${tone}`}>
      <span className="status-dot" />
      {children}
    </span>
  );
}
