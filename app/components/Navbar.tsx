"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import BrandedQRCode from "./BrandedQRCode";

gsap.registerPlugin(useGSAP);

const mobileAppUrl = "https://veyragroup.vercel.app/";
const appStoreUrl = "https://apps.apple.com/";
const playStoreUrl = "https://play.google.com/store/apps";

const getPhoneStore = () => {
  const userAgent = navigator.userAgent;

  if (/iPhone|iPod/i.test(userAgent)) {
    return { label: "Open App Store", url: appStoreUrl };
  }
  if (/Android.*Mobile/i.test(userAgent)) {
    return { label: "Open Play Store", url: playStoreUrl };
  }
  return null;
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [mobileAppOpen, setMobileAppOpen] = useState(false);
  const [phoneStore, setPhoneStore] = useState<{
    label: string;
    url: string;
  } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const speed = useRef(1);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setMobileAppOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (mobileAppOpen) {
          setMobileAppOpen(false);
        } else {
          setOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [mobileAppOpen]);

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
    <>
      <div ref={ref} className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <div
          data-card
          className={`relative overflow-hidden backdrop-blur-xl transition-colors duration-300 w-14 h-14 rounded-[1.15rem] border-2 ${
            mobileAppOpen
              ? "border-white bg-white"
              : `border-white/5 bg-black/10 ${open ? "" : "hover:bg-white/5"}`
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

          {open && !mobileAppOpen && (
            <button
              data-close
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-3 z-20 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/60 text-white transition-colors hover:bg-white/10"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          )}

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
                className={`absolute inset-0 m-auto h-7 object-contain opacity-0 ${
                  mobileAppOpen ? "brightness-0" : ""
                }`}
              />
            </div>

            {/* Body */}
            <div
              aria-hidden={!open}
              className={`flex flex-1 w-full flex-col items-center px-2 pb-6 ${
                open ? "" : "pointer-events-none"
              }`}
            >
              {/* Static globe artwork */}
              <div
                aria-hidden={mobileAppOpen}
                className={`relative flex flex-1 min-h-0 w-full items-center justify-center overflow-hidden ${
                  mobileAppOpen ? "hidden" : ""
                }`}
              >
                <img
                  src="/globe.png"
                  alt=""
                  width={7680}
                  height={4068}
                  decoding="async"
                  className="absolute left-1/2 top-1/2 h-auto w-[40rem] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain"
                />
              </div>

              <div
                aria-hidden={mobileAppOpen}
                className={`flex w-full mt-8 mono flex-col gap-2 ${
                  mobileAppOpen ? "hidden" : ""
                }`}
              >
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
                    onClick={() => {
                      setPhoneStore(getPhoneStore());
                      setMobileAppOpen(true);
                    }}
                    tabIndex={tab}
                    className="w-full cursor-pointer rounded-full mono bg-[#ddd5cc] py-2.5 text-sm font-semibold text-black shadow-md whitespace-nowrap transition hover:brightness-105 active:scale-[0.98]"
                  >
                    Get mobile app
                  </button>
                </div>
                <div data-item className="opacity-0 hidden">
                  <button
                    type="button"
                    tabIndex={tab}
                    className="w-full cursor-pointer rounded-full border border-white/20 py-2.5 text-sm font-semibold text-white whitespace-nowrap transition hover:bg-white/10 active:scale-[0.98]"
                  >
                    Sign In
                  </button>
                </div>
              </div>

              {mobileAppOpen && (
                <div className="flex flex-1 flex-col items-center justify-center gap-4">
                  <div className="mt-2 text-center">
                    <p className="flex items-center justify-center gap-1.5 text-xl font-semibold tracking-tight text-black">
                      Get the{" "}
                      <span className="inline-flex items-center gap-1 rounded-full border border-black/10 px-2 py-0.5 text-sm">
                        <img
                          src="/velto-icon.svg"
                          className="size-5"
                          alt=""
                        />
                        Velto
                      </span>{" "}
                      app
                    </p>
                  
                  </div>
                  {phoneStore ? (
                    <a
                      href={phoneStore.url}
                      className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition active:scale-[0.98]"
                    >
                      {phoneStore.label}
                    </a>
                  ) : (
                    <div className="rounded-[1.4rem] bg-white">
                      <BrandedQRCode value={mobileAppUrl} size={208} />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => setMobileAppOpen(false)}
                    className="cursor-pointer rounded-full bg-black px-6 py-2 text-sm font-semibold text-white transition active:scale-[0.98]"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
