import { useImperativeHandle, forwardRef, useRef } from "react";

const YouTubePlayer = forwardRef(function YouTubePlayer({ videoId }, ref) {
  const iframeRef = useRef(null);

  useImperativeHandle(ref, () => ({
    seek(seconds) {
      // YouTube iframe API seek via postMessage
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "seekTo", args: [seconds, true] }),
        "*"
      );
    },
  }));

  if (!videoId) return null;

  return (
    <div style={styles.wrapper}>
      <iframe
        ref={iframeRef}
        style={styles.iframe}
        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
});

export default YouTubePlayer;

const styles = {
  wrapper: {
    width: "100%",
    aspectRatio: "16/9",
    background: "#000",
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