import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

const TwitchPlayer = forwardRef(function TwitchPlayer({ vodId }, ref) {
  const instanceRef = useRef(null);
  const containerId = "twitch-player";

  useImperativeHandle(ref, () => ({
    seek(seconds) {
      instanceRef.current?.seek(seconds);
    },
    pause() {
      instanceRef.current?.pause();
    },
    play() {
      instanceRef.current?.play();
    },
  }));

  useEffect(() => {
    if (!vodId) return;

    function initPlayer() {
      // Destroy old instance if re-mounting
      if (instanceRef.current) {
        try { instanceRef.current.destroy?.(); } catch (_) {}
        instanceRef.current = null;
      }

      instanceRef.current = new window.Twitch.Player(containerId, {
        video: vodId,
        width: "100%",
        height: "100%",
        autoplay: false,
      });
    }

    if (window.Twitch?.Player) {
      initPlayer();
    } else {
      // Load script once, then init
      const existing = document.getElementById("twitch-embed-script");
      if (existing) {
        existing.addEventListener("load", initPlayer);
      } else {
        const script = document.createElement("script");
        script.id = "twitch-embed-script";
        script.src = "https://player.twitch.tv/js/embed/v1.js";
        script.onload = initPlayer;
        document.body.appendChild(script);
      }
    }

    return () => {
      try { instanceRef.current?.destroy?.(); } catch (_) {}
      instanceRef.current = null;
    };
  }, [vodId]);

  return (
    <div style={styles.wrapper}>
      <div id={containerId} style={styles.player} />
    </div>
  );
});

export default TwitchPlayer;

const styles = {
  wrapper: {
    width: "100%",
    aspectRatio: "16/9",
    background: "#000",
    borderRadius: "var(--radius-lg)",
    overflow: "hidden",
    border: "1px solid var(--border)",
  },
  player: {
    width: "100%",
    height: "100%",
  },
};