import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SectionReveal from "./components/SectionReveal";
import ExperienceScroll from "./components/ExperienceScroll";

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
      <SectionReveal className="relative flex min-h-screen w-full items-center justify-center px-6 text-center text-white">
        hff
      </SectionReveal>
    </div>
  );
};

export default page;
