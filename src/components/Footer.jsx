import React from 'react';

export function Footer() {
  return (
    <footer className="w-full border-t border-[var(--line)] bg-[var(--chip)] py-8 px-6 select-none">
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        <div className="flex items-center gap-2.5 font-bold text-[var(--accent)] tracking-tight">
          <img
            src="/assets/space-punks-logo.png"
            alt="Space Punks Logo"
            className="w-5 h-5 rounded-full object-cover shrink-0 border border-[#F5D000]/60"
          />
          <span className="font-editorial text-base text-[#F1F1F1] uppercase">TEAM SPACE PUNKS</span>
        </div>
        <p className="text-[var(--muted)] text-xs max-w-xl font-editorial">
          A crew-built command hub for exploring planetary systems, tracking missions, and discovering the physics of our cosmic neighborhood.
        </p>
      </div>
    </footer>
  );
}
