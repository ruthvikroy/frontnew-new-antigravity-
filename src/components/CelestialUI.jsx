/*
Description: Full screen 3D simulation overlay and telemetry HUD for Earth, Moon, and Mars
with Apollo astronaut data, Perseverance/Curiosity rover sites, and 3D texture mode controls.
*/

import React, { useState } from 'react';
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
  Wind,
  Sliders,
} from 'lucide-react';
import {
  APOLLO_LANDING_SITES,
  LUNAR_LANDMARKS,
  ROBOTIC_LANDERS,
  LUNAR_MARIA,
  LUNAR_LOCATIONS_MAP,
} from '../data/lunarLandmarks.js';
import {
  MARS_LANDMARKS,
  MARS_LOCATIONS_MAP,
  MARS_3D_TEXTURE_MODES,
} from '../data/marsLandmarks.js';

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
  flightTelemetry = null,
  marsTextureMode = 'global-mola',
  setMarsTextureMode = () => {},
  marsCloudOpacity = 0.65,
  setMarsCloudOpacity = () => {},
  marsCloudDriftSpeed = 1.0,
  setMarsCloudDriftSpeed = () => {},
  marsDustIntensity = 0.42,
  setMarsDustIntensity = () => {},
}) {
  const [showInfo, setShowInfo] = useState(true);
  const [showSitesDrawer, setShowSitesDrawer] = useState(false);
  const [showAtmoControls, setShowAtmoControls] = useState(false);
  const [activeTab, setActiveTab] = useState(viewMode === 'mars' ? 'mars' : 'apollo');

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
      desc: 'Tidally locked in synchronous rotation, presenting ancient cratered highlands, dark volcanic maria, dynamic solar illumination, and Apollo exploration sites.',
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
      desc: 'Fourth planet from the Sun with 25.19° axial obliquity, thin CO2 atmosphere with drifting water-ice clouds, Olympus Mons caldera, Valles Marineris rift, and rover exploration sites.',
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
  const activeSite = selectedLandmarkId
    ? LUNAR_LOCATIONS_MAP.get(selectedLandmarkId) || MARS_LOCATIONS_MAP.get(selectedLandmarkId)
    : null;

  const isMarsView = viewMode === 'mars' || Boolean(activeSite?.areographic);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 sm:p-6 select-none font-mono text-xs">
      {/* Top Header Bar */}
      <header className="flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-[var(--line)] bg-[var(--chip)] flex items-center justify-center relative shadow-sm">
            <div className="w-3.5 h-3.5 rounded-full bg-[var(--accent)]" />
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[var(--accent)] uppercase leading-none">
              3D CELESTIAL ENGINE
            </span>
            <span className="text-[var(--muted)] uppercase mt-1 leading-none text-[10px]">
              EARTH, MOON &amp; MARS SIMULATION
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Celestial Body Navigation */}
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

          {/* Mars 3D Texture Modes Selector (Active when viewing Mars) */}
          {isMarsView && (
            <div className="flex items-center gap-1 p-1 rounded border border-amber-500/40 bg-black/80 backdrop-blur-md">
              <span className="text-[10px] text-amber-400 font-bold px-1.5 hidden sm:inline">
                3D TEXTURE:
              </span>
              {MARS_3D_TEXTURE_MODES.map((mode) => {
                const isActive = marsTextureMode === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setMarsTextureMode(mode.id);
                      onPlayClick();
                    }}
                    title={mode.description}
                    className={`px-2 py-1 rounded text-[10px] font-mono uppercase transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-400 text-black font-bold border border-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                        : 'text-zinc-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {mode.shortLabel.replace(' 3D', '')}
                  </button>
                );
              })}
            </div>
          )}

          {/* Mars Atmospheric Controls Toggle */}
          {isMarsView && (
            <button
              onClick={() => {
                setShowAtmoControls(!showAtmoControls);
                onPlayClick();
              }}
              title="Martian Atmosphere & Cloud Controls"
              className={`px-2.5 py-1.5 rounded border uppercase transition-all flex items-center gap-1.5 cursor-pointer text-[11px] ${
                showAtmoControls
                  ? 'bg-cyan-500 text-black font-semibold border-cyan-400'
                  : 'bg-[var(--chip)]/90 text-cyan-300 border-[var(--line)] hover:border-cyan-400'
              }`}
            >
              <Wind size={13} />
              <span className="hidden sm:inline">Atmosphere</span>
            </button>
          )}

          {/* Planetary Exploration Registry Drawer Button */}
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
            <span>
              {isMarsView ? 'Mars Sites (6)' : `Lunar Sites (${APOLLO_LANDING_SITES.length + ROBOTIC_LANDERS.length})`}
            </span>
          </button>

          {/* Dashboard Return Button */}
          <button
            onClick={() => {
              onPlayClick();
              onReturnToDashboard();
            }}
            className="px-3 py-1.5 rounded border border-[var(--line)] bg-[var(--chip)]/90 text-[var(--muted)] hover:text-white hover:border-zinc-400 transition-colors flex items-center gap-1.5 cursor-pointer uppercase text-[11px]"
            title="Return to Editorial Dashboard"
          >
            <LayoutDashboard size={13} />
            <span>Dashboard</span>
          </button>
        </div>
      </header>

      {/* Atmospheric Cloud Controls Modal / Popover */}
      {showAtmoControls && isMarsView && (
        <div className="fixed top-20 right-4 sm:right-6 pointer-events-auto z-40 bg-black/90 backdrop-blur-md p-3.5 rounded-lg border border-cyan-500/40 text-[11px] font-mono shadow-2xl w-72">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
            <span className="text-cyan-300 font-bold uppercase flex items-center gap-1.5">
              <Wind size={12} />
              <span>Martian Clouds &amp; Haze</span>
            </span>
            <button
              onClick={() => setShowAtmoControls(false)}
              className="text-zinc-400 hover:text-white"
            >
              <X size={13} />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-zinc-400 text-[10px] mb-1">
                <span>CLOUD DRIFT SPEED</span>
                <span className="text-white font-bold">{marsCloudDriftSpeed}x</span>
              </div>
              <div className="flex gap-1.5">
                {[0.5, 1.0, 2.0].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setMarsCloudDriftSpeed(spd)}
                    className={`flex-1 py-1 rounded text-[10px] ${
                      marsCloudDriftSpeed === spd
                        ? 'bg-cyan-400 text-black font-bold'
                        : 'bg-white/5 text-zinc-300 hover:bg-white/10'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex justify-between text-zinc-400 text-[10px] mb-1">
                <span>CIRRUS CLOUD OPACITY</span>
                <span className="text-white font-bold">{Math.round(marsCloudOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={marsCloudOpacity}
                onChange={(e) => setMarsCloudOpacity(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
            <div>
              <div className="flex justify-between text-zinc-400 text-[10px] mb-1">
                <span>DUST HAZE INTENSITY</span>
                <span className="text-white font-bold">{Math.round(marsDustIntensity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.9"
                step="0.05"
                value={marsDustIntensity}
                onChange={(e) => setMarsDustIntensity(parseFloat(e.target.value))}
                className="w-full accent-amber-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* Top Quick-Select Pills Bar */}
      <div className="pointer-events-auto mt-2 flex flex-wrap items-center justify-center gap-1.5 z-20">
        <div className="px-3 py-1 rounded-full border border-[var(--line)] bg-black/85 backdrop-blur-md flex items-center gap-2 overflow-x-auto max-w-full">
          {isMarsView ? (
            <>
              <span className="text-[10px] text-[#ef4444] font-semibold uppercase flex items-center gap-1 shrink-0">
                <Radio size={11} className="animate-pulse" />
                <span>Mars Recon Sites:</span>
              </span>
              {MARS_LANDMARKS.map((site) => {
                const isSelected = selectedLandmarkId === site.id;
                return (
                  <button
                    key={site.id}
                    onClick={() => {
                      setSelectedLandmarkId(site.id);
                      setViewMode('mars');
                      onPlayClick();
                    }}
                    className={`px-2.5 py-0.5 rounded text-[10px] font-mono transition-all uppercase whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-[#ef4444] text-white font-bold border-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                        : 'bg-black/60 text-zinc-300 border-[var(--line)] hover:border-red-400/60 hover:text-red-200'
                    }`}
                    title={`${site.name} — ${site.coords}`}
                  >
                    {site.referenceImage && (
                      <img
                        src={site.referenceImage}
                        alt={site.name}
                        className="w-4 h-4 rounded-full object-cover shrink-0 border border-red-400/60"
                      />
                    )}
                    <span>{site.shortName}</span>
                    <span className="text-[9px] opacity-75">[{site.badge}]</span>
                  </button>
                );
              })}
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>

      {/* Selected Landmark / Exploration Telemetry Modal (Moon or Mars) */}
      {activeSite && (
        <aside
          aria-label="Exploration Site Telemetry"
          className="fixed top-24 right-4 sm:right-6 pointer-events-auto w-88 max-w-[calc(100vw-2rem)] rounded-lg border border-[var(--line)] bg-[#080d14]/95 backdrop-blur-lg shadow-2xl p-4 text-[var(--text)] z-40 transition-all animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col gap-3 max-h-[80vh] overflow-y-auto"
        >
          <div className="flex items-start justify-between gap-2 border-b border-[var(--line)] pb-2">
            <div>
              <div className="text-[10px] text-[var(--accent)] uppercase font-semibold flex items-center gap-1">
                <Compass size={11} />
                <span>{activeSite.categoryLabel || activeSite.category}</span>
              </div>
              <h3 className="text-sm font-bold uppercase text-[var(--text)] mt-0.5">
                {activeSite.name}
              </h3>
              <div className="text-[10px] text-[var(--muted)] uppercase font-mono mt-0.5">
                {activeSite.coords || activeSite.coordinatesFormatted}
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

          {/* Mars-specific specs grid */}
          {activeSite.specs && (
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-black/60 p-2.5 rounded border border-white/10">
              {Object.entries(activeSite.specs).map(([label, val]) => (
                <div key={label}>
                  <span className="text-zinc-400 block text-[9px] uppercase">{label}:</span>
                  <span className="text-white font-semibold">{val}</span>
                </div>
              ))}
            </div>
          )}

          {/* Apollo-specific moonwalkers */}
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

          {activeSite.elevationKm && (
            <div className="text-[10px] text-zinc-300 font-mono bg-black/40 p-1.5 rounded border border-white/5">
              <span className="text-zinc-500 uppercase">ELEVATION:</span> {activeSite.elevationKm}
            </div>
          )}

          <p className="text-[11px] text-[var(--muted)] leading-relaxed">
            {activeSite.description}
          </p>

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => {
                setSelectedLandmarkId(null);
                setViewMode(activeSite.areographic ? 'mars' : 'moon');
                onPlayClick();
              }}
              className="flex-1 py-1.5 rounded border border-[var(--line)] bg-[var(--chip)] text-center text-[10px] uppercase text-[var(--muted)] hover:text-white hover:bg-black transition-colors cursor-pointer"
            >
              Orbit {activeSite.areographic ? 'Mars' : 'Moon'}
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

      {/* Exploration Coordinates Registry Drawer (Moon & Mars) */}
      {showSitesDrawer && (
        <aside
          aria-label="Exploration Coordinates Registry Drawer"
          className="fixed top-24 left-4 sm:left-6 pointer-events-auto w-96 max-w-[calc(100vw-2rem)] rounded-lg border border-[var(--line)] bg-[#080d14]/95 backdrop-blur-lg shadow-2xl p-3.5 z-40 transition-all flex flex-col gap-2.5 max-h-[75vh] overflow-hidden"
        >
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-2">
            <span className="text-[11px] font-bold text-[var(--accent)] uppercase flex items-center gap-1.5">
              <Rocket size={13} />
              <span>Celestial Exploration Registry</span>
            </span>
            <button
              onClick={() => setShowSitesDrawer(false)}
              className="p-1 rounded text-[var(--muted)] hover:text-white"
            >
              <X size={14} />
            </button>
          </div>

          <div className="flex items-center gap-1 border-b border-[var(--line)]/70 pb-1.5 text-[10px] overflow-x-auto">
            <button
              onClick={() => setActiveTab('mars')}
              className={`px-2 py-1 rounded transition-colors uppercase whitespace-nowrap ${
                activeTab === 'mars'
                  ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/40'
                  : 'text-[var(--muted)] hover:text-white'
              }`}
            >
              Mars (6)
            </button>
            <button
              onClick={() => setActiveTab('apollo')}
              className={`px-2 py-1 rounded transition-colors uppercase whitespace-nowrap ${
                activeTab === 'apollo'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                  : 'text-[var(--muted)] hover:text-white'
              }`}
            >
              Apollo (6)
            </button>
            <button
              onClick={() => setActiveTab('robotic')}
              className={`px-2 py-1 rounded transition-colors uppercase whitespace-nowrap ${
                activeTab === 'robotic'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                  : 'text-[var(--muted)] hover:text-white'
              }`}
            >
              Robotic (5)
            </button>
            <button
              onClick={() => setActiveTab('craters')}
              className={`px-2 py-1 rounded transition-colors uppercase whitespace-nowrap ${
                activeTab === 'craters'
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                  : 'text-[var(--muted)] hover:text-white'
              }`}
            >
              Craters (8)
            </button>
          </div>

          <div className="overflow-y-auto space-y-1.5 pr-1 max-h-[55vh]">
            {activeTab === 'mars' && (
              <div className="space-y-1.5">
                {MARS_LANDMARKS.map((site) => {
                  const isSelected = selectedLandmarkId === site.id;
                  return (
                    <button
                      key={site.id}
                      onClick={() => {
                        setSelectedLandmarkId(site.id);
                        setViewMode('mars');
                        onPlayClick();
                      }}
                      className={`w-full p-2 rounded text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-red-500/20 border-red-400 text-red-200'
                          : 'bg-black/60 border-[var(--line)] text-zinc-300 hover:border-red-400/50'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {site.referenceImage && (
                          <img
                            src={site.referenceImage}
                            alt={site.name}
                            className="w-11 h-11 rounded object-cover border border-red-400/50 shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[11px] text-red-300 truncate">
                              {site.name}
                            </span>
                            <span className="text-[9px] font-mono text-[var(--muted)] shrink-0 ml-1">
                              [{site.badge}]
                            </span>
                          </div>
                          <div className="text-[10px] text-zinc-300 mt-0.5 truncate">
                            {site.category}
                          </div>
                          <div className="text-[9px] text-[var(--muted)] font-mono mt-0.5 flex justify-between">
                            <span>{site.coords}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

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
                            <span className="font-bold text-[11px] text-amber-300 truncate">
                              {site.name}
                            </span>
                            <span className="text-[9px] font-mono text-[var(--muted)] shrink-0 ml-1">
                              {site.date}
                            </span>
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
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[11px] text-emerald-300 truncate">
                              {lander.name}
                            </span>
                            <span className="text-[9px] font-mono text-[var(--muted)] shrink-0 ml-1">
                              {lander.agency}
                            </span>
                          </div>
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
                {LUNAR_LANDMARKS.map((crater) => {
                  const isSelected = selectedLandmarkId === crater.id;
                  return (
                    <button
                      key={crater.id}
                      onClick={() => {
                        setSelectedLandmarkId(crater.id);
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
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[11px] text-cyan-300 truncate">
                              {crater.name}
                            </span>
                            <span className="text-[9px] font-mono text-[var(--muted)] shrink-0 ml-1">
                              {crater.diameterKm} km
                            </span>
                          </div>
                          <div className="text-[9px] text-[var(--muted)] font-mono mt-0.5">
                            {crater.coordinatesFormatted}
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

      {/* Bottom Side Card & Controls */}
      <div className="flex-1 flex items-end justify-between gap-6 pointer-events-none pb-2">
        {showInfo && !selectedLandmarkId && (
          <aside className="pointer-events-auto max-w-[420px] p-4 sm:p-5 rounded-lg border border-[var(--line)] bg-black/85 backdrop-blur-md shadow-2xl transition-all duration-300">
            <span className="text-[var(--accent)] uppercase block mb-1 text-[10px] font-bold tracking-wider">
              {currentDesc.tag}
            </span>
            <h1 className="font-bold text-[var(--accent)] text-base leading-tight mb-2">
              {currentDesc.title}
            </h1>
            <p className="text-zinc-300 leading-relaxed mb-3 text-xs">
              {currentDesc.desc}
            </p>

            {/* 3D Celestial Engine Side Quote */}
            <div className="my-3 pl-3 border-l-2 border-[#F5D000] bg-white/[0.04] py-2 pr-2.5 rounded-r">
              <p className="text-[11px] italic text-[#e4e4e7] leading-relaxed">
                "Three terrestrial celestial bodies suspended together in the cosmic void — Earth, Moon, and Mars bound by orbital mechanics, gravitational equilibrium, and solar irradiance."
              </p>
              <span className="block mt-1 text-[9px] uppercase tracking-wider text-[#F5D000] font-mono font-bold">
                — 3D CELESTIAL ENGINE
              </span>
            </div>

            {/* Celestial Body Metrics */}
            <div className="border-t border-[var(--line)] pt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              {currentDesc.data.map((item) => (
                <div key={item.label} className="flex flex-col">
                  <span className="text-zinc-400 uppercase text-[10px] font-semibold">
                    {item.label}
                  </span>
                  <span className="text-white font-medium mt-0.5 font-mono text-[11px]">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Live Flight Telemetry (Side Panel) */}
            {flightTelemetry && (
              <div className="mt-3 pt-3 border-t border-[var(--line)]">
                <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                  <span className="text-zinc-400 uppercase tracking-wider font-semibold">
                    FLIGHT TELEMETRY
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        flightTelemetry.isWarping
                          ? 'bg-cyan-400 animate-ping shadow-[0_0_6px_#22d3ee]'
                          : flightTelemetry.thrustActive
                          ? 'bg-amber-400 animate-pulse shadow-[0_0_6px_#f59e0b]'
                          : flightTelemetry.isBraking
                          ? 'bg-red-400 shadow-[0_0_6px_#ef4444]'
                          : 'bg-emerald-400'
                      }`}
                    />
                    <span className="font-bold text-[#F5D000] text-[10px] uppercase">
                      {flightTelemetry.thrustMode}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono bg-black/60 p-2.5 rounded border border-white/10">
                  <div>
                    <span className="text-zinc-400 block text-[9px] uppercase tracking-wider">Velocity</span>
                    <span className="text-white font-bold text-[12px]">
                      {flightTelemetry.speedKms}{' '}
                      <span className="text-[#F5D000] text-[9px]">KM/S</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[9px] uppercase tracking-wider">Target Lock</span>
                    <span className="text-white font-bold text-[12px]">
                      {flightTelemetry.targetBody}{' '}
                      <span className="text-zinc-300 text-[9px] font-normal">
                        ({flightTelemetry.targetDistance})
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </aside>
        )}

        {/* User Interaction hint */}
        <div
          className={`flex-1 text-center transition-opacity duration-700 pointer-events-none ${
            hasInteracted ? 'opacity-0' : 'opacity-80'
          }`}
        >
          <span className="inline-block px-3 py-1.5 rounded border border-[var(--line)] bg-[var(--chip)] backdrop-blur-sm text-[var(--muted)] uppercase text-[11px]">
            Drag to rotate • Fly with WASD/Q/E • Click landmarks to inspect
          </span>
        </div>

        {/* Orbit & Simulation Playback Controls */}
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
            title={showLandingSites ? 'Hide Beacons & Markers' : 'Show Beacons & Markers'}
            aria-label={showLandingSites ? 'Hide Beacons & Markers' : 'Show Beacons & Markers'}
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

      {/* Game Dynamics Flight Controls Bar - Clean Bottom Center */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 pointer-events-none z-20 select-none max-w-[95vw]">
        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 bg-black/85 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-lg border border-white/15 text-[10px] font-mono text-zinc-300 shadow-2xl">
          <span className="text-[#F5D000] font-bold tracking-wider mr-1">FLIGHT:</span>
          <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white font-bold">W/S</span>
          <span className="text-zinc-300">THRUST</span>
          <span className="text-white/25">•</span>
          <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white font-bold">A/D</span>
          <span className="text-zinc-300">STRAFE</span>
          <span className="text-white/25">•</span>
          <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white font-bold">Q/E</span>
          <span className="text-zinc-300">ELEVATION</span>
          <span className="text-white/25">•</span>
          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/50 text-amber-300 font-bold">SHIFT</span>
          <span className="text-amber-200">WARP</span>
          <span className="text-white/25">•</span>
          <span className="px-1.5 py-0.5 rounded bg-red-500/20 border border-red-500/50 text-red-300 font-bold">SPACE</span>
          <span className="text-red-200">BRAKE</span>
          <span className="text-white/25">•</span>
          <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 text-white font-bold">R</span>
          <span className="text-zinc-300">RESET</span>
        </div>
      </div>
    </div>
  );
}
