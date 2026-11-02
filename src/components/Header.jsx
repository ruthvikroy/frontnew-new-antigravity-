/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Global header bar with navigation and 3D View mode switch
*/

import React from 'react';
import { ArrowLeftRight, Cloud, Eye, Compass } from 'lucide-react';

export function Header({
  syncScroll,
  onToggleSyncScroll,
  onJumpToTop,
  activeCount,
  onOpenDrive,
  viewMode,
  onToggleViewMode,
  onOpenMars,
  onReturnToEditorial = () => {},
}) {
  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    if (viewMode === 'simulation' || viewMode === 'mars') {
      onToggleViewMode('dashboard');
    }
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--chip)]/90 backdrop-blur-md border-b border-[var(--line)] px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Zone 1: Wordmark */}
        <button
          onClick={onJumpToTop}
          className="text-left group cursor-pointer focus:outline-none flex items-center gap-2.5"
          aria-label="Space Punks - Back to top"
        >
          <img
            src="/assets/space-punks-logo.png"
            alt="Space Punks Logo"
            className="w-7 h-7 rounded-full object-cover shrink-0 border border-[#F5D000]/60 shadow-[0_0_10px_rgba(245,208,0,0.3)] group-hover:scale-105 transition-transform"
          />
          <div className="flex items-baseline">
            <span className="font-bold tracking-tight text-[var(--accent)] transition-colors whitespace-nowrap shrink-0">
              Space Punks
            </span>
            <span className="hidden sm:inline-block text-[var(--muted)] tracking-widest uppercase ml-2.5">
              EARTH // MOON
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-[var(--muted)]">
          <a
            href="#dashboard"
            onClick={(e) => handleSmoothScroll(e, 'dashboard')}
            className="hover:text-[var(--text)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Comparative Matrix ({activeCount})
          </a>
          <a
            href="#radar"
            onClick={(e) => handleSmoothScroll(e, 'radar')}
            className="hover:text-[var(--text)] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Celestial Radar
          </a>
          <a
            href="#lunar-exploration"
            onClick={(e) => handleSmoothScroll(e, 'lunar-exploration')}
            className="hover:text-[var(--text)] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1 text-amber-300/90"
          >
            <span>Apollo Sites</span>
            <span className="text-[10px] bg-amber-500/20 border border-amber-500/40 text-amber-300 px-1 py-0.2 rounded font-mono">
              6
            </span>
          </a>
          <a
            href="#physics"
            onClick={(e) => handleSmoothScroll(e, 'physics')}
            className="hover:text-[var(--text)] transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <span>Astrophysics Reference</span>
            <span className="text-[var(--accent)] bg-[var(--line)] px-1.5 py-0.5 rounded">
              INFO
            </span>
          </a>
        </nav>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onReturnToEditorial}
            className="px-2.5 py-1.5 rounded border border-[#F5D000]/60 bg-black/80 text-[#F5D000] hover:bg-[#F5D000] hover:text-black font-mono transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
            title="Return to Team Space Punks AstroDashboard"
          >
            <img
              src="/assets/space-punks-logo.png"
              alt="Space Punks Logo"
              className="w-3.5 h-3.5 rounded-full object-cover shrink-0"
            />
            <span className="hidden sm:inline">AstroDashboard</span>
          </button>

          <button
            onClick={onToggleViewMode}
            className={`px-3 py-1.5 rounded border transition-colors flex items-center gap-1.5 cursor-pointer font-mono ${
              viewMode === 'simulation'
                ? 'bg-[var(--chip)] text-[var(--accent)] border-[var(--accent)] shadow-[0_0_10px_rgba(170,136,255,0.25)]'
                : 'bg-[var(--chip)] text-[var(--muted)] border-[var(--line)] hover:text-[var(--text)] hover:border-[var(--muted)]'
            }`}
            title="3D View"
          >
            {viewMode === 'simulation' ? <Compass className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{viewMode === 'simulation' ? 'Dashboard' : '3D View'}</span>
          </button>

          {/* Google Drive Archive Modal Trigger */}
          <button
            onClick={onOpenDrive}
            className="px-2.5 py-1.5 rounded border border-[var(--line)] bg-[var(--chip)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--muted)] transition-colors flex items-center gap-1 cursor-pointer"
            title="Google Drive Archive (Snapshots & Presets)"
          >
            <Cloud className="w-3.5 h-3.5 text-[var(--accent)]" />
            <span className="hidden lg:inline">Drive</span>
          </button>

          {/* Sync Scroll Toggle */}
          <button
            onClick={onToggleSyncScroll}
            className={`px-3 py-1.5 font-medium rounded border transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
              syncScroll
                ? 'bg-[var(--chip)] text-[var(--accent)] border-[var(--accent)] shadow-[0_0_10px_rgba(170,136,255,0.25)]'
                : 'bg-[var(--chip)] text-[var(--muted)] border-[var(--line)] hover:text-[var(--text)] hover:border-[var(--muted)]'
            }`}
            aria-pressed={syncScroll}
            aria-label={`Toggle Synchronized Scrolling. Currently ${syncScroll ? 'enabled' : 'disabled'}`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sync Scroll: {syncScroll ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

/* --- End of Header.jsx --- */
