import { motion, useReducedMotion } from "framer-motion";
import { Activity, Database, Server, Terminal } from "lucide-react";
import StatusPill from "./StatusPill";

const MotionDiv = motion.div;

const SERVICE_ICONS = [Server, Database, Activity, Terminal];

export default function EngineeringConsole({ content }) {
  const reduceMotion = useReducedMotion();
  const { console: consoleData } = content;

  return (
    <MotionDiv
      className="engineering-console panel overflow-hidden"
      initial={reduceMotion ? false : { opacity: 0, y: 30, scale: 0.985 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="console-scanline" />
      <div className="console-header">
        <div className="flex items-center gap-2">
          <span className="console-window-dot bg-[#ef4444]" />
          <span className="console-window-dot bg-[#f59e0b]" />
          <span className="console-window-dot bg-[#22c55e]" />
        </div>
        <StatusPill>{consoleData.status}</StatusPill>
      </div>

      <div className="console-body">
        <div className="console-profile-row">
          <div className="console-avatar-frame">
            <img
              src={content.profilePhotoUrl}
              alt={`${content.name} headshot`}
              width={96}
              height={96}
              className="console-avatar"
            />
          </div>
          <div className="min-w-0">
            <p className="console-kicker">backend/full-stack</p>
            <h2 className="console-name">Java / Spring Boot / React</h2>
            <p className="console-role">{content.location}</p>
          </div>
        </div>

        <div className="console-terminal">
          <div className="flex items-center gap-2 text-[var(--color-brand)]">
            <Terminal size={15} />
            <span>~/portfolio</span>
          </div>
          <p>
            <span className="text-[var(--color-text-muted)]">$</span> {consoleData.command}
          </p>
          <p className="console-output">build: APIs, realtime sync, data workflows</p>
        </div>

        <div className="console-metrics-grid">
          {consoleData.metrics.map((metric) => (
            <div className="console-metric" key={metric.label}>
              <p className="console-metric-label">{metric.label}</p>
              <p className="console-metric-value">{metric.value}</p>
              <p className="console-metric-detail">{metric.detail}</p>
            </div>
          ))}
        </div>

        <div className="console-services">
          {consoleData.services.map((service, index) => {
            const Icon = SERVICE_ICONS[index % SERVICE_ICONS.length];
            return (
              <div className="console-service" key={service.name}>
                <span className="console-service-icon">
                  <Icon size={15} />
                </span>
                <span className="min-w-0 flex-1 truncate">{service.name}</span>
                <span className="console-service-status">{service.status}</span>
              </div>
            );
          })}
        </div>
      </div>
    </MotionDiv>
  );
}
