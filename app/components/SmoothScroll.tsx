"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import LocomotiveScroll from "locomotive-scroll";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    const scroll = new LocomotiveScroll({
      lenisOptions: {
        smoothWheel: true,
      },
      scrollCallback: () => ScrollTrigger.update(),
    });

    ScrollTrigger.refresh();

    return () => scroll.destroy();
  }, []);

  return null;
}
