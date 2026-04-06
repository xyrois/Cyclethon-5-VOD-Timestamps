import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const DONATE_URL = "https://tilt.fyi/EMmt5WmPFh";

// Helper to get current JST hour
function getJSTHour() {
  const now = new Date();
  const nowJST = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  return nowJST.getHours();
}

export default function Nav() {
  const { pathname } = useLocation();
  const [hour, setHour] = useState(getJSTHour());

  // Update hour every minute so the red dot appears/disappears in real time
  useEffect(() => {
    const interval = setInterval(() => setHour(getJSTHour()), 60000);
    return () => clearInterval(interval);
  }, []);

  const showLiveDot = hour >= 9 && hour < 17; // 9 AM to 5 PM JST

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.logo}>
        <img
          src="/logo.png"
          style={{ width: "28px", height: "28px", borderRadius: "6px", imageRendering: "pixelated" }}
        />
        Cyclethon 5
      </Link>

      <div style={styles.links}>
        <Link to="/" style={{ ...styles.link, ...(pathname === "/" ? styles.linkActive : {}) }}>
          VODs
        </Link>
        <Link to="/clips" style={{ ...styles.link, ...(pathname === "/clips" ? styles.linkActive : {}) }}>
          Clips
        </Link>
        <Link
          to="/live"
          style={{
            ...styles.link,
            ...(pathname === "/live" ? styles.linkActive : {}),
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
          }}
        >
          {showLiveDot && <span style={styles.liveDot} />}
          Live
        </Link>
        <a href={DONATE_URL} target="_blank" rel="noreferrer" style={styles.donateBtn}>
          ♥ Donate
        </a>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 2rem",
    height: "56px",
    background: "rgba(15,15,15,0.85)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid var(--border)",
  },
  logo: {
    fontWeight: 700,
    fontSize: "1.05rem",
    letterSpacing: "-0.3px",
    color: "var(--text)",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
  },
  link: {
    padding: "0.4rem 0.85rem",
    borderRadius: "8px",
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "var(--text-muted)",
    transition: "color var(--transition), background var(--transition)",
  },
  linkActive: {
    color: "var(--text)",
    background: "var(--surface-2)",
  },
  liveDot: {
    display: "inline-block",
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "var(--red)",
  },
  donateBtn: {
    marginLeft: "0.5rem",
    padding: "0.4rem 1rem",
    borderRadius: "8px",
    fontSize: "0.875rem",
    fontWeight: 600,
    background: "var(--red)",
    color: "#fff",
    transition: "opacity var(--transition)",
  },
};