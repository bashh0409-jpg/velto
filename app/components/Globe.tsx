"use client";

import React, { useEffect, useRef } from "react";

type GlobeProps = {
  active?: boolean; // animate only when true
  className?: string;
  speed?: number; // degrees per second
};

const R = 80;
const MERIDIAN_COUNT = 4; // 4 great circles = 8 meridian lines

const Globe = ({
  active = true,
  className = "h-40 w-40",
  speed = 25,
}: GlobeProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const angleRef = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!active || reduce) return;

    const rings =
      svgRef.current?.querySelectorAll<SVGEllipseElement>("[data-phase]");
    if (!rings) return;

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      angleRef.current = (angleRef.current + speed * dt) % 360;

      rings.forEach((el) => {
        const phase = Number(el.dataset.phase);
        const rad = ((angleRef.current + phase) * Math.PI) / 180;
        el.setAttribute("rx", String(Math.abs(Math.cos(rad)) * R));
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, speed]);

  const phases = Array.from(
    { length: MERIDIAN_COUNT },
    (_, i) => (180 / MERIDIAN_COUNT) * i,
  );

  const meridians = phases.map((p) => (
    <ellipse
      key={p}
      data-phase={p}
      cx="100"
      cy="100"
      rx={Math.abs(Math.cos((p * Math.PI) / 180)) * R}
      ry={R}
    />
  ));

  const parallels = (
    <>
      <ellipse cx="100" cy="30.7" rx="40" ry="8" />
      <ellipse cx="100" cy="60" rx="69.3" ry="13.9" />
      <ellipse cx="100" cy="100" rx="80" ry="16" />
      <ellipse cx="100" cy="140" rx="69.3" ry="13.9" />
      <ellipse cx="100" cy="169.3" rx="40" ry="8" />
    </>
  );

  return (
    <>
      <style>{`
        @keyframes globe-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .globe-float { animation: globe-float 4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .globe-float { animation: none; }
        }
      `}</style>

      <svg
        ref={svgRef}
        viewBox="0 0 200 200"
        className={`${active ? "globe-float" : ""} ${className}`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="globe-metal"
            gradientUnits="userSpaceOnUse"
            x1="20"
            y1="20"
            x2="180"
            y2="180"
          >
            <stop offset="0" stopColor="#f1e9df" />
            <stop offset="0.5" stopColor="#bfb3a5" />
            <stop offset="1" stopColor="#7d7266" />
          </linearGradient>
          <filter
            id="globe-shadow"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow
              dx="0"
              dy="6"
              stdDeviation="6"
              floodColor="#000"
              floodOpacity="0.35"
            />
          </filter>
        </defs>

        <g
          filter="url(#globe-shadow)"
          transform="rotate(-18 100 100)"
          fill="none"
        >
          {/* Dark underlay for tube depth */}
          <g stroke="#4a4239" strokeWidth="5" opacity="0.8">
            <circle cx="100" cy="100" r={R} />
            {meridians}
            {parallels}
          </g>
          {/* Metallic top layer */}
          <g stroke="url(#globe-metal)" strokeWidth="3">
            <circle cx="100" cy="100" r={R} />
            {meridians}
            {parallels}
          </g>
        </g>
      </svg>
    </>
  );
};

export default Globe;
