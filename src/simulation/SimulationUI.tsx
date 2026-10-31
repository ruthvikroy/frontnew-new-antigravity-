/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Dynamic game-inspired space flight HUD and controls with targeting reticle, telemetry meters, and Mars repo link
*/
import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Eye,
  Maximize2,
  Minimize2,
  Sliders,
  Sparkles,
  Globe,
  Radio,
  Github,
  Crosshair,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { useSimulationStore } from './simulationStore';
import { FocusTarget, QualityLevel } from './types';

interface SimulationUIProps {
  embedded?: boolean;
}

export const SimulationUI: React.FC<SimulationUIProps> = ({ embedded = false }) => {
  const isPlaying = useSimulationStore((state) => state.isPlaying);
  const orbitalSpeed = useSimulationStore((state) => state.orbitalSpeed);
  const focusTarget = useSimulationStore((state) => state.focusTarget);
  const showOrbits = useSimulationStore((state) => state.showOrbits);
  const showAtmosphere = useSimulationStore((state) => state.showAtmosphere);
  const quality = useSimulationStore((state) => state.quality);
  const simulationEpoch = useSimulationStore((state) => state.simulationEpoch);
  const isExpanded = useSimulationStore((state) => state.isExpanded);
  const activeHoverBody = useSimulationStore((state) => state.activeHoverBody);
  const isWarping = useSimulationStore((state) => state.isWarping);
  const flightVelocity = useSimulationStore((state) => state.flightVelocity);

  const togglePlay = useSimulationStore((state) => state.togglePlay);
  const setOrbitalSpeed = useSimulationStore((state) => state.setOrbitalSpeed);
  const setFocusTarget = useSimulationStore((state) => state.setFocusTarget);
  const toggleOrbits = useSimulationStore((state) => state.toggleOrbits);
  const toggleAtmosphere = useSimulationStore((state) => state.toggleAtmosphere);
  const setQuality = useSimulationStore((state) => state.setQuality);
  const resetSimulation = useSimulationStore((state) => state.resetSimulation);
  const toggleExpanded = useSimulationStore((state) => state.toggleExpanded);

  const daysElapsed = (simulationEpoch / 2.0).toFixed(1);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-3 sm:p-5 select-none font-mono-code text-[11px]">
      
      {/* Top HUD Bar */}
      <div className="flex items-start justify-between gap-3 pointer-events-auto">
        <div className="flex flex-wrap items-center gap-2 px-3 py-1.5 bg-[#050505]/85 backdrop-blur-md border border-white/10 shadow-lg">
          <div className="w-2 h-2 rounded-full bg-[#F5D000] animate-pulse" />
          <span className="text-[#F1F1F1] font-bold tracking-wider uppercase">
            3D CELESTIAL ENGINE // GAME DYNAMICS
          </span>
          <span className="text-[#888888] hidden sm:inline">|</span>
          <span className="text-[#F5D000] hidden sm:inline tracking-widest">
            T+ {daysElapsed} DAYS
          </span>
          {activeHoverBody && (
            <span className="text-white bg-white/10 px-1.5 py-0.5 border border-white/20">
              {activeHoverBody}
            </span>
          )}
          {isWarping && (
            <span className="text-black bg-[#F5D000] font-black px-1.5 py-0.5 tracking-wider animate-pulse flex items-center gap-1">
              <Zap size={10} />
              WARP BOOST ACTIVE
            </span>
          )}
        </div>

        {/* Target Body Switcher & Mars Repo Button */}
        <div className="flex items-center gap-1.5 bg-[#050505]/85 backdrop-blur-md border border-white/10 p-1">
          {(['system', 'earth', 'moon', 'mars'] as FocusTarget[]).map((target) => (
            <button
              key={target}
              onClick={() => setFocusTarget(target)}
              className={`px-2.5 py-1 uppercase tracking-wider transition-colors cursor-pointer text-[10px] ${
                focusTarget === target
                  ? target === 'mars'
                    ? 'bg-red-600 text-white font-bold shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                    : 'bg-[#F5D000] text-black font-bold'
                  : 'text-[#888888] hover:text-[#F1F1F1] hover:bg-white/5'
              }`}
            >
              {target}
            </button>
          ))}

          {/* Direct Mars Simulation GitHub Repository Link */}
          <a
            href="https://github.com/ruthvikroy/mars-simulation-"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-1 border border-red-500/40 bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-white transition-colors cursor-pointer text-[10px] font-bold ml-1"
            title="Explore Mars Simulation Source Repository on GitHub"
          >
            <Github size={12} />
            <span className="hidden md:inline">MARS REPO</span>
            <ExternalLink size={10} className="opacity-70" />
          </a>

          {embedded && (
            <button
              onClick={toggleExpanded}
              className="p-1.5 text-[#888888] hover:text-[#F5D000] transition-colors border-l border-white/10 ml-1 cursor-pointer"
              title={isExpanded ? 'Collapse' : 'Full Screen Simulation'}
            >
              {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
          )}
        </div>
      </div>

      {/* Central Interactive Flight Crosshair & Targeting Reticle */}
      <div className="my-auto mx-auto pointer-events-none flex flex-col items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Outer Crosshair Ring */}
          <div className="absolute inset-0 border border-white/20 rounded-full" />
          {/* Corner Lock Brackets */}
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#F5D000]" />
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#F5D000]" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#F5D000]" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#F5D000]" />
          {/* Center Target Dot */}
          <div className="w-1.5 h-1.5 bg-[#F5D000] rounded-full" />
        </div>

        {/* Lock Telemetry Readout */}
        <div className="mt-2 px-2 py-0.5 bg-black/80 border border-white/20 text-[9px] text-[#F1F1F1] tracking-widest uppercase">
          LOCK: <span className="text-[#F5D000] font-bold">{focusTarget.toUpperCase()}</span>
          {' • '}VEL: <span className="text-[#38bdf8] font-mono">{flightVelocity.toFixed(1)} KM/S</span>
        </div>
      </div>

      {/* Bottom Controls Bar & Flight Instrumentation */}
      <div className="flex flex-wrap items-end justify-between gap-3 pointer-events-auto">
        <div className="flex items-center gap-1 bg-[#050505]/85 backdrop-blur-md border border-white/10 p-1">
          <button
            onClick={togglePlay}
            className="p-1.5 text-[#F1F1F1] hover:text-[#F5D000] transition-colors cursor-pointer"
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
          </button>

          <button
            onClick={resetSimulation}
            className="p-1.5 text-[#888888] hover:text-[#F1F1F1] transition-colors cursor-pointer"
            title="Reset Simulation (R)"
          >
            <RotateCcw size={13} />
          </button>

          <div className="flex items-center gap-2 px-2 border-l border-white/10 text-[10px]">
            <span className="text-[#888888] uppercase">SPEED</span>
            <input
              type="range"
              min="0.2"
              max="4.0"
              step="0.2"
              value={orbitalSpeed}
              onChange={(e) => setOrbitalSpeed(parseFloat(e.target.value))}
              className="w-16 sm:w-20 accent-[#F5D000] cursor-pointer"
            />
            <span className="text-[#F5D000] font-bold w-7 text-right">
              {orbitalSpeed.toFixed(1)}x
            </span>
          </div>
        </div>

        {/* Flight Simulator Keybind Legend */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 bg-[#050505]/85 backdrop-blur-md border border-white/10 text-[10px] text-[#888888]">
          <span><kbd className="px-1 py-0.5 bg-white/10 text-white rounded">W</kbd><kbd className="px-1 py-0.5 bg-white/10 text-white rounded ml-0.5">A</kbd><kbd className="px-1 py-0.5 bg-white/10 text-white rounded ml-0.5">S</kbd><kbd className="px-1 py-0.5 bg-white/10 text-white rounded ml-0.5">D</kbd> THRUST</span>
          <span><kbd className="px-1 py-0.5 bg-[#F5D000]/20 text-[#F5D000] rounded">SHIFT</kbd> WARP</span>
          <span><kbd className="px-1 py-0.5 bg-white/10 text-white rounded">1..4</kbd> TARGETS</span>
          <span><kbd className="px-1 py-0.5 bg-white/10 text-white rounded">SPACE</kbd> PAUSE</span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#050505]/85 backdrop-blur-md border border-white/10 p-1 text-[10px]">
          <button
            onClick={toggleOrbits}
            className={`px-2 py-1 uppercase tracking-wider transition-colors cursor-pointer ${
              showOrbits ? 'text-[#F5D000] bg-[#F5D000]/10' : 'text-[#888888] hover:text-[#F1F1F1]'
            }`}
          >
            ORBITS {showOrbits ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={toggleAtmosphere}
            className={`px-2 py-1 uppercase tracking-wider transition-colors cursor-pointer ${
              showAtmosphere ? 'text-[#38bdf8] bg-[#38bdf8]/10' : 'text-[#888888] hover:text-[#F1F1F1]'
            }`}
          >
            ATMOSPHERE
          </button>
        </div>
      </div>
    </div>
  );
};

// --- End of SimulationUI.tsx ---
