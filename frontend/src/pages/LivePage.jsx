import { useState, useEffect } from "react";

const START_DAY_NUMBER = 3;
const TWITCH_CHANNEL = "cdawg";

// Get current JST time
function getJSTNow() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
}

// Get next 9:00 AM JST
function getNextStreamTime() {
  const now = getJSTNow();
  const stream = new Date(now);
  stream.setHours(9, 0, 0, 0); // 9:00 AM JST today
  if (now >= stream) {
    stream.setDate(stream.getDate() + 1);
  }
  return stream;
}

// Countdown calculation
function getCountdown(target) {
  const diff = target - getJSTNow();
  if (diff <= 0) return { h: 0, m: 0, s: 0 };
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { h, m, s };
}

// Pad numbers
function pad(n) {
  return String(n).padStart(2, "0");
}

export default function LivePage() {
  const [countdown, setCountdown] = useState(getCountdown(getNextStreamTime()));
  const [dayNumber, setDayNumber] = useState(START_DAY_NUMBER);
  const [isLive, setIsLive] = useState(false); // manual toggle for now

  useEffect(() => {
    const interval = setInterval(() => {
      const target = getNextStreamTime();
      setCountdown(getCountdown(target));

      const now = getJSTNow();
      const hour = now.getHours();
      const dayOffset = hour >= 21 ? 1 : 0;
      setDayNumber(START_DAY_NUMBER + dayOffset);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.page}>
      {isLive ? (
        <div style={styles.liveWrap}>
          <div style={styles.liveBadge}>🔴 LIVE NOW</div>
          <h1 style={styles.liveTitle}>cdawgva is live!</h1>
          <div style={styles.playerWrap}>
            <iframe
              src={`https://player.twitch.tv/?channel=${TWITCH_CHANNEL}&parent=${window.location.hostname}`}
              style={styles.iframe}
              allowFullScreen
            />
          </div>
          <a
            href={`https://twitch.tv/${TWITCH_CHANNEL}`}
            target="_blank"
            rel="noreferrer"
            style={styles.twitchBtn}
          >
            Watch on Twitch →
          </a>
        </div>
      ) : (
        <div>
          <p style={styles.eyebrow}>Cyclethon 5</p>
          <h1 style={styles.heading}>Day {dayNumber} starts in</h1>
          <div style={styles.timerRow}>
            {["h", "m", "s"].map((key) => (
              <div key={key} style={styles.timerBlock}>
                <span style={styles.timerNum}>{pad(countdown[key])}</span>
                <span style={styles.timerLabel}>
                  {key === "h" ? "hours" : key === "m" ? "minutes" : "seconds"}
                </span>
              </div>
            ))}
          </div>
          <p style={styles.sub}>Starts at 9:00 AM JST on Twitch</p>
          <a
            href={`https://twitch.tv/${TWITCH_CHANNEL}`}
            target="_blank"
            rel="noreferrer"
            style={styles.twitchBtn}
          >
            Follow on Twitch →
          </a>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    maxWidth: "780px",
    margin: "0 auto",
    padding: "5rem 1.5rem",
    textAlign: "center",
  },
  eyebrow: {
    fontSize: "0.78rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "var(--accent)",
    marginBottom: "1rem",
  },
  heading: {
    fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
    fontWeight: 700,
    letterSpacing: "-0.5px",
    color: "var(--text)",
    marginBottom: "2.5rem",
  },
  timerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    marginBottom: "2rem",
  },
  timerBlock: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.4rem",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "1.25rem 1.75rem",
    minWidth: "100px",
  },
  timerNum: {
    fontFamily: "monospace",
    fontSize: "clamp(2.5rem, 8vw, 4rem)",
    fontWeight: 700,
    color: "var(--text)",
    lineHeight: 1,
    letterSpacing: "-2px",
  },
  timerLabel: {
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "var(--text-muted)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  sub: {
    fontSize: "0.9rem",
    color: "var(--text-muted)",
    marginBottom: "2rem",
  },
  twitchBtn: {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.7rem 1.75rem",
    background: "#9146ff",
    color: "#fff",
    borderRadius: "var(--radius)",
    fontWeight: 600,
    fontSize: "0.95rem",
    marginTop: "1.5rem",
    textDecoration: "none",
  },
  liveWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  },
  liveBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    background: "rgba(232,55,42,0.15)",
    border: "1px solid rgba(232,55,42,0.4)",
    color: "var(--red)",
    borderRadius: "999px",
    padding: "0.3rem 1rem",
    fontSize: "0.8rem",
    fontWeight: 700,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  liveTitle: {
    fontSize: "2rem",
    fontWeight: 700,
    letterSpacing: "-0.5px",
    color: "var(--text)",
  },
  playerWrap: {
    width: "100%",
    aspectRatio: "16/9",
    borderRadius: "var(--radius-lg)",
    overflow: "hidden",
    border: "1px solid var(--border)",
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
  },
};