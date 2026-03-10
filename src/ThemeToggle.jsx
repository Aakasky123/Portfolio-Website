import { useCallback, useSyncExternalStore } from "react";
import { MoonStar, SunMedium } from "lucide-react";

function subscribe(onChange) {
  const html = document.documentElement;
  const observer = new MutationObserver(onChange);
  observer.observe(html, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.getAttribute("data-theme") === "dark";
}

export default function ThemeToggle({ compact = false }) {
  const isDark = useSyncExternalStore(subscribe, getSnapshot, () => true);

  const toggle = useCallback(() => {
    const html = document.documentElement;
    const next = isDark ? "light" : "dark";
    html.setAttribute("data-theme", next);

    try {
      localStorage.setItem("theme", next);
    } catch {}
  }, [isDark]);

  const Icon = isDark ? SunMedium : MoonStar;
  const label = isDark ? "Light" : "Dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className={`theme-toggle ${compact ? "theme-toggle-compact" : ""}`}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
    >
      <Icon size={16} />
      {!compact ? <span>{label}</span> : null}
    </button>
  );
}
