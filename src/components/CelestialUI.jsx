/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Full screen 3D simulation overlay and telemetry HUD for Earth and Moon with Apollo astronaut data
*/

import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  Disc,
  MapPin,
  Rocket,
  X,
  Compass,
  Clock,
  Weight,
  LayoutDashboard,
  Layers,
  ChevronRight,
  Radio,
  Github,
  ExternalLink,
} from 'lucide-react';
import {
  APOLLO_LANDING_SITES,
  LUNAR_LANDMARKS,
  ROBOTIC_LANDERS,
  LUNAR_MARIA,
  LUNAR_LOCATIONS_MAP,
} from '../data/lunarLandmarks.js';

export function CelestialUI({
  viewMode,
  setViewMode,
  isPaused,
  setIsPaused,
  showOrbits,
  setShowOrbits,
  showLandingSites = true,
  setShowLandingSites = () => {},
  onResetCamera,
  hasInteracted,
  selectedLandmarkId = null,
  setSelectedLandmarkId = () => {},
  onPlayClick = () => {},
  onReturnToDashboard = () => {},
  onOpenMars = () => {},
}) {
  const [showInfo, setShowInfo] = useState(true);
  const [showSitesDrawer, setShowSitesDrawer] = useState(false);
  const [activeTab, setActiveTab] = useState('apollo');

  const NAV_ITEMS = [
    { id: 'overview', label: 'System' },
    { id: 'earth', label: 'Earth' },
    { id: 'moon', label: 'Moon' },
    { id: 'mars', label: 'Mars' },
    { id: 'orbit', label: 'Orbits' },
  ];

  const DESCRIPTIONS = {
    overview: {
      tag: 'A VIEW FROM SPACE',
      title: 'Earth, Moon & Mars System',
      desc: 'Three terrestrial celestial bodies connected by gravity, orbital mechanics, and solar irradiance. Suspended together in the inner Solar System.',
      data: [
        { label: 'OBJECT', value: 'EARTH' },
        { label: 'SATELLITE', value: 'MOON' },
        { label: 'PLANET', value: 'MARS' },
        { label: 'SYSTEM', value: 'INNER SOLAR' },
      ],
    },
    earth: {
      tag: 'TERRESTRIAL SPHERE',
      title: 'Planet Earth',
      desc: 'A dynamic blue marble enveloped by a protective nitrogen-oxygen atmosphere, swirling cloud systems, and nocturnal city lights.',
      data: [
        { label: 'RADIUS', value: '6,371 KM' },
        { label: 'AXIAL TILT', value: '23.44°' },
        { label: 'DAY LENGTH', value: '23H 56M 04S' },
        { label: 'MASS', value: '5.972 × 10²⁴ KG' },
      ],
    },
    moon: {
      tag: 'NATURAL SATELLITE',
      title: 'The Moon',
      desc: 'Tidally locked in synchronous rotation, presenting ancient cratered highlands, dark volcanic maria, and human exploration sites.',
      data: [
        { label: 'RADIUS', value: '1,737.4 KM' },
        { label: 'GRAVITY', value: '0.166 G (1.62 M/S²)' },
        { label: 'INCLINATION', value: '5.145°' },
        { label: 'SYNODIC PERIOD', value: '29.53 DAYS' },
      ],
    },
    mars: {
      tag: 'RED PLANET // TERRESTRIAL ORBIT',
      title: 'Planet Mars',
      desc: 'The fourth planet from the Sun, bearing ancient volcanic shield calderas of Olympus Mons, the deep equatorial rift of Valles Marineris, and orbiting moons Phobos and Deimos.',
      data: [
        { label: 'RADIUS', value: '3,389.5 KM' },
        { label: 'AXIAL TILT', value: '25.19°' },
        { label: 'SOL DURATION', value: '24H 37M' },
        { label: 'ATMOSPHERE', value: '95.3% CO2' },
      ],
    },
    orbit: {
      tag: 'CELESTIAL DYNAMICS',
      title: 'Planetary Orbital Planes',
      desc: 'Earth, the Moon, and Mars revolve along distinct inclination planes around the Sun, displaying their proportional scales and orbits.',
      data: [
        { label: 'MOON DIST', value: '384,400 KM' },
        { label: 'MARS DIST', value: '1.524 AU' },
        { label: 'MOON INC', value: '5.14°' },
        { label: 'MARS INC', value: '1.85°' },
      ],
    },
  };

  const currentDesc = DESCRIPTIONS[viewMode] || DESCRIPTIONS.overview;
  const activeSite = selectedLandmarkId ? LUNAR_LOCATIONS_MAP.get(selectedLandmarkId) : null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 sm:p-6 select-none font-mono text-xs">
      <header className="flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-[var(--line)] bg-[var(--chip)] flex items-center justify-center relative shadow-sm">
            <div className="w-3.5 h-3.5 rounded-full bg-[var(--accent)]" />
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[var(--text)]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[var(--accent)] uppercase leading-none">
              Moon &amp; Earth Fullscreen 3D
            </span>
            <span className="text-[var(--muted)] uppercase mt-1 leading-none text-[10px]">
              Orbital Simulation &amp; Lunar Surface Data
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <nav
            aria-label="Celestial Views"
            className="flex items-center gap-1 p-1 rounded border border-[var(--line)] bg-[var(--chip)]/90 backdrop-blur-md"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = viewMode === item.id && !selectedLandmarkId;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedLandmarkId(null);
                    setViewMode(item.id);
                    onPlayClick();
                  }}
                  className={`px-2.5 py-1.5 rounded uppercase transition-all duration-200 cursor-pointer text-[11px] ${
                    isActive
                      ? 'bg-black text-[var(--accent)] border border-[var(--accent)] shadow-[0_0_10px_rgba(170,136,255,0.25)]'
                      : 'text-[var(--muted)] hover:text-[var(--text)] border border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <a
            href="https://github.com/ruthvikroy/mars-simulation-"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded border border-red-500/40 bg-red-950/60 text-red-300 hover:text-white hover:bg-red-900 transition-all flex items-center gap-1.5 cursor-pointer text-[11px] font-bold"
            title="Explore Mars Simulation Source Repository on GitHub"
          >
            <Github size={13} />
            <span className="hidden sm:inline">MARS REPO</span>
          </a>

          <button
            onClick={() => {
              setShowSitesDrawer(!showSitesDrawer);
              onPlayClick();
            }}
            className={`px-3 py-1.5 rounded border uppercase transition-all flex items-center gap-1.5 cursor-pointer text-[11px] ${
              showSitesDrawer || selectedLandmarkId
                ? 'bg-[var(--accent)] text-black font-semibold border-[var(--accent)] shadow-[0_0_10px_rgba(170,136,255,0.3)]'
                : 'bg-[var(--chip)]/90 text-[var(--accent)] border-[var(--line)] hover:border-[var(--accent)]'
            }`}
          >
            <Rocket size={13} />
            <span>Lunar Registry ({APOLLO_LANDING_SITES.length + ROBOTIC_LANDERS.length + LUNAR_LANDMARKS.length})</span>
          </button>

          <div className="px-2.5 py-1.5 rounded border border-[var(--accent)] bg-[var(--chip)]/90 text-[var(--accent)] font-mono text-[11px] font-bold flex items-center gap-1.5">
            <Eye size={13} />
            <span>3D VIEW</span>
          </div>

          <button
            onClick={() => {
              onPlayClick();
              onReturnToDashboard();
            }}
            className="px-3 py-1.5 rounded border border-[var(--line)] bg-[var(--chip)]/90 text-[var(--muted)] hover:text-white hover:border-zinc-400 transition-colors flex items-center gap-1.5 cursor-pointer uppercase text-[11px]"
            title="Return to Comparative Matrix Dashboard"
          >
            <LayoutDashboard size={13} />
            <span>Dashboard</span>
          </button>
        </div>
      </header>

      <div className="pointer-events-auto mt-2 flex flex-wrap items-center justify-center gap-1.5 z-20">
        <div className="px-3 py-1 rounded-full border border-[var(--line)] bg-black/80 backdrop-blur-md flex items-center gap-2 overflow-x-auto max-w-full">
          <span className="text-[10px] text-amber-400 font-semibold uppercase flex items-center gap-1 shrink-0">
            <Radio size={11} className="animate-pulse" />
            <span>Apollo Astronauts:</span>
          </span>
          {APOLLO_LANDING_SITES.map((site) => {
            const isSelected = selectedLandmarkId === site.id;
            const primaryWalkers = site.landedAstronauts
              ? site.landedAstronauts.map((a) => a.split(' ')[0]).join(' & ')
              : '';
            return (
              <button
                key={site.id}
                onClick={() => {
                  setSelectedLandmarkId(site.id);
                  setViewMode('moon');
                  onPlayClick();
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all uppercase whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-amber-400 text-black font-bold border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                    : 'bg-black/60 text-zinc-300 border-[var(--line)] hover:border-amber-400/60 hover:text-amber-200'
                }`}
                title={`${site.name} — ${site.landedAstronauts.join(' & ')}`}
              >
                {site.referenceImage && (
                  <img
                    src={site.referenceImage}
                    alt={site.mission}
                    className="w-4 h-4 rounded-full object-cover shrink-0 border border-amber-400/60"
                  />
                )}
                <span>{site.mission.replace('Apollo ', 'A')}</span>
                <span className="text-[9px] opacity-75">({primaryWalkers})</span>
              </button>
            );
          })}
        </div>
      </div>

      {activeSite && (
        <aside
          aria-label="Lunar Site Telemetry"
          className="fixed top-24 right-4 sm:right-6 pointer-events-auto w-88 max-w-[calc(100vw-2rem)] rounded-lg border border-[var(--line)] bg-[#080d14]/95 backdrop-blur-lg shadow-2xl p-4 text-[var(--text)] z-40 transition-all animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col gap-3 max-h-[80vh] overflow-y-auto"
        >
          <div className="flex items-start justify-between gap-2 border-b border-[var(--line)] pb-2">
            <div>
              <div className="text-[10px] text-[var(--accent)] uppercase font-semibold flex items-center gap-1">
                <Compass size={11} />
                <span>{activeSite.categoryLabel}</span>
              </div>
              <h3 className="text-sm font-bold uppercase text-[var(--text)] mt-0.5">
                {activeSite.name}
              </h3>
              <div className="text-[10px] text-[var(--muted)] uppercase font-mono mt-0.5">
                {activeSite.coordinatesFormatted} {activeSite.region ? `// ${activeSite.region}` : ''}
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedLandmarkId(null);
                onPlayClick();
              }}
              title="Close landmark view"
              className="p-1 rounded text-[var(--muted)] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          {activeSite.referenceImage && (
            <div className="relative rounded overflow-hidden aspect-[16/10] bg-black border border-[var(--line)]">
              <img
                src={activeSite.referenceImage}
                alt={activeSite.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              {activeSite.referenceCredit && (
                <span className="absolute bottom-1 left-2 text-[9px] text-zinc-300 font-mono">
                  {activeSite.referenceCredit}
                </span>
              )}
            </div>
          )}

          {activeSite.landedAstronauts && (
            <div className="space-y-1">
              <div className="text-[10px] text-amber-400 uppercase font-semibold flex items-center gap-1">
                <Rocket size={11} />
                <span>Astronauts Landed on Lunar Surface:</span>
              </div>
              <div className="space-y-0.5">
                {activeSite.landedAstronauts.map((astro) => (
                  <div
                    key={astro}
                    className="px-2 py-1 rounded bg-black/70 border border-amber-500/30 text-amber-200 text-[11px] font-mono flex items-center justify-between"
                  >
                    <span>{astro}</span>
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded">MOONWALKER</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSite.astronauts && (
            <div className="text-[10px] text-zinc-400 font-mono">
              <span className="text-[var(--muted)]">CREW:</span> {activeSite.astronauts.join(' • ')}
            </div>
          )}

          {activeSite.lunarModule && (
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-black/40 p-2 rounded border border-[var(--line)]">
              <div>
                <span className="text-[var(--muted)] block">LUNAR MODULE:</span>
                <span className="text-white font-semibold">{activeSite.lunarModule}</span>
              </div>
              <div>
                <span className="text-[var(--muted)] block">COMMAND MODULE:</span>
                <span className="text-white font-semibold">{activeSite.commandModule}</span>
              </div>
            </div>
          )}

          {activeSite.evaDuration && (
            <div className="grid grid-cols-2 gap-2 border-t border-b border-[var(--line)] py-2 text-center text-[11px] font-mono">
              <div>
                <span className="text-[9px] text-[var(--muted)] uppercase flex items-center justify-center gap-1">
                  <Clock size={10} /> EVA DURATION
                </span>
                <span className="font-semibold text-white">{activeSite.evaDuration}</span>
              </div>
              <div>
                <span className="text-[9px] text-[var(--muted)] uppercase flex items-center justify-center gap-1">
                  <Weight size={10} /> SAMPLES RETURNED
                </span>
                <span className="font-semibold text-[var(--accent)]">{activeSite.samplesReturnedKg} kg</span>
              </div>
            </div>
          )}

          <p className="text-[11px] text-[var(--muted)] leading-relaxed">
            {activeSite.description}
          </p>

          {activeSite.quote && (
            <div className="text-[10px] italic text-amber-200 border-l-2 border-amber-400 pl-2.5 py-1 bg-amber-500/5 rounded-r">
              {activeSite.quote}
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => {
                setSelectedLandmarkId(null);
                setViewMode('moon');
                onPlayClick();
              }}
              className="flex-1 py-1.5 rounded border border-[var(--line)] bg-[var(--chip)] text-center text-[10px] uppercase text-[var(--muted)] hover:text-white hover:bg-black transition-colors cursor-pointer"
            >
              Orbit Moon
            </button>
            <button
              onClick={() => {
                setSelectedLandmarkId(null);
                onResetCamera();
              }}
              className="flex-1 py-1.5 rounded border border-[var(--line)] bg-[var(--chip)] text-center text-[10px] uppercase text-[var(--muted)] hover:text-white hover:bg-black transition-colors cursor-pointer"
            >
              Reset View
            </button>
          </div>
        </aside>
      )}

      {showSitesDrawer && (
        <aside
          aria-label="Lunar Landmarks Registry Drawer"
          className="fixed top-24 left-4 sm:left-6 pointer-events-auto w-92 max-w-[calc(100vw-2rem)] rounded-lg border border-[var(--line)] bg-[#080d14]/95 backdrop-blur-lg shadow-2xl p-3.5 z-40 transition-all flex flex-col gap-2.5 max-h-[75vh] overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
            <span className="text-[11px] font-bold text-[var(--accent)] uppercase flex items-center gap-1.5">
              <Rocket size={13} />
              <span>Lunar Coordinates Registry</span>
            </span>
            <button
              onClick={() => setShowSitesDrawer(false)}
              className="p-1 rounded text-[var(--muted)] hover:text-white"
            >
              <X size={14} />
            </button>
          </div>

          <div className="flex items-center gap-1 border-b border-[var(--line)]/70 pb-1.5 text-[10px]">
            <button
              onClick={() => setActiveTab('apollo')}
              className={`px-2 py-1 rounded transition-colors uppercase ${
                activeTab === 'apollo'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                  : 'text-[var(--muted)] hover:text-white'
              }`}
            >
              Apollo (6)
            </button>
            <button
              onClick={() => setActiveTab('robotic')}
              className={`px-2 py-1 rounded transition-colors uppercase ${
                activeTab === 'robotic'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                  : 'text-[var(--muted)] hover:text-white'
              }`}
            >
              Robotic (5)
            </button>
            <button
              onClick={() => setActiveTab('craters')}
              className={`px-2 py-1 rounded transition-colors uppercase ${
                activeTab === 'craters'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-[var(--muted)] hover:text-white'
              }`}
            >
              Craters (8)
            </button>
            <button
              onClick={() => setActiveTab('maria')}
              className={`px-2 py-1 rounded transition-colors uppercase ${
                activeTab === 'maria'
                  ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/40'
                  : 'text-[var(--muted)] hover:text-white'
              }`}
            >
              Maria (4)
            </button>
          </div>

          <div className="overflow-y-auto space-y-1.5 pr-1 max-h-[55vh]">
            {activeTab === 'apollo' && (
              <div className="space-y-1.5">
                {APOLLO_LANDING_SITES.map((site) => {
                  const isSelected = selectedLandmarkId === site.id;
                  return (
                    <button
                      key={site.id}
                      onClick={() => {
                        setSelectedLandmarkId(site.id);
                        setViewMode('moon');
                        onPlayClick();
                      }}
                      className={`w-full p-2 rounded text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                          : 'bg-black/60 border-[var(--line)] text-zinc-300 hover:border-amber-400/50'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {site.referenceImage && (
                          <img
                            src={site.referenceImage}
                            alt={site.name}
                            className="w-11 h-11 rounded object-cover border border-amber-400/50 shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[11px] text-amber-300 truncate">{site.name}</span>
                            <span className="text-[9px] font-mono text-[var(--muted)] shrink-0 ml-1">{site.date}</span>
                          </div>
                          <div className="text-[10px] text-zinc-300 mt-0.5 truncate">
                            {site.landedAstronauts.join(' & ')}
                          </div>
                          <div className="text-[9px] text-[var(--muted)] font-mono mt-0.5 flex justify-between">
                            <span>{site.coordinatesFormatted}</span>
                            <span>{site.samplesReturnedKg} kg</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {activeTab === 'robotic' && (
              <div className="space-y-1.5">
                {ROBOTIC_LANDERS.map((lander) => {
                  const isSelected = selectedLandmarkId === lander.id;
                  return (
                    <button
                      key={lander.id}
                      onClick={() => {
                        setSelectedLandmarkId(lander.id);
                        setViewMode('moon');
                        onPlayClick();
                      }}
                      className={`w-full p-2 rounded text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                          : 'bg-black/60 border-[var(--line)] text-zinc-300 hover:border-emerald-400/50'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {lander.referenceImage && (
                          <img
                            src={lander.referenceImage}
                            alt={lander.name}
                            className="w-11 h-11 rounded object-cover border border-emerald-400/50 shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[11px] text-emerald-300 truncate">{lander.name}</span>
                            <span className="text-[9px] font-mono text-[var(--muted)] shrink-0 ml-1">{lander.date}</span>
                          </div>
                          <div className="text-[10px] text-zinc-300 mt-0.5 line-clamp-1">{lander.description}</div>
                          <div className="text-[9px] text-[var(--muted)] font-mono mt-0.5">
                            {lander.coordinatesFormatted}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {activeTab === 'craters' && (
              <div className="space-y-1.5">
                {LUNAR_LANDMARKS.map((lm) => {
                  const isSelected = selectedLandmarkId === lm.id;
                  return (
                    <button
                      key={lm.id}
                      onClick={() => {
                        setSelectedLandmarkId(lm.id);
                        setViewMode('moon');
                        onPlayClick();
                      }}
                      className={`w-full p-2 rounded text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                          : 'bg-black/60 border-[var(--line)] text-zinc-300 hover:border-cyan-400/50'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {lm.referenceImage && (
                          <img
                            src={lm.referenceImage}
                            alt={lm.name}
                            className="w-11 h-11 rounded object-cover border border-cyan-400/50 shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[11px] text-cyan-300 truncate">{lm.name}</span>
                            <span className="text-[9px] text-[var(--muted)] shrink-0 ml-1">{lm.categoryLabel}</span>
                          </div>
                          <div className="text-[10px] text-zinc-300 mt-0.5 line-clamp-1">{lm.description}</div>
                          <div className="text-[9px] text-[var(--muted)] font-mono mt-0.5">
                            {lm.coordinatesFormatted}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {activeTab === 'maria' && (
              <div className="space-y-1.5">
                {LUNAR_MARIA.map((maria) => {
                  const isSelected = selectedLandmarkId === maria.id;
                  return (
                    <button
                      key={maria.id}
                      onClick={() => {
                        setSelectedLandmarkId(maria.id);
                        setViewMode('moon');
                        onPlayClick();
                      }}
                      className={`w-full p-2 rounded text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-500/20 border-indigo-400 text-indigo-200'
                          : 'bg-black/60 border-[var(--line)] text-zinc-300 hover:border-indigo-400/50'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {maria.referenceImage && (
                          <img
                            src={maria.referenceImage}
                            alt={maria.name}
                            className="w-11 h-11 rounded object-cover border border-indigo-400/50 shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[11px] text-indigo-300 truncate">{maria.name}</span>
                            <span className="text-[9px] text-[var(--muted)] shrink-0 ml-1">{maria.categoryLabel}</span>
                          </div>
                          <div className="text-[10px] text-zinc-300 mt-0.5 line-clamp-1">{maria.description}</div>
                          <div className="text-[9px] text-[var(--muted)] font-mono mt-0.5">
                            {maria.coordinatesFormatted}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>
      )}

      <div className="flex-1 flex items-end justify-between gap-6 pointer-events-none pb-2">
        {showInfo && !selectedLandmarkId && (
          <aside className="pointer-events-auto max-w-[380px] p-4 sm:p-5 rounded border border-[var(--line)] bg-[var(--chip)]/90 backdrop-blur-md shadow-2xl transition-all duration-300">
            <span className="text-[var(--accent)] uppercase block mb-1.5 text-[10px] font-bold">
              {currentDesc.tag}
            </span>
            <h1 className="font-bold text-[var(--accent)] text-sm leading-tight mb-2">
              {currentDesc.title}
            </h1>
            <p className="text-[var(--muted)] leading-relaxed mb-4 text-xs">
              {currentDesc.desc}
            </p>

            <div className="border-t border-[var(--line)] pt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              {currentDesc.data.map((item) => (
                <div key={item.label} className="flex flex-col">
                  <span className="text-[var(--muted)] uppercase text-[10px]">
                    {item.label}
                  </span>
                  <span className="text-[var(--text)] font-medium mt-0.5 font-mono">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {viewMode === 'mars' && (
              <div className="border-t border-[var(--line)] pt-3 mt-3">
                <a
                  href="https://github.com/ruthvikroy/mars-simulation-"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded border border-red-500/50 bg-red-950/70 hover:bg-red-900 text-red-200 text-xs font-bold transition-all shadow-[0_0_12px_rgba(239,68,68,0.25)]"
                >
                  <Github size={13} />
                  <span>MARS SIMULATION REPOSITORY</span>
                  <ExternalLink size={11} className="opacity-70" />
                </a>
              </div>
            )}
          </aside>
        )}

        <div
          className={`flex-1 text-center transition-opacity duration-700 pointer-events-none ${
            hasInteracted ? 'opacity-0' : 'opacity-80'
          }`}
        >
          <span className="inline-block px-3 py-1.5 rounded border border-[var(--line)] bg-[var(--chip)] backdrop-blur-sm text-[var(--muted)] uppercase text-[11px]">
            Drag to rotate • Move cursor for fluid interaction
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5 p-1.5 rounded border border-[var(--line)] bg-[var(--chip)]/90 backdrop-blur-md">
          <button
            onClick={() => {
              setIsPaused(!isPaused);
              onPlayClick();
            }}
            title={isPaused ? 'Resume Motion' : 'Pause Motion'}
            aria-label={isPaused ? 'Resume Motion' : 'Pause Motion'}
            className="p-2 rounded text-[var(--muted)] hover:text-[var(--text)] hover:bg-black transition-colors cursor-pointer"
          >
            {isPaused ? <Play size={15} /> : <Pause size={15} />}
          </button>

          <button
            onClick={() => {
              onResetCamera();
              onPlayClick();
            }}
            title="Reset Camera View"
            aria-label="Reset Camera View"
            className="p-2 rounded text-[var(--muted)] hover:text-[var(--text)] hover:bg-black transition-colors cursor-pointer"
          >
            <RotateCcw size={15} />
          </button>

          <button
            onClick={() => {
              setShowOrbits(!showOrbits);
              onPlayClick();
            }}
            title={showOrbits ? 'Hide Orbit Path' : 'Show Orbit Path'}
            aria-label={showOrbits ? 'Hide Orbit Path' : 'Show Orbit Path'}
            className={`p-2 rounded transition-colors cursor-pointer ${
              showOrbits
                ? 'text-[var(--accent)] bg-black border border-[var(--accent)]'
                : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-black'
            }`}
          >
            <Disc size={15} />
          </button>

          <button
            onClick={() => {
              setShowLandingSites(!showLandingSites);
              onPlayClick();
            }}
            title={showLandingSites ? 'Hide Lunar Beacons' : 'Show Lunar Beacons'}
            aria-label={showLandingSites ? 'Hide Lunar Beacons' : 'Show Lunar Beacons'}
            className={`p-2 rounded transition-colors cursor-pointer ${
              showLandingSites
                ? 'text-amber-400 bg-black border border-amber-400'
                : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-black'
            }`}
          >
            <MapPin size={15} />
          </button>

          <button
            onClick={() => {
              setShowInfo(!showInfo);
              onPlayClick();
            }}
            title={showInfo ? 'Hide Information Panel' : 'Show Information Panel'}
            aria-label={showInfo ? 'Hide Information Panel' : 'Show Information Panel'}
            className={`p-2 rounded transition-colors cursor-pointer ${
              showInfo
                ? 'text-[var(--accent)] bg-black border border-[var(--accent)]'
                : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-black'
            }`}
          >
            {showInfo ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
}

/* --- End of CelestialUI.jsx --- */
