"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Globe from "./Globe";

gsap.registerPlugin(useGSAP);

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const speed = useRef(1);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Build the timeline once
  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      speed.current = reduce ? 100 : 1;

      // Drop-in on page load
      gsap.from("[data-card]", {
        y: -28,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2,
      });

      const t = gsap.timeline({ paused: true });

      // Card grows from the square into the panel
      t.to(
        "[data-card]",
        {
          width: "20.5rem",
          height: "26rem",
          borderRadius: "1.5rem",
          borderWidth: 0,
          duration: 0.7,
          ease: "expo.inOut",
        },
        0,
      )
        // Icon shrinks away, full logo drops in
        .to(
          "[data-icon]",
          { opacity: 0, scale: 0.5, duration: 0.25, ease: "power2.in" },
          0,
        )
        .fromTo(
          "[data-logo]",
          { opacity: 0, y: -10, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" },
          0.35,
        )
        // Globe pops in
        .fromTo(
          "[data-globe]",
          { opacity: 0, scale: 0.4, rotate: -25 },
          {
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.8,
            ease: "back.out(1.6)",
          },
          0.4,
        )
        // Buttons + close slide up one after another
        .fromTo(
          "[data-item]",
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.09,
          },
          0.5,
        )
        // Close button spins in
        .fromTo(
          "[data-close]",
          { rotate: -180, scale: 0.5 },
          { rotate: 0, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
          0.7,
        );

      tl.current = t;
    },
    { scope: ref },
  );

  // Play / reverse when open changes
  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (open) {
      t.timeScale(speed.current).play();
    } else {
      t.timeScale(speed.current * 1.5).reverse();
    }
  }, [open]);

  const tab = open ? 0 : -1;

  return (
    <div ref={ref} className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div
        data-card
        className={`relative overflow-hidden  bg-black/10 backdrop-blur-xl transition-colors duration-300 w-14 h-14 rounded-[1.15rem]  border-2 border-white/5 ${
          open ? "" : "hover:bg-white/5"
        }`}
      >
        {/* Click target while closed */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          tabIndex={open ? -1 : 0}
          className={`absolute inset-0 z-10 cursor-pointer ${
            open ? "pointer-events-none" : ""
          }`}
        />

        {/* Fixed-width inner layout so content doesn't reflow while animating */}
        <div className="absolute  top-0 left-1/2 -translate-x-1/2 w-72 h-full flex flex-col items-center">
          {/* Logo area: icon fades out, full logo fades in */}
          <div className="relative  w-full h-[3.25rem] shrink-0">
            <img
              data-icon
              src="/velto-icon.svg"
              alt="Velto"
              className="absolute inset-0 m-auto h-8 w-8 object-contain"
            />
            <img
              data-logo
              src="/velto-logo.svg"
              alt="Velto"
              className="absolute inset-0 m-auto h-7 object-contain opacity-0"
            />
          </div>

          {/* Body */}
          <div
            aria-hidden={!open}
            className={`flex flex-1 w-full flex-col items-center px-2 pb-6 ${
              open ? "" : "pointer-events-none"
            }`}
          >
            {/* Animated globe */}
            <div
              data-globe
              className="flex flex-1 min-h-0 items-center justify-center opacity-0"
            >
              <Globe active={open} />
            </div>

            <div className="flex w-full mt-8 mono flex-col gap-4">
              <div data-item className="opacity-0">
                <button
                  type="button"
                  tabIndex={tab}
                  className="w-full cursor-pointer rounded-full mono bg-[#ddd5cc] py-2.5 text-sm font-semibold text-black shadow-md whitespace-nowrap transition hover:brightness-105 active:scale-[0.98]"
                >
                  Join the Waitlist
                </button>
              </div>
              <div data-item className="opacity-0">
                <button
                  type="button"
                  tabIndex={tab}
                  className="w-full cursor-pointer rounded-full border border-white/20 py-2.5 text-sm font-semibold text-white whitespace-nowrap transition hover:bg-white/10 active:scale-[0.98]"
                >
                  Sign In
                </button>
              </div>
            </div>

            <div data-item className="mt-6 opacity-0">
              <button
                data-close
                type="button"
                tabIndex={tab}
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-full border border-white/60 text-white transition-colors hover:bg-white/10"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
