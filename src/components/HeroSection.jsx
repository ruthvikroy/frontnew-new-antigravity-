import React from 'react';
import { ArrowDown, Radio, Orbit, Activity, Shield, Sparkles } from 'lucide-react';

export function HeroSection({ onScrollToMatrix, onScrollToPhysics, onScrollToLunar }) {
  return (
    <section className="relative w-full border-b border-[var(--line)] bg-[var(--background)] px-6 pt-12 pb-10 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 text-[var(--muted)] uppercase tracking-wider mb-2">
            <span>Interplanetary Comparative Dossier</span>
            <span>•</span>
            <span className="text-[var(--accent)]">Dual Matrix</span>
          </div>

          <h1 className="font-bold text-[var(--accent)] tracking-tight mb-3">
            Terrestrial vs. Selenological Analogs
          </h1>

          <p className="text-[var(--muted)] leading-relaxed max-w-2xl mb-6">
            Compare extreme terrain elevations, deep tectonic trenches, cryogenic ice traps, and subterranean lava tubes across Earth and the Moon side-by-side with synchronized telemetry and astrophysics calculations.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onScrollToMatrix}
              className="px-4 py-2 bg-[var(--chip)] text-[var(--accent)] border border-[var(--line)] hover:border-[var(--accent)] rounded transition-colors flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>Explore Locations</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>

            {onScrollToLunar && (
              <button
                onClick={onScrollToLunar}
                className="px-4 py-2 bg-[var(--chip)] border border-[var(--line)] text-amber-300 hover:text-amber-200 hover:border-amber-400 rounded transition-colors cursor-pointer flex items-center gap-2"
              >
                <Radio className="w-3.5 h-3.5 text-amber-400" />
                <span>Apollo Landing Sites</span>
              </button>
            )}

            <button
              onClick={onScrollToPhysics}
              className="px-4 py-2 bg-[var(--chip)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--muted)] rounded transition-colors cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Astrophysics Reference Data</span>
            </button>
          </div>
        </div>

        {/* 4-Column KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 border-t border-[var(--line)]">
          {/* KPI 1: Mean Orbital Distance */}
          <div className="bg-[var(--chip)] border border-[var(--line)] p-4 rounded hover:border-[var(--accent)] transition-colors">
            <div className="flex items-center gap-2 text-[var(--muted)] mb-1">
              <Orbit className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Mean Orbit Distance</span>
            </div>
            <div className="font-bold text-[var(--text)]">
              384,400 <span className="text-[var(--muted)]">KM</span>
            </div>
            <div className="text-[var(--muted)] mt-1">
              1.282 LIGHT-SECONDS DELAY
            </div>
          </div>

          {/* KPI 2: Gravity Differential */}
          <div className="bg-[var(--chip)] border border-[var(--line)] p-4 rounded hover:border-[var(--accent)] transition-colors">
            <div className="flex items-center gap-2 text-[var(--muted)] mb-1">
              <Activity className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Surface Gravity Ratio</span>
            </div>
            <div className="font-bold text-[var(--text)]">
              6.06 : 1 <span className="text-[var(--accent)]">Δ</span>
            </div>
            <div className="text-[var(--muted)] mt-1">
              9.81 M/S² VS 1.62 M/S²
            </div>
          </div>

          {/* KPI 3: Atmosphere Factor */}
          <div className="bg-[var(--chip)] border border-[var(--line)] p-4 rounded hover:border-[var(--accent)] transition-colors">
            <div className="flex items-center gap-2 text-[var(--muted)] mb-1">
              <Shield className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Atmosphere Delta</span>
            </div>
            <div className="font-bold text-[var(--text)] flex items-baseline">
              10<sup className="text-[var(--accent)]">14</sup> <span className="text-[var(--muted)] ml-1">FACTOR</span>
            </div>
            <div className="text-[var(--muted)] mt-1">
              101.3 KPA VS HARD VACUUM
            </div>
          </div>

          {/* KPI 4: Diurnal Cycle */}
          <div className="bg-[var(--chip)] border border-[var(--line)] p-4 rounded hover:border-[var(--accent)] transition-colors">
            <div className="flex items-center gap-2 text-[var(--muted)] mb-1">
              <Radio className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Day/Night Period</span>
            </div>
            <div className="font-bold text-[var(--text)]">
              24H <span className="text-[var(--muted)]">//</span> 708H
            </div>
            <div className="text-[var(--muted)] mt-1">
              1 TERRESTRIAL DAY VS 29.5 DAYS
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
