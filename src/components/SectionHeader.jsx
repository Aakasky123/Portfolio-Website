import { motion as Motion } from "framer-motion";
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
      <Motion.div
        className="mt-6 h-px w-full origin-left bg-gradient-to-r from-amber via-line-strong to-line"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
    </Reveal>
  );
}
