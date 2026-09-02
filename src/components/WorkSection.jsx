import { ArrowUpRight } from "lucide-react";
import SectionHeader from "./SectionHeader";
import Reveal from "./Reveal";
import AgentTrace from "./AgentTrace";
import Spot from "./Spot";

function Tag({ children }) {
  return (
    <span className="border border-line px-2.5 py-1 font-mono text-[11px] tracking-wider text-mute">
      {children}
    </span>
  );
}

function FeaturedProject({ featured, trace }) {
  return (
    <Reveal>
      <Spot as="article" className="ticks border border-line-strong bg-panel">
        <div className="border-b border-line px-6 py-5 sm:px-8">
          <p className="font-mono text-[11px] tracking-[0.25em] text-amber uppercase">
            {featured.kicker}
          </p>
          <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            {featured.title}
          </h3>
          <p className="mt-3 max-w-3xl leading-relaxed text-mute">{featured.desc}</p>
        </div>

        <div className="grid lg:grid-cols-[1.15fr_1fr]">
          <div className="grid gap-px bg-line sm:grid-cols-2">
            {featured.highlights.map((h) => (
              <div key={h.title} className="bg-panel px-6 py-5 sm:px-8">
                <h4 className="font-display text-base font-semibold text-fg">{h.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-mute">{h.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center border-t border-line bg-ink-2 p-5 sm:p-6 lg:border-t-0 lg:border-l">
            <div className="w-full">
              <AgentTrace lines={trace} />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-6 py-4 sm:px-8">
          <div className="flex flex-wrap gap-2">
            {featured.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
          <a
            href={featured.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-mono text-[11px] tracking-widest text-mute uppercase transition-colors hover:text-amber"
          >
            View on GitHub
            <ArrowUpRight size={12} />
          </a>
        </div>
      </Spot>
    </Reveal>
  );
}

function ProjectCard({ project, delay }) {
  return (
    <Reveal delay={delay} className="h-full">
      <Spot as="article" className="flex h-full flex-col border border-line bg-ink-2">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <span className="font-mono text-[11px] tracking-widest text-amber uppercase">
            {project.metric}
          </span>
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            aria-label={`${project.title} on GitHub`}
            className="inline-flex items-center gap-1 font-mono text-[11px] tracking-widest text-mute uppercase transition-colors hover:text-amber"
          >
            GitHub
            <ArrowUpRight size={12} />
          </a>
        </div>
        <div className="flex flex-1 flex-col px-5 py-5">
          <h3 className="font-display text-xl font-semibold text-fg">{project.title}</h3>
          <p className="mt-0.5 font-mono text-[11px] tracking-wider text-dim uppercase">
            {project.subtitle}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-mute">{project.desc}</p>
          <ul className="mt-4 space-y-2">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-2.5 text-sm leading-snug text-mute">
                <span className="mt-[7px] h-1 w-1 shrink-0 bg-amber" />
                {h}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex flex-wrap gap-2 pt-5">
            {project.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>
      </Spot>
    </Reveal>
  );
}

export default function WorkSection({ featured, projects, trace }) {
  return (
    <section id="work" className="scroll-mt-24 py-16 sm:py-24">
      <SectionHeader index="01" title="Selected Work" subtitle="Systems that observe, decide, act — and verify." />
      <FeaturedProject featured={featured} trace={trace} />
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {projects.map((p, i) => (
          <ProjectCard key={p.title} project={p} delay={i * 0.08} />
        ))}
      </div>
    </section>
  );
}
