import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SectionReveal from "./components/SectionReveal";
import ExperienceScroll from "./components/ExperienceScroll";

const stayBenefits = [
  {
    title: "Curated\nLuxury Stays",
    description:
      "Choose from a unique collection of the most decorated hotels in the world, with selections located in the top luxury travel destinations globally.",
  },
  {
    title: "Book With Points",
    description:
      "Use the points you’ve earned with Velto to book exceptional stays at some of the world’s most sought-after hotels, with elevated redemption rates across luxury properties and destinations globally.",
  },
  {
    title: "Find a Room in Seconds",
    description:
      "Booking with Atlas is a breeze—discover the destination, hotel, and room that’s just right for you inside Atlas app, and book your stay in (literal) seconds.",
  },
];

const page = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <SectionReveal className="relative flex min-h-screen w-full items-center justify-center px-6 text-center text-white">
        <div className="flex w-full max-w-[48rem] flex-col items-center gap-20">
          <p className="max-w-[46rem] text-lg font-medium leading-[1.6] tracking-tight text-[#808080] sm:text-xl md:text-2xl">
            With Velto, you can finally get tables at the hardest-to-book
            restaurants, find the perfect suite at the world’s best hotels, sit
            front row at sold-out concerts and sporting events—and much more.
            All seamlessly brought to you inside a card and app that’s as
            intuitive, as it is powerful.
          </p>

          <div className="w-full mt-20 max-w-[18rem]">
            <button
              type="button"
              className="mono w-fit px-4 cursor-pointer rounded-full bg-[#ddd5cc] py-3 text-sm font-semibold text-black shadow-md transition hover:brightness-105 active:scale-[0.98]"
            >
              Join the Waitlist
            </button>
            <p className="mt-6 leading-tight text-[#808080]">
              Velto membership is invite-only. Join the waitlist and we’ll
              contact you if it’s a fit.
            </p>
          </div>
        </div>
      </SectionReveal>

      <ExperienceScroll />
      <SectionReveal className="relative w-full px-6 py-24 text-white sm:py-32">
        <div className="mx-auto w-full max-w-[45rem]">
          {stayBenefits.map((benefit) => (
            <article
              key={benefit.title}
              className="grid gap-5 border-t border-white/15 py-8 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:gap-10 sm:py-16"
            >
              <h2 className="whitespace-pre-line text-2xl font-medium leading-tight tracking-tight text-white sm:text-[1.75rem]">
                {benefit.title}
              </h2>
              <p className="max-w-[32rem] text-lg leading-tight tracking-tight text-[#858585] sm:text-[1.55rem]">
                {benefit.description}
              </p>
            </article>
          ))}
          <div className="border-t border-white/15 mb-8" />
          <div className="w-full aspect-video rounded-4xl bg-white/10 mt-8 "></div>
        </div>
      </SectionReveal>
    </div>
  );
};

export default page;
