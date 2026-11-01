/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Space Punks minimal footer keeping only Team Space Punks and its description
*/
import React from 'react';

export function NatGeoFooter() {
  return (
    <footer className="w-full bg-[#030303] text-[#888888] border-t border-white/10 select-none">
      <div className="max-w-[1720px] mx-auto px-6 sm:px-10 py-10 sm:py-12 border-x border-white/10 flex flex-col">
        <div className="flex flex-col gap-3.5 max-w-xl">
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
      </div>
    </footer>
  );
}

/* --- End of NatGeoFooter.jsx --- */
