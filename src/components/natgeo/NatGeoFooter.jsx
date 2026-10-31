/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Space Punks Swiss brutalist editorial footer with manifesto, indices, and legal credits
*/
import React from 'react';
import { ArrowUp, Globe, Compass, Radio } from 'lucide-react';

export function NatGeoFooter({ onLaunchSimulation = () => {} }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#030303] text-[#888888] border-t border-white/10 select-none">
      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 py-12 sm:py-16 border-x border-white/10 flex flex-col gap-12">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 pb-10 border-b border-white/10">
          <div className="flex flex-col gap-4 max-w-md">
            <div className="flex items-center gap-3">
              <img
                src="/assets/space-punks-logo.png"
                alt="Space Punks Logo"
                className="w-9 h-9 rounded-full object-cover shrink-0 border border-[#F5D000]/70 shadow-[0_0_14px_rgba(245,208,0,0.35)]"
              />
              <span className="font-black tracking-[-0.04em] text-lg text-[#F1F1F1] leading-none uppercase font-editorial">
                TEAM SPACE PUNKS
              </span>
            </div>
            <p className="text-xs text-[#888888] leading-relaxed font-editorial">
              A crew-built command hub for exploring planetary systems, tracking missions, and discovering the physics of our cosmic neighborhood.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs font-mono-code uppercase">
            <div className="flex flex-col gap-2.5">
              <span className="text-[#F1F1F1] font-bold tracking-widest text-[10px] text-[#F5D000]">
                EXPLORATION
              </span>
              <a href="#hero" className="hover:text-[#F1F1F1] transition-colors">EARTH DISPATCH</a>
              <a href="#articles" className="hover:text-[#F1F1F1] transition-colors">LUNAR CARTOGRAPHY</a>
              <button onClick={onLaunchSimulation} className="text-left hover:text-[#F1F1F1] transition-colors cursor-pointer">3D MARS ORBIT</button>
              <a href="https://github.com/ruthvikroy/mars-simulation-" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 text-red-300 transition-colors">MARS REPO (GITHUB)</a>
              <a href="#expeditions" className="hover:text-[#F1F1F1] transition-colors">GLOBAL ATLAS</a>
            </div>

            <div className="flex flex-col gap-2.5">
              <span className="text-[#F1F1F1] font-bold tracking-widest text-[10px] text-[#F5D000]">
                DIVISIONS
              </span>
              <span className="hover:text-[#F1F1F1] cursor-pointer">PLANETARY ASTROPHYSICS</span>
              <span className="hover:text-[#F1F1F1] cursor-pointer">HADAL OCEANOGRAPHY</span>
              <span className="hover:text-[#F1F1F1] cursor-pointer">GLACIOLOGY ARCHIVE</span>
              <span className="hover:text-[#F1F1F1] cursor-pointer">VOLCANOLOGY LAB</span>
            </div>

            <div className="flex flex-col gap-2.5">
              <span className="text-[#F1F1F1] font-bold tracking-widest text-[10px] text-[#F5D000]">
                INTERACTIVE
              </span>
              <button
                onClick={onLaunchSimulation}
                className="text-left text-[#F5D000] hover:underline cursor-pointer font-bold"
              >
                3D EARTH-MOON-MARS
              </button>
              <span className="hover:text-[#F1F1F1] cursor-pointer">FIELD LOG ARCHIVES</span>
              <span className="hover:text-[#F1F1F1] cursor-pointer">EXPEDITION TRUST</span>
              <span className="hover:text-[#F1F1F1] cursor-pointer">IMAGE GALLERIES</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[10px] font-mono-code text-[#666666]">
          <div className="flex flex-wrap items-center gap-4">
            <span>© 2026 TEAM SPACE PUNKS • ASTRODASHBOARD</span>
            <span>•</span>
            <span>ALL RIGHTS RESERVED</span>
            <span>•</span>
            <span className="text-[#888888]">ASTRODASHBOARD // SPACE OPERATIONS</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-[#888888] hover:text-[#F5D000] transition-colors cursor-pointer self-start sm:self-auto border border-white/10 px-3 py-1 bg-[#080808]"
          >
            <span>BACK TO TOP</span>
            <ArrowUp size={12} />
          </button>
        </div>
      </div>
    </footer>
  );
}

/* --- End of NatGeoFooter.jsx --- */
