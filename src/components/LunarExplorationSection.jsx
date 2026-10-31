import React, { useState } from 'react';
import {
  APOLLO_LANDING_SITES,
  LUNAR_LANDMARKS,
  ROBOTIC_LANDERS,
  LUNAR_MARIA,
  NEAR_EARTH_ASTEROIDS,
} from '../data/lunarLandmarks.js';
import {
  Rocket,
  Compass,
  Mountain,
  Radio,
  Eye,
  Disc,
  Clock,
  Weight,
  Sparkles,
} from 'lucide-react';

export function LunarExplorationSection({
  onSelectSite = () => {},
  selectedLandmarkId = null,
  onSwitchToSimulation = () => {},
  onPlayClick = () => {},
}) {
  const [activeTab, setActiveTab] = useState('apollo'); // 'apollo' | 'craters' | 'robotic' | 'maria' | 'asteroids'

  const TABS = [
    { id: 'apollo', label: `Apollo Crewed (${APOLLO_LANDING_SITES.length})`, icon: Rocket },
    { id: 'craters', label: `Craters & Massifs (${LUNAR_LANDMARKS.length})`, icon: Mountain },
    { id: 'robotic', label: `Robotic Landers (${ROBOTIC_LANDERS.length})`, icon: Radio },
    { id: 'maria', label: `Lunar Maria (${LUNAR_MARIA.length})`, icon: Compass },
    { id: 'asteroids', label: `Asteroids (${NEAR_EARTH_ASTEROIDS.length})`, icon: Disc },
  ];

  const handleSelectSite = (siteId) => {
    onPlayClick();
    onSelectSite(siteId);
  };

  return (
    <section
      id="lunar-exploration"
      aria-label="Lunar Surface Exploration Matrix"
      className="w-full border-t border-[var(--line)] bg-black/60 backdrop-blur-md px-6 py-10 select-none text-[var(--text)]"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--line)] pb-5">
          <div>
            <div className="flex items-center gap-2 text-[var(--accent)] text-xs uppercase tracking-wider mb-1">
              <Sparkles size={14} />
              <span>Lunar Surface Telemetry &amp; Reconnaissance Archive</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-[var(--accent)]">
              Apollo Landing Sites &amp; Lunar Geography
            </h2>
            <p className="text-[var(--muted)] text-xs uppercase mt-1">
              All 6 Apollo human landings, selenographic coordinates, astronauts landed, samples returned, and robotic precursors.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onPlayClick();
                onSwitchToSimulation();
              }}
              className="px-3 py-1.5 rounded border border-[var(--accent)] bg-[var(--chip)] text-[var(--accent)] text-xs uppercase font-medium hover:bg-black transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Eye size={14} />
              <span>Immersive 3D Space View</span>
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  onPlayClick();
                }}
                className={`px-3 py-1.5 rounded text-xs uppercase font-medium flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-black text-[var(--accent)] border border-[var(--accent)] shadow-[0_0_10px_rgba(170,136,255,0.2)]'
                    : 'bg-[var(--chip)] text-[var(--muted)] hover:text-[var(--text)] border border-[var(--line)]'
                }`}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Apollo Crewed Landings */}
        {activeTab === 'apollo' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {APOLLO_LANDING_SITES.map((mission) => {
              const isSelected = selectedLandmarkId === mission.id;
              return (
                <div
                  key={mission.id}
                  className={`rounded border bg-[var(--chip)]/90 backdrop-blur-md p-4 flex flex-col justify-between transition-all duration-200 ${
                    isSelected
                      ? 'border-[var(--accent)] ring-1 ring-[var(--accent)] shadow-[0_0_15px_rgba(170,136,255,0.25)]'
                      : 'border-[var(--line)] hover:border-white/30'
                  }`}
                >
                  <div className="flex flex-col gap-3">
                    {/* Mission Header */}
                    <div className="flex items-start justify-between gap-2 border-b border-[var(--line)] pb-2.5">
                      <div>
                        <div className="text-[10px] text-[var(--accent)] uppercase font-semibold">
                          {mission.mission} • {mission.date}
                        </div>
                        <h3 className="text-sm font-bold uppercase text-[var(--text)] mt-0.5">
                          {mission.name}
                        </h3>
                        <div className="text-[11px] text-[var(--muted)] uppercase mt-0.5">
                          {mission.region}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950/60 border border-amber-500/40 text-amber-300 font-mono">
                        {mission.coordinatesFormatted}
                      </span>
                    </div>

                    {mission.referenceImage && (
                      <div className="relative rounded overflow-hidden aspect-[16/10] bg-black border border-[var(--line)]">
                        <img
                          src={mission.referenceImage}
                          alt={mission.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                        <span className="absolute bottom-1.5 left-2 text-[9px] text-zinc-300 font-mono drop-shadow">
                          {mission.referenceCredit}
                        </span>
                      </div>
                    )}

                    <div className="space-y-1.5 text-xs">
                      <div className="text-[10px] text-[var(--muted)] uppercase">Landed Astronauts:</div>
                      <div className="grid grid-cols-1 gap-1">
                        {mission.landedAstronauts.map((astro) => (
                          <div
                            key={astro}
                            className="px-2 py-1 rounded bg-black/60 border border-[var(--line)] text-amber-200/90 text-xs font-mono flex items-center justify-between"
                          >
                            <span>{astro}</span>
                            <span className="text-[9px] text-[var(--muted)]">MOONWALKER</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mission Key Stats */}
                    <div className="grid grid-cols-3 gap-2 border-t border-b border-[var(--line)] py-2 text-center text-xs font-mono">
                      <div>
                        <div className="text-[9px] text-[var(--muted)] uppercase flex items-center justify-center gap-1">
                          <Clock size={10} />
                          <span>EVA</span>
                        </div>
                        <div className="font-semibold text-[var(--text)] mt-0.5">
                          {mission.evaDuration}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] text-[var(--muted)] uppercase flex items-center justify-center gap-1">
                          <Weight size={10} />
                          <span>Samples</span>
                        </div>
                        <div className="font-semibold text-[var(--accent)] mt-0.5">
                          {mission.samplesReturnedKg} kg
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] text-[var(--muted)] uppercase">Module</div>
                        <div className="font-semibold text-[var(--text)] mt-0.5 truncate">
                          {mission.lunarModule.split(' ')[1] || mission.lunarModule}
                        </div>
                      </div>
                    </div>

                    {/* Description & Historic Quote */}
                    <p className="text-xs text-[var(--muted)] leading-relaxed">
                      {mission.description}
                    </p>
                    {mission.quote && (
                      <div className="text-[11px] italic text-[var(--text)]/80 border-l-2 border-[var(--accent)] pl-2 py-0.5">
                        {mission.quote}
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="pt-3 mt-3 border-t border-[var(--line)] flex items-center justify-between gap-2">
                    <span className="text-[10px] text-[var(--muted)] font-mono">
                      {mission.totalSurfaceStay} STAY
                    </span>
                    <button
                      onClick={() => handleSelectSite(mission.id)}
                      className={`px-3 py-1.5 rounded text-xs uppercase font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--accent)] text-black font-semibold'
                          : 'bg-black text-[var(--accent)] border border-[var(--accent)] hover:bg-[var(--accent)] hover:text-black'
                      }`}
                    >
                      <Eye size={12} />
                      <span>{isSelected ? 'Framed in 3D' : 'Fly to Site'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Major Craters & Massifs */}
        {activeTab === 'craters' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {LUNAR_LANDMARKS.map((landmark) => {
              const isSelected = selectedLandmarkId === landmark.id;
              return (
                <div
                  key={landmark.id}
                  className={`rounded border bg-[var(--chip)]/90 backdrop-blur-md p-4 flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-[var(--accent)] ring-1 ring-[var(--accent)] shadow-[0_0_15px_rgba(170,136,255,0.25)]'
                      : 'border-[var(--line)] hover:border-white/30'
                  }`}
                >
                  <div className="flex flex-col gap-2.5">
                    {landmark.referenceImage && (
                      <div className="relative rounded overflow-hidden aspect-[16/10] bg-black border border-[var(--line)]">
                        <img
                          src={landmark.referenceImage}
                          alt={landmark.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                        <span className="absolute bottom-1.5 left-2 text-[9px] text-zinc-300 font-mono drop-shadow">
                          {landmark.referenceCredit}
                        </span>
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-1 border-b border-[var(--line)] pb-2">
                      <div>
                        <span className="text-[10px] text-[var(--accent)] uppercase font-semibold">
                          {landmark.categoryLabel}
                        </span>
                        <h3 className="text-sm font-bold uppercase text-[var(--text)] mt-0.5">
                          {landmark.name}
                        </h3>
                      </div>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-black border border-[var(--line)] text-cyan-300 font-mono">
                        {landmark.coordinatesFormatted}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--muted)] leading-relaxed">
                      {landmark.description}
                    </p>

                    <div className="text-[11px] text-zinc-300 font-mono bg-black/40 p-2 rounded border border-[var(--line)]">
                      <span className="text-[var(--accent)]">3D Relief:</span> {landmark.featureDescription}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[var(--line)] flex justify-end">
                    <button
                      onClick={() => handleSelectSite(landmark.id)}
                      className={`px-3 py-1.5 rounded text-xs uppercase font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--accent)] text-black font-semibold'
                          : 'bg-black text-[var(--accent)] border border-[var(--accent)] hover:bg-[var(--accent)] hover:text-black'
                      }`}
                    >
                      <Eye size={12} />
                      <span>{isSelected ? 'Framed in 3D' : 'Fly to Crater'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Robotic Landers */}
        {activeTab === 'robotic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROBOTIC_LANDERS.map((lander) => {
              const isSelected = selectedLandmarkId === lander.id;
              return (
                <div
                  key={lander.id}
                  className={`rounded border bg-[var(--chip)]/90 backdrop-blur-md p-4 flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]'
                      : 'border-[var(--line)] hover:border-white/30'
                  }`}
                >
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-start justify-between gap-1 border-b border-[var(--line)] pb-2">
                      <div>
                        <span className="text-[10px] text-emerald-400 uppercase font-semibold">
                          {lander.categoryLabel} • {lander.date}
                        </span>
                        <h3 className="text-sm font-bold uppercase text-[var(--text)] mt-0.5">
                          {lander.name}
                        </h3>
                        <div className="text-[11px] text-[var(--muted)] uppercase">
                          {lander.region}
                        </div>
                      </div>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono">
                        {lander.coordinatesFormatted}
                      </span>
                    </div>

                    {lander.referenceImage && (
                      <div className="relative rounded overflow-hidden aspect-[16/10] bg-black border border-[var(--line)]">
                        <img
                          src={lander.referenceImage}
                          alt={lander.name}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                        <span className="absolute bottom-1.5 left-2 text-[9px] text-zinc-300 font-mono drop-shadow">
                          {lander.referenceCredit}
                        </span>
                      </div>
                    )}

                    <p className="text-xs text-[var(--muted)] leading-relaxed">
                      {lander.description}
                    </p>

                    <div className="text-[11px] text-zinc-300 font-mono bg-black/40 p-2 rounded border border-[var(--line)]">
                      <span className="text-emerald-400">Scientific Milestone:</span> {lander.featureDescription}
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[var(--line)] flex justify-end">
                    <button
                      onClick={() => handleSelectSite(lander.id)}
                      className={`px-3 py-1.5 rounded text-xs uppercase font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-400 text-black font-semibold'
                          : 'bg-black text-emerald-400 border border-emerald-400 hover:bg-emerald-400 hover:text-black'
                      }`}
                    >
                      <Eye size={12} />
                      <span>{isSelected ? 'Framed in 3D' : 'Fly to Probe'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 4: Lunar Maria */}
        {activeTab === 'maria' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {LUNAR_MARIA.map((mare) => {
              const isSelected = selectedLandmarkId === mare.id;
              return (
                <div
                  key={mare.id}
                  className={`rounded border bg-[var(--chip)]/90 backdrop-blur-md p-4 flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]'
                      : 'border-[var(--line)] hover:border-white/30'
                  }`}
                >
                  <div className="flex flex-col gap-2.5">
                    <div className="border-b border-[var(--line)] pb-2">
                      <span className="text-[10px] text-indigo-400 uppercase font-semibold">
                        {mare.categoryLabel}
                      </span>
                      <h3 className="text-sm font-bold uppercase text-[var(--text)] mt-0.5">
                        {mare.name}
                      </h3>
                      <div className="text-[11px] text-[var(--muted)] uppercase">
                        {mare.region} • {mare.coordinatesFormatted}
                      </div>
                    </div>
                    <p className="text-xs text-[var(--muted)] leading-relaxed">
                      {mare.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-[var(--line)] flex justify-end">
                    <button
                      onClick={() => handleSelectSite(mare.id)}
                      className={`px-3 py-1.5 rounded text-xs uppercase font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-400 text-black font-semibold'
                          : 'bg-black text-indigo-400 border border-indigo-400 hover:bg-indigo-400 hover:text-black'
                      }`}
                    >
                      <Eye size={12} />
                      <span>{isSelected ? 'Framed in 3D' : 'Fly to Mare'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 5: Near-Earth Asteroids from zip */}
        {activeTab === 'asteroids' && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {NEAR_EARTH_ASTEROIDS.map((ast) => (
              <div
                key={ast.name}
                className="rounded border border-[var(--line)] bg-[var(--chip)]/90 backdrop-blur-md p-3.5 flex flex-col justify-between transition-all hover:border-white/30"
              >
                <div className="flex flex-col gap-2">
                  <div className="relative rounded overflow-hidden aspect-[4/3] bg-black border border-[var(--line)]">
                    <img
                      src={ast.image}
                      alt={ast.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xs font-bold uppercase text-[var(--text)]">
                    {ast.name}
                  </h3>
                  <div className="text-[10px] text-[var(--accent)] font-mono">
                    {ast.diameter} • {ast.type}
                  </div>
                  <div className="text-[10px] text-[var(--muted)] leading-tight">
                    {ast.mission}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
