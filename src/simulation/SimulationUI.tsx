/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Minimal editorial floating simulation HUD and controls with monochromatic styling
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
      <div className="flex items-start justify-between gap-3 pointer-events-auto">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#050505]/85 backdrop-blur-md border border-white/10 shadow-lg">
          <div className="w-2 h-2 rounded-full bg-[#F5D000] animate-pulse" />
          <span className="text-[#F1F1F1] font-bold tracking-wider uppercase">
            ORBITAL MECHANICS SIMULATION
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
        </div>

        <div className="flex items-center gap-1.5 bg-[#050505]/85 backdrop-blur-md border border-white/10 p-1">
          {(['system', 'earth', 'moon'] as FocusTarget[]).map((target) => (
            <button
              key={target}
              onClick={() => setFocusTarget(target)}
              className={`px-2.5 py-1 uppercase tracking-wider transition-colors cursor-pointer text-[10px] ${
                focusTarget === target
                  ? 'bg-[#F5D000] text-black font-bold'
                  : 'text-[#888888] hover:text-[#F1F1F1] hover:bg-white/5'
              }`}
            >
              {target}
            </button>
          ))}

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

      <div className="flex flex-wrap items-end justify-between gap-3 pointer-events-auto">
        <div className="flex items-center gap-1 bg-[#050505]/85 backdrop-blur-md border border-white/10 p-1">
          <button
            onClick={togglePlay}
            className="p-1.5 text-[#F1F1F1] hover:text-[#F5D000] transition-colors cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
          </button>

          <button
            onClick={resetSimulation}
            className="p-1.5 text-[#888888] hover:text-[#F1F1F1] transition-colors cursor-pointer"
            title="Reset Simulation"
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

        <div className="flex items-center gap-1.5 bg-[#050505]/85 backdrop-blur-md border border-white/10 p-1 text-[10px]">
          <button
            onClick={toggleOrbits}
            className={`px-2 py-1 uppercase tracking-wider transition-colors cursor-pointer ${
              showOrbits ? 'text-[#F5D000] bg-[#F5D000]/10' : 'text-[#888888] hover:text-[#F1F1F1]'
            }`}
          >
            ORBIT {showOrbits ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={toggleAtmosphere}
            className={`px-2 py-1 uppercase tracking-wider transition-colors cursor-pointer ${
              showAtmosphere ? 'text-[#F5D000] bg-[#F5D000]/10' : 'text-[#888888] hover:text-[#F1F1F1]'
            }`}
          >
            ATMO {showAtmosphere ? 'ON' : 'OFF'}
          </button>

          <div className="flex items-center border-l border-white/10 pl-1.5">
            {(['low', 'medium', 'high'] as QualityLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setQuality(lvl)}
                className={`px-1.5 py-1 uppercase text-[9px] cursor-pointer ${
                  quality === lvl ? 'text-[#F5D000] font-bold' : 'text-[#888888] hover:text-white'
                }`}
              >
                {lvl[0].toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
// --- End of SimulationUI.tsx ---
