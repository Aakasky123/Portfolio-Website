import { useEffect } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import AgentSection from "./components/AgentSection";
import SystemsSection from "./components/SystemsSection";
import StackSection from "./components/StackSection";
import AboutSection from "./components/AboutSection";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import VisionLayer from "./components/VisionLayer";

const TITLE = document.title;

export default function App() {
  // When the tab is in the background, the page is waiting on you.
  useEffect(() => {
    const onVis = () => {
      document.title = document.hidden ? "● Awaiting human input" : TITLE;
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // A note for whoever opens the console.
  useEffect(() => {
    console.log(
      "%c▲ Astra %c you opened the console, which is exactly what an agent would do.\n%cAakash builds agents and the systems under them. Say hi: aakash.siricilla02@gmail.com",
      "background:#ff4f12;color:#121211;padding:2px 6px;font-weight:600",
      "color:inherit",
      "color:#888"
    );
  }, []);

  return (
    <>
      <a className="skip" href="#agent">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <AgentSection />
        <SystemsSection />
        <StackSection />
        <AboutSection />
        <Contact />
      </main>
      <Footer />
      <VisionLayer />
    </>
  );
}
