import { Activity, Boxes, FileSearch, RadioTower } from "lucide-react";
import StatusPill from "./StatusPill";

const VISUAL_META = {
  sync: { Icon: RadioTower, label: "live collaboration", tone: "green" },
  monitor: { Icon: Activity, label: "network monitor", tone: "amber" },
  docs: { Icon: FileSearch, label: "document intelligence", tone: "brand" },
  clinical: { Icon: Boxes, label: "imaging workflow", tone: "green" },
};

function SyncPreview({ project, visual, Icon, meta }) {
  return (
    <div className="project-shot project-shot-sync">
      <ShotChrome project={project} visual={visual} meta={meta} />
      <div className="shot-editor">
        <div className="shot-sidebar">
          <span />
          <span />
          <span />
        </div>
        <div className="shot-document">
          <div className="shot-doc-line w-[78%]" />
          <div className="shot-doc-line w-[58%]" />
          <div className="shot-presence-row">
            <span className="shot-avatar bg-[#34d399]" />
            <span className="shot-avatar bg-[#7dd3fc]" />
            <span className="shot-avatar bg-[#fbbf24]" />
          </div>
          <div className="shot-cursor" />
        </div>
        <ShotCore project={project} Icon={Icon} />
      </div>
    </div>
  );
}

function MonitorPreview({ project, visual, Icon, meta }) {
  return (
    <div className="project-shot project-shot-monitor">
      <ShotChrome project={project} visual={visual} meta={meta} />
      <div className="shot-dashboard">
        <div className="shot-chart">
          <span className="shot-chart-line" />
          <span className="shot-chart-line shot-chart-line-alt" />
        </div>
        <div className="shot-event-list">
          {["packet spike", "anomaly score", "redis state"].map((item) => (
            <span key={item}>
              <strong>{item}</strong>
              <em />
            </span>
          ))}
        </div>
        <ShotCore project={project} Icon={Icon} />
      </div>
    </div>
  );
}

function DocsPreview({ project, visual, Icon, meta }) {
  return (
    <div className="project-shot project-shot-docs">
      <ShotChrome project={project} visual={visual} meta={meta} />
      <div className="shot-rag">
        <div className="shot-upload">
          <FileSearch size={24} />
          <span>policy.pdf</span>
        </div>
        <div className="shot-answer">
          <div className="shot-doc-line w-[72%]" />
          <div className="shot-doc-line w-[88%]" />
          <div className="shot-citation-row">
            <span>citation</span>
            <span>chunk 04</span>
          </div>
        </div>
        <ShotCore project={project} Icon={Icon} />
      </div>
    </div>
  );
}

function ClinicalPreview({ project, visual, Icon, meta }) {
  return (
    <div className="project-shot project-shot-clinical">
      <ShotChrome project={project} visual={visual} meta={meta} />
      <div className="shot-clinical-grid">
        <div className="shot-xray">
          <span className="shot-xray-glow" />
        </div>
        <div className="shot-report">
          <span className="shot-confidence">92%</span>
          <div className="shot-doc-line w-[80%]" />
          <div className="shot-doc-line w-[55%]" />
          <div className="shot-status-bar" />
        </div>
        <ShotCore project={project} Icon={Icon} />
      </div>
    </div>
  );
}

function ShotChrome({ visual, meta }) {
  return (
    <div className="shot-chrome">
      <div className="flex items-center gap-1.5">
        <span className="console-window-dot bg-[#ef4444]" />
        <span className="console-window-dot bg-[#f59e0b]" />
        <span className="console-window-dot bg-[#22c55e]" />
      </div>
      <StatusPill tone={meta.tone}>{meta.label}</StatusPill>
      <span className="shot-metric">{visual.metric}</span>
    </div>
  );
}

function ShotCore({ project, Icon }) {
  const CoreIcon = Icon;

  return (
    <div className="shot-core">
      <CoreIcon size={22} />
      <span>{project.title}</span>
    </div>
  );
}

export default function ProjectVisual({ project }) {
  const visual = project.visual ?? { type: "sync", metric: "System", nodes: project.tags.slice(0, 4) };
  const meta = VISUAL_META[visual.type] ?? VISUAL_META.sync;
  const Icon = meta.Icon;

  if (visual.type === "monitor") {
    return <MonitorPreview project={project} visual={visual} Icon={Icon} meta={meta} />;
  }

  if (visual.type === "docs") {
    return <DocsPreview project={project} visual={visual} Icon={Icon} meta={meta} />;
  }

  if (visual.type === "clinical") {
    return <ClinicalPreview project={project} visual={visual} Icon={Icon} meta={meta} />;
  }

  return <SyncPreview project={project} visual={visual} Icon={Icon} meta={meta} />;
}
