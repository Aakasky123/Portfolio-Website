import { SITE } from "../data/content";
import { useClock } from "../lib/hooks";
import { toggleVision } from "../lib/store";
import "./footer.css";

export default function Footer() {
  const { time, zone } = useClock(SITE.timeZone);
  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div className="footer__col">
          <p className="label">Colophon</p>
          <p>
            Set in Instrument Serif, Geist and Geist Mono. Built with React and Vite. No cookies, no trackers, no
            analytics.
          </p>
        </div>
        <div className="footer__col">
          <p className="label">About the agent</p>
          <p>
            The Astra on this page is a simulation, and like the real one, it asks before it does anything that
            matters. The real one is{" "}
            <a className="link" href="https://github.com/Aakasky123/ApplyPilotAI" target="_blank" rel="noreferrer">
              on GitHub
            </a>
            .
          </p>
        </div>
        <div className="footer__col">
          <p className="label">Keys</p>
          <p>
            <button type="button" className="footer__key" onClick={toggleVision}>
              <span className="kbd">V</span> agent vision
            </button>
            <br />
            <span className="kbd">Esc</span> back to human
          </p>
        </div>
        <div className="footer__col footer__col--end">
          <p className="label num">
            Jersey City · {time} {zone}
          </p>
          <p>
            <a className="link" href="#top">
              Back to top ↑
            </a>
          </p>
        </div>
      </div>

      <div className="footer__mark" aria-hidden>
        <span className="serif">Aakash Siricilla</span>
      </div>
      <div className="wrap footer__base">
        <p className="label">© {new Date().getFullYear()} Aakash Siricilla</p>
        <p className="label">Agents that act. Systems that hold.</p>
      </div>
    </footer>
  );
}
