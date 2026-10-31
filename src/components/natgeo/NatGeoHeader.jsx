/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Space Punks editorial header with branding and navigation
*/
import React, { useState } from 'react';
import { Search, Globe, Menu, X, Compass, Radio, Sparkles, Github } from 'lucide-react';

export function NatGeoHeader({
  onLaunchSimulation = () => {},
  onOpenMars = () => {},
  activeSection = 'hero',
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { id: 'hero', label: 'EXPLORE', href: '#hero' },
    { id: 'articles', label: 'ARTICLES', href: '#articles' },
    { id: 'featured', label: 'SERIES & DISPATCH', href: '#featured' },
    { id: 'expeditions', label: 'ATLAS EXPEDITIONS', href: '#expeditions' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#050505]/90 backdrop-blur-md border-b border-white/10 select-none">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 sm:gap-6">
          <a href="#hero" className="flex items-center gap-3 group">
            <img
              src="/assets/space-punks-logo.png"
              alt="Space Punks Logo"
              className="w-9 h-9 rounded-full object-cover shrink-0 border border-[#F5D000]/70 shadow-[0_0_14px_rgba(245,208,0,0.35)] group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="font-black tracking-[-0.04em] text-sm sm:text-base text-[#F1F1F1] leading-none uppercase font-editorial">
                TEAM SPACE PUNKS
              </span>
              <span className="text-[9px] tracking-[0.28em] text-[#888888] font-mono-code uppercase mt-1">
                ASTRODASHBOARD // ORBITAL COMMAND
              </span>
            </div>
          </a>

          <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-white/10 text-[10px] font-mono-code text-[#888888]">
            <span className="text-[#F5D000] font-bold">VOL. 248</span>
            <span>•</span>
            <span>ISSUE 11.26</span>
            <span>•</span>
            <span className="text-[#F1F1F1]/80">OCTOBER 2026</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className={`px-3.5 py-1.5 text-[11px] font-mono-code tracking-[0.16em] uppercase transition-all duration-200 border ${
                activeSection === link.id
                  ? 'border-[#F5D000] text-[#F5D000] bg-[#F5D000]/5'
                  : 'border-transparent text-[#888888] hover:text-[#F1F1F1] hover:border-white/10'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="https://github.com/ruthvikroy/mars-simulation-"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 border border-red-500/30 bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white font-mono-code text-[11px] font-semibold tracking-wider uppercase transition-colors"
            title="Mars Simulation GitHub Repository"
          >
            <Github size={13} />
            <span>MARS REPO</span>
          </a>

          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 border border-white/10 hover:border-white/20 text-[#888888] hover:text-[#F1F1F1] bg-[#0A0A0A] transition-colors"
            title="Search AstroDashboard"
            aria-label="Search"
          >
            <Search size={14} />
          </button>

          <button
            onClick={onLaunchSimulation}
            className="px-3 py-1.5 border border-[#F5D000] bg-[#F5D000]/10 hover:bg-[#F5D000] text-[#F5D000] hover:text-black font-mono-code text-[11px] font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 shadow-[0_0_15px_rgba(245,208,0,0.2)] cursor-pointer"
            title="Open Interactive 3D Earth, Moon & Mars Simulation"
          >
            <Globe size={13} />
            <span className="hidden sm:inline">ENTER ASTRODASHBOARD</span>
            <span className="sm:hidden">3D</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 border border-white/10 text-[#F1F1F1] bg-[#0A0A0A]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-white/10 bg-[#0A0A0A] px-4 py-3">
          <div className="max-w-[1720px] mx-auto flex items-center gap-3">
            <Search size={16} className="text-[#F5D000]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH DISPATCHES, EXPEDITIONS, MARS ORBIT, JUPITER ASTEROIDS..."
              className="w-full bg-transparent border-none text-[#F1F1F1] placeholder-[#555555] text-xs font-mono-code uppercase focus:outline-none tracking-wider"
              autoFocus
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="text-[#888888] hover:text-[#F1F1F1] text-xs font-mono-code uppercase"
            >
              ESC
            </button>
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#050505] px-6 py-6 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-xs font-mono-code tracking-[0.2em] text-[#888888] hover:text-[#F5D000] border-b border-white/5 uppercase"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <a
              href="https://github.com/ruthvikroy/mars-simulation-"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 border border-red-500/40 bg-red-950/40 text-red-300 font-mono-code text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Github size={14} />
              <span>MARS SIMULATION REPO</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLaunchSimulation();
              }}
              className="w-full py-2.5 border border-[#F5D000] bg-[#F5D000]/10 text-[#F5D000] font-mono-code text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Globe size={14} />
              <span>OPEN SPACE SIMULATION</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

/* --- End of NatGeoHeader.jsx --- */
