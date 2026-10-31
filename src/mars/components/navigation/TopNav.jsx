import React from 'react';
import { useMarsStore } from '../../store/useMarsStore.js';
import { Compass } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'simulation', label: '3D Orbit & Drift' },
  { id: 'overview', label: 'Overview' },
  { id: 'explorer', label: 'Mars Globe' },
  { id: 'surface', label: 'Surface Atlas' },
  { id: 'atmosphere', label: 'Atmosphere Lab' },
  { id: 'environment', label: 'Environment' },
  { id: 'dashboard', label: 'Telemetry' },
  { id: 'comparison', label: 'Earth vs Mars' },
];

export const TopNav = ({ onReturnToDashboard }) => {
  const { activePage, setActivePage, unitSystem, setUnitSystem, triggerCameraReset } =
    useMarsStore();

  return (
    <header className="h-14 border-b border-slate-800/80 bg-slate-950/90 flex items-center justify-between gap-3 md:gap-6 px-3 sm:px-6 lg:px-8 shrink-0 z-30 sticky top-0 backdrop-blur-md">
      <div className="flex items-center gap-3 shrink-0">
        <a
          href="#overview"
          onClick={(e) => {
            e.preventDefault();
            setActivePage('overview');
          }}
          className="flex items-center gap-2 group"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 via-orange-600 to-red-600 p-0.5 flex items-center justify-center shadow-sm shadow-orange-900/50">
            <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-amber-500 to-red-600" />
            </div>
          </div>
          <span className="text-base font-bold tracking-wider text-slate-100 whitespace-nowrap group-hover:text-amber-400 transition-colors">
            MARS
          </span>
        </a>
        <span className="hidden sm:inline-block text-slate-600 text-xs font-mono">/</span>
        <span className="hidden sm:inline-block text-slate-400 text-xs font-mono tracking-tight">
          PLANETARY RESEARCH
        </span>
      </div>

      <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="flex items-center gap-2.5 shrink-0">
        <div className="flex items-center p-0.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] font-mono">
          {['metric', 'imperial', 'scientific'].map((u) => (
            <button
              key={u}
              onClick={() => setUnitSystem(u)}
              className={`px-2 py-1 rounded capitalize transition-colors ${
                unitSystem === u
                  ? 'bg-amber-600 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {u === 'scientific' ? 'Sci' : u}
            </button>
          ))}
        </div>

        <button
          onClick={triggerCameraReset}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-700/80 rounded-lg hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap"
          title="Recenter planetary camera"
        >
          <Compass className="w-3.5 h-3.5 text-amber-500" />
          <span>Recenter</span>
        </button>

        {onReturnToDashboard && (
          <button
            onClick={onReturnToDashboard}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold text-amber-300 bg-amber-500/15 border border-amber-500/50 rounded-lg hover:bg-amber-500 hover:text-black transition-all whitespace-nowrap cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.25)]"
            title="Return to Earth & Moon Comparative Telemetry"
          >
            <span>← EARTH // MOON</span>
          </button>
        )}
      </div>
    </header>
  );
};
