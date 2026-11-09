"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

type Experience = {
  number: string;
  category: string;
  title: string;
  description: string;
  alt: string;
} & (
  | { image: string; video?: never }
  | { video: string; image?: never }
);

const experiences: Experience[] = [
  {
    number: "01",
    category: "F1 PADDOCK CLUB",
    title: "Attend today’s most exhilarating\nevents with front-row access.",
    description: "A closer seat to the moments that move you.",
   
    image: "carousel-3.webp",
    alt: "Race car speeding around a track",
  },
  {
    number: "02",
    category: "DINING",
    title: "Make room for\nthe unforgettable.",
    description: "The city’s most sought-after tables, ready when you are.",
    image: "carousel-1.webp",
    alt: "Warmly lit restaurant dining room",
  },
  {
    number: "03",
    category: "STAYS",
    title: "Find your own\nkind of extraordinary.",
    description:
      "Thoughtful stays and remarkable rooms, wherever you’re headed.",
    video: "/stays.mp4",
    alt: "Resort hotel surrounded by greenery",
  },
];

gsap.registerPlugin(ScrollTrigger);

export default function ExperienceScroll() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (
        !section ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      gsap.utils.toArray<HTMLElement>("[data-experience-panel]", section).forEach(
        (panel) => {
          const image = panel.querySelector<HTMLElement>(
            "[data-experience-image]",
          );
          const copy = panel.querySelector<HTMLElement>(
            "[data-experience-copy]",
          );

          if (image) {
            gsap.fromTo(
              image,
              { yPercent: -12 },
              {
                yPercent: 12,
                ease: "none",
                scrollTrigger: {
                  trigger: panel,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              },
            );
          }

          if (copy) {
            gsap.fromTo(
              copy,
              { y: 18 },
              {
                y: -18,
                ease: "none",
                scrollTrigger: {
                  trigger: panel,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          }
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Explore Velto experiences"
      className="relative text-white"
    >
      {experiences.map((experience, index) => (
        <div
          key={experience.number}
          data-experience-panel
          className="relative isolate mx-1 my-1 h-[calc(100svh-8px)] min-h-[36rem] overflow-hidden rounded-xl bg-[#171614] sm:mx-2 sm:my-2 sm:h-[calc(100svh-16px)] sm:rounded-2xl"
        >
          {experience.video ? (
            <video
              data-experience-image
              aria-hidden="true"
              className="experience-parallax-image scale-[1.025] object-cover blur-[1.5px]"
              src={experience.video}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : (
            <div
              data-experience-image
              role="img"
              aria-label={experience.alt}
              className="experience-parallax-image scale-[1.025] bg-cover bg-center blur-[1.5px]"
              style={{ backgroundImage: `url("${experience.image}")` }}
            />
          )}
          <div className="absolute inset-0 bg-black/5" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/35" />
         
          <div
            data-experience-copy
            className="absolute inset-x-0 top-1/2 mx-auto flex w-full max-w-3xl -translate-y-1/2 flex-col items-center px-10 text-center sm:px-12"
          >
            <h2 className="max-w-3xl whitespace-pre-line text-[1.45rem] font-medium leading-[1.25] tracking-[-0.035em] text-white drop-shadow-lg sm:text-3xl lg:text-[2rem]">
              {experience.title}
            </h2>
            <p className="mono mt-5 flex items-center gap-2 text-[9px] tracking-[0.16em] text-white/80 sm:text-[10px]">
              <span
                aria-hidden="true"
                className="h-1 w-1 rounded-full bg-white/70"
              />
              {experience.category}
            </p>
          </div>

          <div
            aria-label={`Experience ${index + 1} of ${experiences.length}`}
            className="absolute right-4 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-1 rounded-full border border-white/10 bg-white/20 px-2.5 py-2.5 shadow-lg backdrop-blur-md sm:right-8"
          >
            {experiences.map((item, dotIndex) => (
              <span
                key={item.number}
                aria-label={`Slide ${dotIndex + 1}: ${item.category}`}
                className={`experience-scroll-dot ${dotIndex === index ? "is-active" : ""}`}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
