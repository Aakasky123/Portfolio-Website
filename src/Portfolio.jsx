import { useEffect, useState } from "react";
import { CONTENT, NAV_ITEMS } from "./data/content";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProjectsSection from "./components/ProjectsSection";
import ExperienceSection from "./components/ExperienceSection";
import SkillsSection from "./components/SkillsSection";
import EducationSection from "./components/EducationSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!elements.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries[0]) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-32% 0px -48% 0px",
        threshold: [0.15, 0.3, 0.55, 0.8],
      }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar
        items={NAV_ITEMS}
        activeSection={activeSection}
        name={CONTENT.name}
        resumeUrl={CONTENT.resumeUrl}
      />

      <main className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <Hero content={CONTENT} />
        <ProjectsSection projects={CONTENT.projects} subtitle={CONTENT.projectsSubtitle} />
        <ExperienceSection experience={CONTENT.experience} subtitle={CONTENT.experienceSubtitle} />
        <SkillsSection skills={CONTENT.skills} subtitle={CONTENT.skillsSubtitle} />
        <EducationSection education={CONTENT.education} />
        <ContactSection contact={CONTENT.contact} subtitle={CONTENT.contactSubtitle} />
      </main>

      <Footer name={CONTENT.name} />
    </div>
  );
}
