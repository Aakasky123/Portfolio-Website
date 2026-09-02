import { useEffect, useState } from "react";
import { CONTENT, NAV_ITEMS } from "./data/content";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import WorkSection from "./components/WorkSection";
import ExperienceSection from "./components/ExperienceSection";
import SkillsSection from "./components/SkillsSection";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("top");

  const handleNavigate = (event, id) => {
    event.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", id === "top" ? " " : `#${id}`);
      setActiveSection(id);
    }
  };

  useEffect(() => {
    const ids = ["top", ...NAV_ITEMS.map((item) => item.id)];
    const elements = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!elements.length) return undefined;

    const syncActiveSection = () => {
      const probeY = window.innerHeight * 0.35;
      let current = elements[0];
      let closest = Number.POSITIVE_INFINITY;
      for (const el of elements) {
        const distance = Math.abs(el.getBoundingClientRect().top - probeY);
        if (distance < closest) {
          closest = distance;
          current = el;
        }
      }
      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
      setActiveSection(nearBottom ? elements[elements.length - 1].id : current.id);
    };

    syncActiveSection();
    window.addEventListener("scroll", syncActiveSection, { passive: true });
    window.addEventListener("resize", syncActiveSection);
    return () => {
      window.removeEventListener("scroll", syncActiveSection);
      window.removeEventListener("resize", syncActiveSection);
    };
  }, []);

  return (
    <div className="grain relative min-h-screen overflow-x-hidden">
      <Navbar
        items={NAV_ITEMS}
        activeSection={activeSection}
        resumeUrl={CONTENT.resumeUrl}
        onNavigate={handleNavigate}
      />

      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        <Hero content={CONTENT} onNavigate={handleNavigate} />
        <Marquee items={CONTENT.ticker} />
        <WorkSection
          featured={CONTENT.featured}
          projects={CONTENT.projects}
          trace={CONTENT.agentTrace}
        />
        <ExperienceSection experience={CONTENT.experience} />
        <SkillsSection skills={CONTENT.skills} />
        <AboutSection
          about={CONTENT.about}
          facts={CONTENT.aboutFacts}
          education={CONTENT.education}
        />
        <ContactSection contact={CONTENT.contact} />
      </main>

      <Footer name={CONTENT.name} socials={CONTENT.socials} />
    </div>
  );
}
