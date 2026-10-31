import React from 'react';
import { Mars3DViewer } from '../../components/mars/Mars3DViewer.jsx';
import { TelemetryStrip, SelectedTelemetryDetail } from '../../components/telemetry/TelemetryStrip.jsx';
import { useMarsStore } from '../../store/useMarsStore.js';
import { MARS_LOCATIONS } from '../../data/locations/locations.js';
import {
  Compass,
  Wind,
  ArrowRight,
  Layers,
} from 'lucide-react';

export const HomePage = () => {
  const {
    setActivePage,
    triggerFlyToLocation,
    atmosphere,
    solarTime,
  } = useMarsStore();

  const formattedSolarHour = `${Math.floor(solarTime.localSolarHour)
    .toString()
    .padStart(2, '0')}:${Math.floor((solarTime.localSolarHour % 1) * 60)
    .toString()
    .padStart(2, '0')}`;

  return (
    <div className="flex flex-col min-h-full pb-16 bg-[#04060A]">
      {/* Top Aerospace Telemetry Ribbon */}
      <section className="border-b border-slate-800/80 bg-slate-950/80 px-5 lg:px-8 py-2 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-y-2">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>SIMULATION ENGINE: NOMINAL</span>
          </span>
          <span className="text-slate-700">·</span>
          <span>LOCAL SOLAR TIME: <strong className="text-amber-400 font-semibold">{formattedSolarHour} LST</strong></span>
          <span className="text-slate-700">·</span>
          <span>SEASON: <strong className="text-slate-200">Ls {solarTime.solarLongitudeLs.toFixed(1)}° (North Summer)</strong></span>
          <span className="text-slate-700">·</span>
          <span>SOLAR FLUX: <strong className="text-slate-200">586 W/m² (1.524 AU)</strong></span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400">ATMOSPHERIC STATE:</span>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-400 font-medium">
            τ {atmosphere.dustOpticalDepth.toFixed(2)}
          </span>
        </div>
      </section>

      {/* Main Hero Section: Dominant 3D Mars Viewport */}
      <section className="relative w-full h-[62vh] min-h-[480px] max-h-[760px] border-b border-slate-800/80 bg-[#04060A] overflow-hidden">
        <Mars3DViewer />

        {/* Floating Quick Surface Feature Bar (Top-Left) */}
        <div className="absolute top-3 left-3 z-10 hidden sm:flex flex-col gap-1.5 max-w-xs pointer-events-auto">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-1">
            Featured Geological Landmarks
          </span>
          <div className="flex flex-wrap gap-1.5">
            {MARS_LOCATIONS.slice(0, 4).map((loc) => (
              <button
                key={loc.id}
                onClick={() => triggerFlyToLocation(loc)}
                className="px-2.5 py-1 text-xs font-mono bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-amber-500/50 rounded-md shadow-md backdrop-blur-md transition-all whitespace-nowrap"
              >
                {loc.name.split(' (')[0]}
              </button>
            ))}
            <button
              onClick={() => setActivePage('surface')}
              className="px-2.5 py-1 text-xs font-mono bg-amber-600/20 text-amber-300 hover:bg-amber-600/30 border border-amber-500/40 rounded-md transition-all flex items-center gap-1"
            >
              <span>Atlas</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Scientific Telemetry & Dossier Section */}
      <main className="max-w-7xl mx-auto px-5 lg:px-8 pt-8 space-y-8 w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-500 tracking-wide uppercase">
              <span>Observation Corpus</span>
              <span className="text-slate-700">·</span>
              <span>Empirical Telemetry</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-100 mt-1">
              Fundamental Planetary Parameters
            </h1>
          </div>
          <p className="text-xs text-slate-400 max-w-md leading-relaxed">
            Standard reference measurements compiled from calibrated orbiter radiometers, lander
            meteorological packages, and radio science Doppler tracking.
          </p>
        </div>

        {/* Telemetry Cards Grid */}
        <TelemetryStrip />

        {/* Selected Parameter Detailed Dossier */}
        <SelectedTelemetryDetail />

        {/* Exploration Lab Quick Jump Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {/* Surface Atlas Card */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h2 className="text-base font-semibold text-slate-100">Surface Geography Atlas</h2>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Inspect Olympus Mons, Valles Marineris canyon rift, ancient Jezero and Gale paleolakes,
                and polar ice cap deposits with full coordinates and elevation models.
              </p>
            </div>
            <button
              onClick={() => setActivePage('surface')}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 font-mono"
            >
              <span>Explore Topography</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Atmosphere Lab Card */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                <Wind className="w-5 h-5" />
              </div>
              <h2 className="text-base font-semibold text-slate-100">Atmosphere Simulation Lab</h2>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Compute Martian air density, acoustic speed, and barometric scale height. Experiment
                with gas concentrations and altitude pressure profiles.
              </p>
            </div>
            <button
              onClick={() => setActivePage('atmosphere')}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300 font-mono"
            >
              <span>Enter Atmospheric Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Earth vs Mars Comparison Card */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h2 className="text-base font-semibold text-slate-100">Earth vs Mars Comparison</h2>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Direct comparative analysis of planetary radii, gravity, day lengths, axial obliquity,
                and atmospheric compositions with proportional visual scale models.
              </p>
            </div>
            <button
              onClick={() => setActivePage('comparison')}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-orange-400 hover:text-orange-300 font-mono"
            >
              <span>Compare Dimensions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scientific References & Missions Footer Banner */}
        <section className="border-t border-slate-800/70 pt-6 text-xs text-slate-400 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-slate-300 uppercase block mb-1">
              Calibrated Planetary Ephemerides
            </span>
            <p className="text-[11px] text-slate-400 max-w-xl">
              Datasets adhere to IAU Cartographic Coordinates, NASA Planetary Data System (PDS),
              and ESA Mars Climate Database. Models distinguish empirical observations from
              extrapolated estimates.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span>NASA MRO</span>
            <span>·</span>
            <span>ESA MEX</span>
            <span>·</span>
            <span>MSL CURIOSITY</span>
            <span>·</span>
            <span>M2020 PERSEVERANCE</span>
          </div>
        </section>
      </main>
    </div>
  );
};
