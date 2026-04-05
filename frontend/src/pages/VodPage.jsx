import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import TwitchPlayer from "../components/TwitchPlayer";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

function secondsToHMS(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map(n => String(n).padStart(2, "0")).join(":");
}

function parseHMS(str) {
  const parts = str.split(":").map(Number);
  if (parts.some(isNaN)) return null;
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0];
}

const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY;
const isAdmin = !!ADMIN_KEY;

export default function VodPage() {
  const { vodId } = useParams();
  const [vod, setVod] = useState(null);
  const [timestamps, setTimestamps] = useState([]);
  const [label, setLabel] = useState("");
  const [time, setTime] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [activeTs, setActiveTs] = useState(null);
  const playerRef = useRef(null);

  useEffect(() => {
    axios.get(`${API}/vods`).then(res => {
      const v = res.data.find(v => v.id === parseInt(vodId));
      setVod(v);
    });
    axios.get(`${API}/timestamps/${vodId}`).then(res => setTimestamps(res.data));
  }, [vodId]);

  const seekTo = (ts) => {
    playerRef.current?.seek(ts.time_seconds);
    setActiveTs(ts.id);
  };

  const addTimestamp = async () => {
    setError("");
    const seconds = parseHMS(time);
    if (!label.trim()) return setError("Label is required.");
    if (seconds === null) return setError("Use HH:MM:SS or MM:SS format.");

    setAdding(true);
    try {
      const res = await axios.post(`${API}/timestamps`, {
        vod_id: parseInt(vodId),
        label: label.trim(),
        time_seconds: seconds,
      }, {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      setTimestamps(prev =>
        [...prev, res.data].sort((a, b) => a.time_seconds - b.time_seconds)
      );
      setLabel("");
      setTime("");
    } catch {
      setError("Failed to save timestamp.");
    } finally {
      setAdding(false);
    }
  };

  const deleteTimestamp = async (e, tsId) => {
    e.stopPropagation();
    try {
      await axios.delete(`${API}/timestamps/${tsId}`, {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      setTimestamps(prev => prev.filter(ts => ts.id !== tsId));
      if (activeTs === tsId) setActiveTs(null);
    } catch {
      setError("Failed to delete timestamp.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addTimestamp();
  };

  return (
    <div style={styles.page}>

      <Link to="/" style={styles.back}>← All VODs</Link>
      <h1 style={styles.title}>{vod?.title || "Loading…"}</h1>

      <div style={styles.layout}>

        {/* Left: player + add timestamp (admin only) */}
        <div style={styles.left}>
          {vod?.vod_id && (
            <TwitchPlayer ref={playerRef} vodId={vod.vod_id} />
          )}

          {isAdmin && (
            <div style={styles.addBox}>
              <div style={styles.addTitle}>Add Timestamp</div>
              <div style={styles.addRow}>
                <input
                  style={styles.inputTime}
                  placeholder="HH:MM:SS"
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={8}
                />
                <input
                  style={styles.inputLabel}
                  placeholder="Label…"
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  style={{ ...styles.addBtn, ...(adding ? styles.addBtnDisabled : {}) }}
                  onClick={addTimestamp}
                  disabled={adding}
                >
                  {adding ? "…" : "Add"}
                </button>
              </div>
              {error && <div style={styles.errorMsg}>{error}</div>}
            </div>
          )}
        </div>

        {/* Right: timestamps */}
        <div style={styles.right}>
          <div style={styles.tsHeader}>
            <span style={styles.tsTitle}>Timestamps</span>
            <span style={styles.tsCount}>{timestamps.length}</span>
          </div>

          {timestamps.length === 0 ? (
            <div style={styles.tsEmpty}>No timestamps yet.</div>
          ) : (
            <div style={styles.tsList}>
              {timestamps.map(ts => (
                <div
                  key={ts.id}
                  style={{
                    ...styles.tsRow,
                    ...(activeTs === ts.id ? styles.tsRowActive : {}),
                  }}
                  onClick={() => seekTo(ts)}
                >
                  <span style={styles.tsTime}>{secondsToHMS(ts.time_seconds)}</span>
                  <span style={styles.tsLabel}>{ts.label}</span>
                  {isAdmin && (
                    <button
                      style={styles.deleteBtn}
                      onClick={(e) => deleteTimestamp(e, ts.id)}
                      title="Delete timestamp"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "2rem 1.5rem 5rem",
  },
  back: {
    display: "inline-flex",
    alignItems: "center",
    fontSize: "0.85rem",
    color: "var(--text-muted)",
    fontWeight: 500,
    marginBottom: "1.25rem",
    transition: "color var(--transition)",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 700,
    letterSpacing: "-0.5px",
    marginBottom: "1.5rem",
    color: "var(--text)",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 300px",
    gap: "1.5rem",
    alignItems: "start",
  },
  left: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  right: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    overflow: "hidden",
    position: "sticky",
    top: "72px",
  },
  addBox: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "1rem 1.25rem",
  },
  addTitle: {
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "0.75rem",
  },
  addRow: {
    display: "flex",
    gap: "0.5rem",
  },
  inputTime: {
    width: "100px",
    padding: "0.5rem 0.75rem",
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--text)",
    fontSize: "0.875rem",
    outline: "none",
    fontFamily: "monospace",
  },
  inputLabel: {
    flex: 1,
    padding: "0.5rem 0.75rem",
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    color: "var(--text)",
    fontSize: "0.875rem",
    outline: "none",
  },
  addBtn: {
    padding: "0.5rem 1rem",
    background: "var(--accent)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--radius)",
    fontWeight: 600,
    fontSize: "0.875rem",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  addBtnDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  errorMsg: {
    marginTop: "0.5rem",
    fontSize: "0.8rem",
    color: "var(--red)",
  },
  tsHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.875rem 1rem",
    borderBottom: "1px solid var(--border)",
  },
  tsTitle: {
    fontSize: "0.8rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "var(--text-muted)",
  },
  tsCount: {
    fontSize: "0.78rem",
    color: "var(--text-subtle)",
    fontWeight: 500,
  },
  tsEmpty: {
    padding: "1.5rem 1rem",
    fontSize: "0.85rem",
    color: "var(--text-muted)",
    textAlign: "center",
  },
  tsList: {
    maxHeight: "calc(100vh - 220px)",
    overflowY: "auto",
  },
  tsRow: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.65rem 1rem",
    background: "transparent",
    borderBottom: "1px solid var(--border)",
    cursor: "pointer",
    transition: "background var(--transition)",
  },
  tsRowActive: {
    background: "var(--accent-dim)",
  },
  tsTime: {
    fontFamily: "monospace",
    fontSize: "0.78rem",
    color: "var(--accent)",
    fontWeight: 600,
    minWidth: "54px",
  },
  tsLabel: {
    fontSize: "0.875rem",
    color: "var(--text)",
    flex: 1,
    lineHeight: 1.4,
  },
  deleteBtn: {
    background: "none",
    border: "none",
    color: "var(--text-subtle)",
    cursor: "pointer",
    fontSize: "0.75rem",
    padding: "0.2rem 0.4rem",
    borderRadius: "4px",
    lineHeight: 1,
    transition: "color var(--transition), background var(--transition)",
    flexShrink: 0,
  },
};