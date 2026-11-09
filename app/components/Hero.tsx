import React from 'react'

const Hero = () => {
  return (
    <div className="h-screen w-full relative text-center">
      <div className="relative rounded-b-xl w-full h-[90vh] overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="HeroVideo.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />

        <div className="absolute inset-0 bg-black/20" />

        <div className="relative z-10 flex h-full items-center justify-center">
          {/* hero content */}
        </div>
      </div>
      <p className="text-white/40 text-sm tracking-tighter uppercas capitalize font-semibold mono mt-4">
        Access coveted dining, hotels, And events
      </p>
    </div>
  );
}

export default Hero