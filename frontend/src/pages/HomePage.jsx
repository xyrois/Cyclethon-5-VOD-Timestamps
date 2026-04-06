import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const DONATE_URL = "https://tilt.fyi/EMmt5WmPFh";
const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

function formatSeconds(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map(n => String(n).padStart(2, "0")).join(":");
}

export default function HomePage() {
  const [vods, setVods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/vods`)
      .then(res => setVods(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.page}>

    {/* Hero */}
    <div style={styles.hero}>
      <p style={styles.eyebrow}>Connor's Charity Stream</p>
      <div style={styles.heroTitleRow}>
        <img src="/logo.png" style={styles.heroLogo} />
        <h1 style={styles.heroTitle}>Cyclethon 5</h1>
        <img src="/logo.png" style={styles.heroLogo} />
      </div>
      <p style={styles.heroSub}>
        Please support the immune deficiency foundation. This website makes VODs easier to watch by providing timestamps.
      </p>
      <div style={styles.heroActions}>
        <a href={DONATE_URL} target="_blank" rel="noreferrer" style={styles.donateBtn}>
          ♥ Donate
        </a>
        <Link to="/clips" style={styles.clipsBtn}>
          View Clips →
        </Link>
      </div>
    </div>

      {/* VOD List */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Stream VODs</h2>
          <span style={styles.count}>{vods.length} parts</span>
        </div>

        {loading ? (
          <div style={styles.empty}>Loading...</div>
        ) : vods.length === 0 ? (
          <div style={styles.empty}>No VODs added yet.</div>
        ) : (
          <div style={styles.vodGrid}>
            {vods.map((vod, i) => (
              <Link to={`/vod/${vod.id}`} key={vod.id} style={styles.vodCard}>
                <div style={styles.vodNum}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div style={styles.vodInfo}>
                  <div style={styles.vodTitle}>{vod.title || `VOD ${i + 1}`}</div>
                  <div style={styles.vodMeta}>VOD · {vod.vod_id}</div>
                </div>
                <div style={styles.vodArrow}>→</div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Donate banner */}
      <div style={styles.donateBanner}>
        <div>
          <div style={styles.bannerTitle}>Support the cause</div>
          <div style={styles.bannerSub}>Connor, Chris and guests are riding for charity. Every donation counts!</div>
        </div>
        <a href={DONATE_URL} target="_blank" rel="noreferrer" style={styles.bannerBtn}>
          Donate on Tiltify ♥
        </a>
      </div>

    </div>
  );
}

const styles = {
  page: {
    maxWidth: "780px",
    margin: "0 auto",
    padding: "3rem 1.5rem 5rem",
  },
  hero: {
    textAlign: "center",
    paddingBottom: "3.5rem",
    borderBottom: "1px solid var(--border)",
    marginBottom: "3rem",
  },
  eyebrow: {
    fontSize: "0.78rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--accent)",
    marginBottom: "0.75rem",
  },
  heroTitle: {
    fontSize: "clamp(2.8rem, 8vw, 5rem)",
    fontWeight: 700,
    letterSpacing: "-2px",
    lineHeight: 1,
    color: "var(--text)",
    marginBottom: "1rem",
  },
  heroSub: {
    fontSize: "1rem",
    color: "var(--text-muted)",
    maxWidth: "380px",
    margin: "0 auto 2rem",
    lineHeight: 1.6,
  },
  heroActions: {
    display: "flex",
    gap: "0.75rem",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  donateBtn: {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.6rem 1.4rem",
    background: "var(--red)",
    color: "#fff",
    borderRadius: "var(--radius)",
    fontWeight: 600,
    fontSize: "0.9rem",
  },
  clipsBtn: {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.6rem 1.4rem",
    background: "var(--surface-2)",
    color: "var(--text)",
    borderRadius: "var(--radius)",
    fontWeight: 600,
    fontSize: "0.9rem",
    border: "1px solid var(--border)",
  },
  section: {
    marginBottom: "3rem",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1rem",
  },
  sectionTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "var(--text)",
  },
  count: {
    fontSize: "0.8rem",
    color: "var(--text-muted)",
    fontWeight: 500,
  },
  vodGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  vodCard: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1rem 1.25rem",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    transition: "border-color var(--transition), background var(--transition)",
    cursor: "pointer",
  },
  vodNum: {
    fontVariantNumeric: "tabular-nums",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "var(--text-subtle)",
    minWidth: "1.75rem",
  },
  vodInfo: {
    flex: 1,
  },
  vodTitle: {
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "var(--text)",
    marginBottom: "0.2rem",
  },
  vodMeta: {
    fontSize: "0.78rem",
    color: "var(--text-muted)",
  },
  vodArrow: {
    color: "var(--text-subtle)",
    fontSize: "0.9rem",
  },
  empty: {
    padding: "2rem",
    textAlign: "center",
    color: "var(--text-muted)",
    fontSize: "0.9rem",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
  },
  donateBanner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    padding: "1.5rem",
    background: "var(--accent-dim)",
    border: "1px solid rgba(124,108,252,0.25)",
    borderRadius: "var(--radius-lg)",
    flexWrap: "wrap",
  },
  bannerTitle: {
    fontWeight: 600,
    fontSize: "0.95rem",
    marginBottom: "0.25rem",
  },
  bannerSub: {
    fontSize: "0.83rem",
    color: "var(--text-muted)",
  },
  bannerBtn: {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.6rem 1.25rem",
    background: "var(--red)",
    color: "#fff",
    borderRadius: "var(--radius)",
    fontWeight: 600,
    fontSize: "0.875rem",
    whiteSpace: "nowrap",
  },
  heroTitleRow: {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
  marginBottom: "1rem",
},
heroLogo: {
  width: "72px",
  height: "72px",
  borderRadius: "12px",
  imageRendering: "pixelated", // keeps the pixel art crisp
},
heroTitle: {
  fontSize: "clamp(2.8rem, 8vw, 5rem)",
  fontWeight: 700,
  letterSpacing: "-2px",
  lineHeight: 1,
  color: "var(--text)",
  margin: 0, // remove old marginBottom, row handles it
},
};
