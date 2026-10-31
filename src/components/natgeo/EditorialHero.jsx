/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Cinematic Space Punks editorial hero with realistic Earth and three-part split typography
*/
import React, { useState } from 'react';
import { ArrowDown, Compass, Globe, Sparkles } from 'lucide-react';
import { SpaceScene } from '../../simulation/SpaceScene';

export function EditorialHero({ onLaunchSimulation = () => {} }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      id="hero"
      aria-label="Editorial Hero"
      className="relative w-full min-h-[92vh] lg:min-h-[96vh] bg-[#050505] bg-dotted-grid border-b border-white/10 flex flex-col justify-between overflow-hidden select-none"
    >
      <div className="w-full border-b border-white/10 px-4 sm:px-8 py-5 z-20">
        <div className="max-w-[1720px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          <div className="md:col-span-4 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#F5D000] text-[10px] font-mono-code uppercase tracking-[0.25em]">
              <img src="/assets/space-punks-logo.png" alt="Logo" className="w-4 h-4 rounded-full object-cover shrink-0 shadow-[0_0_8px_rgba(245,208,0,0.3)]" />
              <span>01 / TEAM SPACE PUNKS</span>
            </div>
            <p className="text-xs font-mono-code uppercase tracking-wider text-[#F1F1F1] font-semibold">
              ASTRODASHBOARD // EXPLORE THE COSMOS
            </p>
          </div>

          <div className="md:col-span-5 border-l border-white/10 pl-0 md:pl-6">
            <p className="text-xs text-[#888888] leading-relaxed max-w-xl font-editorial">
              We chronicle the raw thermodynamic forces shaping our reality — from abyssal ocean rifts and tectonic collision zones to the cratered deserts of Mars and interstellar asteroids adrift in the deep solar gravitational well.
            </p>
          </div>

          <div className="md:col-span-3 flex md:justify-end items-start">
            <div className="flex flex-col md:items-end text-[10px] font-mono-code text-[#888888] gap-0.5">
              <span className="text-[#F1F1F1] font-bold">23°26'14" N • 149°03'42" E</span>
              <span>EARTH-MOON-MARS SYSTEM</span>
              <span className="text-[#F5D000]">SOL 4288 // ORBITAL TIME</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex-1 flex items-center justify-center w-full max-w-[1720px] mx-auto px-4 sm:px-8 py-8 lg:py-12">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto">
          <SpaceScene embedded={true} className="w-full h-full" />
        </div>

        <div className="relative z-10 w-full flex flex-col justify-between pointer-events-none gap-6 lg:gap-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-4 lg:gap-8">
            <div className="lg:col-span-5">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.04em] leading-none text-[#F1F1F1] uppercase select-none drop-shadow-[0_6px_20px_rgba(0,0,0,0.85)]">
                Explore
              </h1>
            </div>

            <div className="lg:col-span-2 flex flex-col justify-center">
              <div className="border-l-2 border-[#F5D000] pl-3 py-1 my-2 max-w-[190px]">
                <p className="text-[11px] sm:text-xs font-mono-code uppercase tracking-wider text-[#F1F1F1] leading-relaxed font-bold">
                  "Nature always wears the colors of the spirit."
                </p>
                <span className="text-[9px] font-mono-code uppercase text-[#888888] tracking-widest mt-1 block">
                  — R. W. EMERSON
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 text-left lg:text-right">
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.04em] leading-none text-[#F1F1F1] uppercase select-none drop-shadow-[0_6px_20px_rgba(0,0,0,0.85)]">
                The Unknown.
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-white/10 bg-[#0A0A0A]/80 backdrop-blur-md px-4 sm:px-8 py-4 z-20">
        <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-8 text-[11px] font-mono-code uppercase tracking-wider">
            <button
              onClick={onLaunchSimulation}
              className="text-[#F5D000] hover:underline flex items-center gap-2 cursor-pointer font-bold"
            >
              <Globe size={13} />
              <span>01 • EARTH BLUE MARBLE</span>
            </button>
            <span className="text-white/20">/</span>
            <a href="#articles" className="text-[#888888] hover:text-[#F1F1F1] transition-colors">
              02 • LUNAR HIGHLANDS
            </a>
            <span className="text-white/20">/</span>
            <button
              onClick={onLaunchSimulation}
              className="text-[#888888] hover:text-[#F1F1F1] transition-colors cursor-pointer"
            >
              03 • MARS SYSTEM 3D
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onLaunchSimulation}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="pointer-events-auto px-4 py-2 border border-[#F5D000] bg-[#F5D000] text-black hover:bg-black hover:text-[#F5D000] font-mono-code text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(245,208,0,0.3)]"
            >
              <Compass size={14} />
              <span>ENTER ASTRODASHBOARD</span>
            </button>

            <a
              href="#articles"
              className="p-2 border border-white/10 hover:border-white/30 text-[#888888] hover:text-[#F1F1F1] transition-colors"
              title="Scroll to Articles"
              aria-label="Scroll to Articles"
            >
              <ArrowDown size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- End of EditorialHero.jsx --- */
