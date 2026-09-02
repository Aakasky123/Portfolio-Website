// Wrapper that gives a card a cursor-tracking amber ring + inner glow.
export default function Spot({ as, className = "", children, ...rest }) {
  const Tag = as ?? "div";
  const onMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <Tag className={`spot ${className}`} onMouseMove={onMouseMove} {...rest}>
      {children}
      <span aria-hidden className="spot-glow" />
      <span aria-hidden className="spot-ring" />
    </Tag>
  );
}
