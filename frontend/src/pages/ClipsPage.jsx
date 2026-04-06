export default function ClipsPage() {
  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Clips</h1>
      </div>

      <div style={styles.card}>
        <p style={styles.blurb}> 
          The clips are uploaded to Connor's official clips
          channel.
        </p>

        <a
          href="https://www.youtube.com/@ConnorClipsOfficial/videos"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.linkButton}
        >
          Visit ConnorClips Channel →
        </a>
      </div>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: "700px",
    margin: "0 auto",
    padding: "2rem 1.5rem 5rem",
  },

  header: {
    marginBottom: "2rem",
  },

  title: {
    fontSize: "1.5rem",
    fontWeight: 700,
    letterSpacing: "-0.5px",
    color: "var(--text)",
  },

  card: {
    padding: "3rem 2rem",
    textAlign: "center",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
  },

  icon: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
  },

  blurb: {
    fontSize: "1rem",
    color: "var(--text)",
    marginBottom: "1.5rem",
    lineHeight: 1.6,
  },

  linkButton: {
    display: "inline-block",
    padding: "0.7rem 1.4rem",
    fontSize: "0.95rem",
    fontWeight: 600,
    borderRadius: "var(--radius-md)",
    background: "var(--accent)",
    color: "white",
    textDecoration: "none",
    marginBottom: "1.5rem",
  },

  subtext: {
    fontSize: "0.85rem",
    color: "var(--text-muted)",
    lineHeight: 1.5,
  },
};