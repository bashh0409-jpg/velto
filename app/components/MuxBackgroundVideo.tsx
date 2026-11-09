"use client";

import Hls from "hls.js";
import { useEffect, useRef } from "react";

type HlsRendition = {
  url: string;
  width: number;
};

function getBestVideoRendition(manifest: string, manifestUrl: string) {
  const renditions: HlsRendition[] = [];
  let streamInfo = "";

  for (const line of manifest.split(/\r?\n/)) {
    if (line.startsWith("#EXT-X-STREAM-INF:")) {
      streamInfo = line;
      continue;
    }

    if (!streamInfo || !line || line.startsWith("#")) continue;

    const resolution = streamInfo.match(/RESOLUTION=(\d+)x\d+/);
    if (resolution) {
      renditions.push({
        url: new URL(line, manifestUrl).href,
        width: Number(resolution[1]),
      });
    }
    streamInfo = "";
  }

  if (renditions.length === 0) {
    throw new Error("Mux master playlist contains no video renditions.");
  }

  const targetWidth = Math.min(
    Math.ceil(window.innerWidth * window.devicePixelRatio),
    1920,
  );
  return (
    renditions
      .filter((rendition) => rendition.width <= targetWidth)
      .sort((a, b) => b.width - a.width)[0] ?? renditions[0]
  );
}

type MuxBackgroundVideoProps = {
  playbackId: string;
  className: string;
  preload: "auto" | "metadata";
  "data-experience-image"?: boolean;
};

export default function MuxBackgroundVideo({
  playbackId,
  className,
  preload,
  "data-experience-image": isExperienceImage,
}: MuxBackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !playbackId) return;

    const manifestUrl = `https://stream.mux.com/${playbackId}.m3u8`;
    const controller = new AbortController();
    let hls: Hls | undefined;
    let removeNativeErrorListener: (() => void) | undefined;

    const loadVideo = async () => {
      try {
        const response = await fetch(manifestUrl, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error(`Mux returned HTTP ${response.status}.`);
        }

        const manifest = await response.text();
        const rendition = getBestVideoRendition(manifest, manifestUrl);
        if (controller.signal.aborted) return;

        if (Hls.isSupported()) {
          hls = new Hls();
          hls.on(Hls.Events.ERROR, (_event, data) => {
            if (data.fatal) {
              console.error(
                `Mux playback failed for ${playbackId}: ${data.details}` +
                  (data.response?.code
                    ? ` (HTTP ${data.response.code})`
                    : "") +
                  (data.error?.message ? ` — ${data.error.message}` : ""),
              );
            }
          });
          hls.loadSource(rendition.url);
          hls.attachMedia(video);
          return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          const handleMediaError = () => {
            console.error("Native Mux HLS playback failed.", {
              playbackId,
              code: video.error?.code,
              message: video.error?.message,
            });
          };
          video.addEventListener("error", handleMediaError);
          removeNativeErrorListener = () =>
            video.removeEventListener("error", handleMediaError);
          video.src = rendition.url;
          video.load();
          return;
        }

        throw new Error("This browser does not support HLS playback.");
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error(
            `Could not start Mux playback for ${playbackId}:`,
            error,
          );
        }
      }
    };

    void loadVideo();

    return () => {
      controller.abort();
      hls?.destroy();
      removeNativeErrorListener?.();
    };
  }, [playbackId]);

  return (
    <video
      ref={videoRef}
      data-experience-image={isExperienceImage}
      aria-hidden="true"
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload={preload}
    />
  );
}
