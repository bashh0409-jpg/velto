"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function RevealScreen() {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [minimumPlaybackElapsed, setMinimumPlaybackElapsed] = useState(false);
  const [visible, setVisible] = useState(true);
  const minimumPlaybackTimer = useRef<number | null>(null);
  const leaving = pageLoaded && videoReady && minimumPlaybackElapsed;

  const startMinimumPlaybackTimer = () => {
    if (minimumPlaybackTimer.current !== null) return;

    minimumPlaybackTimer.current = window.setTimeout(() => {
      setMinimumPlaybackElapsed(true);
    }, 3000);
  };

  useEffect(() => {
    const handleLoad = () => setPageLoaded(true);

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad, { once: true });
    }

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  useEffect(
    () => () => {
      if (minimumPlaybackTimer.current !== null) {
        window.clearTimeout(minimumPlaybackTimer.current);
      }
    },
    [],
  );

  useEffect(() => {
    if (!leaving) return;

    const hide = window.setTimeout(() => setVisible(false), 700);
    return () => window.clearTimeout(hide);
  }, [leaving]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-label="Loading Velto"
      style={{
        clipPath: leaving ? "inset(0 0 100% 0)" : "inset(0 0 0 0)",
      }}
      className={`fixed inset-0 z-[100] overflow-hidden bg-black transition-[clip-path] duration-700 ease-in-out ${
        leaving ? "pointer-events-none" : ""
      }`}
    >
      <video
        src="/reveal.mp4"
        aria-hidden="true"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onPlaying={startMinimumPlaybackTimer}
        onCanPlay={() => setVideoReady(true)}
        onError={(event) => {
          const video = event.currentTarget;
          console.error("Could not play reveal video.", {
            code: video.error?.code,
            message: video.error?.message,
          });
          setVideoReady(true);
          startMinimumPlaybackTimer();
        }}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
        <Image
          src="/velto-icon.svg"
          alt="Velto"
          width={46}
          height={36}
          className="h-auto w-40 object-contain sm:w-10"
        />
       
      </div>
    </div>
  );
}
