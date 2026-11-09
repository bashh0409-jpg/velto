"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import type { ReactNode } from "react";
import { useRef } from "react";

type SectionRevealProps = {
  children?: ReactNode;
  className?: string;
};

export default function SectionReveal({
  children,
  className,
}: SectionRevealProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      gsap.fromTo(
        section,
        { autoAlpha: 0.7, scale: 0.92, y: 48 },
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: 0.9,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={className}>
      {children}
    </section>
  );
}
