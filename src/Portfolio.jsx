import { useEffect, useState } from "react";
import { CONTENT, NAV_ITEMS } from "./data/content";
import Navbar from "./components/Navbar";
import SideNav from "./components/SideNav";
import Hero from "./components/Hero";
import AboutSection from "./components/AboutSection";
import ProjectsSection from "./components/ProjectsSection";
import ExperienceSection from "./components/ExperienceSection";
import SkillsSection from "./components/SkillsSection";
import EducationSection from "./components/EducationSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home");

  const handleNavigate = (event, id) => {
    event.preventDefault();
    const target = document.getElementById(id);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${id}`);
      setActiveSection(id);
    }
  };

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!elements.length) {
      return undefined;
    }

    const syncActiveSection = () => {
      const hashId = window.location.hash.slice(1);
      const hashTarget = hashId ? document.getElementById(hashId) : null;

      if (hashTarget) {
        const rect = hashTarget.getBoundingClientRect();

        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setActiveSection(hashId);
          return;
        }
      }

      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;

      if (nearBottom) {
        setActiveSection(elements[elements.length - 1].id);
        return;
      }

      const probeY = window.innerHeight * 0.38;
      let current = elements[0];
      let closestDistance = Number.POSITIVE_INFINITY;

      for (const element of elements) {
        const distance = Math.abs(element.getBoundingClientRect().top - probeY);

        if (distance < closestDistance) {
          closestDistance = distance;
          current = element;
        }
      }

      setActiveSection(current.id);
    };

    const syncHashTarget = () => {
      const hashId = window.location.hash.slice(1);
      const target = hashId ? document.getElementById(hashId) : null;

      if (target) {
        target.scrollIntoView({ block: "start" });
        setActiveSection(hashId);
      } else {
        syncActiveSection();
      }
    };

    window.requestAnimationFrame(syncHashTarget);
    const hashSyncTimer = window.setTimeout(syncHashTarget, 350);
    window.addEventListener("scroll", syncActiveSection, { passive: true });
    window.addEventListener("resize", syncActiveSection);
    window.addEventListener("hashchange", syncHashTarget);

    return () => {
      window.clearTimeout(hashSyncTimer);
      window.removeEventListener("scroll", syncActiveSection);
      window.removeEventListener("resize", syncActiveSection);
      window.removeEventListener("hashchange", syncHashTarget);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar
        items={NAV_ITEMS}
        activeSection={activeSection}
        name={CONTENT.name}
        resumeUrl={CONTENT.resumeUrl}
        onNavigate={handleNavigate}
      />
      <SideNav items={NAV_ITEMS} activeSection={activeSection} onNavigate={handleNavigate} />

      <main className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <Hero content={CONTENT} />
        <AboutSection
          about={CONTENT.about}
          subtitle={CONTENT.aboutSubtitle}
          capabilities={CONTENT.aboutCapabilities}
        />
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
