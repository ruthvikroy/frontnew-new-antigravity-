import React, { useState, useMemo } from 'react';
import {
  Play,
  Pause,
  Sun,
  Compass,
  Satellite,
  Eye,
  EyeOff,
  RotateCcw,
  Volume2,
  VolumeX,
  FolderOpen,
  X,
  Crosshair,
  Mountain,
  Sliders,
  Video,
  Wind,
  Cloud,
  Layers
} from 'lucide-react';
import { MARS_LANDMARKS, MARS_3D_TEXTURE_MODES } from './orbitalMath';
import { generatePerseveranceTexturePreviews } from './proceduralMars';

export default function MinimalHUD({
  onReturnToDashboard,
  onSwitchToResearch,
  isPaused,
  setIsPaused,
  timeSpeed,
  setTimeSpeed,
  sunAngle,
  setSunAngle,
  dustIntensity,
  setDustIntensity,
  cloudOpacity,
  setCloudOpacity,
  cloudDriftSpeed,
  setCloudDriftSpeed,
  reliefScale,
  setReliefScale,
  textureMode,
  setTextureMode,
  debrisMode,
  setDebrisMode,
  onSelectPreset,
  selectedObject,
  onClearSelection,
  isAudioMuted,
  onToggleAudio,
  onOpenDrive,
  fps,
  telemetry,
  driveNotice,
  onDismissDriveNotice
}) {
  const [hudHidden, setHudHidden] = useState(false);
  const [activeTab, setActiveTab] = useState('surface');
  const [showNasaBriefingModal, setShowNasaBriefingModal] = useState(false);

  const texturePreviews = useMemo(() => generatePerseveranceTexturePreviews(), []);

  if (hudHidden) {
    return (
      <div className="fixed bottom-5 right-5 z-30 flex items-center gap-2">
        <button
          onClick={() => setHudHidden(false)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-950/85 hover:bg-slate-900 text-zinc-200 border border-white/15 backdrop-blur-md text-xs font-mono uppercase tracking-wider shadow-lg transition cursor-pointer"
          title="Restore HUD (H)"
        >
          <Eye className="w-3.5 h-3.5 text-red-400" />
          <span>Show HUD</span>
        </button>
      </div>
    );
  }

  const speedOptions = [0.2, 1, 2, 5];

  return (
    <div className="pointer-events-none fixed inset-x-0 top-14 bottom-0 z-20 flex flex-col justify-between p-3 sm:p-5">
      {/* Top Bar: Brand Identity + Live Martian Orbital Telemetry + Quick Actions */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="pointer-events-auto flex flex-col gap-1 bg-slate-950/75 border border-white/10 backdrop-blur-xl px-4 py-3 rounded-xl shadow-2xl">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h1 className="text-sm sm:text-base font-semibold tracking-tight text-zinc-100">
              MARTIAN DRIFT
            </h1>
            <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-500/30">
              MOLA + ZCAM 3D
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 font-mono">
            Areographic Lon {telemetry?.subSolarLon ?? '0.0'}°E • Clouds{' '}
            {telemetry?.cloudCoverPct ?? Math.round((cloudOpacity ?? 0.65) * 68)}% • τ={' '}
            {telemetry?.dustOpticalDepth ?? '0.94'} • {fps} FPS
          </p>
        </div>

        {/* Top-Right Mission Utilities */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setShowNasaBriefingModal(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-950/80 hover:bg-red-900/80 text-red-100 border border-red-500/40 backdrop-blur-xl text-xs font-medium transition shadow-lg cursor-pointer"
            title="Watch NASA Science Mars Reconnaissance Video Briefing"
          >
            <Video className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">NASA Mars Video</span>
          </button>

          <button
            onClick={onOpenDrive}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-950/75 hover:bg-slate-900/90 text-zinc-200 border border-white/10 backdrop-blur-xl text-xs font-medium transition shadow-lg cursor-pointer"
            title="Save or Load Mars Simulation Snapshots in Google Drive"
          >
            <FolderOpen className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Mission Snapshots</span>
          </button>

          <button
            onClick={onToggleAudio}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-950/75 hover:bg-slate-900/90 text-zinc-200 border border-white/10 backdrop-blur-xl text-xs font-mono transition shadow-lg cursor-pointer"
            title={isAudioMuted ? 'Enable Martian Wind & Telemetry Audio' : 'Mute Audio'}
          >
            {isAudioMuted ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden md:inline text-zinc-400">Muted</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-red-400" />
                <span className="hidden md:inline text-red-300">Audio On</span>
              </>
            )}
          </button>

          {onSwitchToResearch && (
            <button
              onClick={onSwitchToResearch}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-zinc-300 border border-slate-700/60 backdrop-blur-xl text-xs font-mono transition shadow-lg cursor-pointer whitespace-nowrap"
              title="Open Mars Research Matrix & Atlas"
            >
              <span>RESEARCH SUITE</span>
            </button>
          )}

          {onReturnToDashboard && (
            <button
              onClick={onReturnToDashboard}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/50 backdrop-blur-xl text-xs font-mono font-bold transition shadow-lg cursor-pointer whitespace-nowrap shadow-[0_0_12px_rgba(245,158,11,0.25)]"
              title="Return to Earth // Moon Dashboard"
            >
              <span>← EARTH // MOON</span>
            </button>
          )}

          <button
            onClick={() => setHudHidden(true)}
            className="p-2 rounded-lg bg-slate-950/75 hover:bg-slate-900/90 text-zinc-300 border border-white/10 backdrop-blur-xl transition shadow-lg cursor-pointer"
            title="Hide HUD Overlay"
          >
            <EyeOff className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Optional notification toast for Snapshot Load */}
      {driveNotice && (
        <div className="pointer-events-auto self-center bg-slate-950/90 border border-red-500/40 text-zinc-100 px-4 py-2 rounded-lg shadow-xl backdrop-blur-md flex items-center gap-3 text-xs">
          <span>{driveNotice}</span>
          <button
            onClick={onDismissDriveNotice}
            className="text-zinc-400 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Middle-Right Contextual Inspector Card (Shown when a Mars Landmark, Rover, or Orbiter is selected) */}
      {selectedObject && (
        <div className="pointer-events-auto self-end my-auto w-full max-w-sm bg-slate-950/88 border border-white/15 backdrop-blur-xl rounded-xl p-4 shadow-2xl text-zinc-100 transition-all">
          <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-red-400">
                <Crosshair className="w-3 h-3" />
                <span>{selectedObject.category || selectedObject.subtitle}</span>
              </div>
              <h2 className="text-base font-semibold text-white mt-0.5">
                {selectedObject.title || selectedObject.name}
              </h2>
              {selectedObject.coords && (
                <p className="text-xs font-mono text-zinc-400 mt-0.5">
                  {selectedObject.coords}
                </p>
              )}
            </div>
            <button
              onClick={onClearSelection}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="Release Camera Lock"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Authentic NASA Reference Imagery Preview */}
          {selectedObject.image && (
            <div className="mt-3 relative rounded-lg overflow-hidden border border-white/10 bg-black/50 h-32">
              <img
                src={selectedObject.image}
                alt={selectedObject.title || selectedObject.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1.5 right-2 px-1.5 py-0.5 rounded bg-black/75 border border-white/10 text-[9px] font-mono text-zinc-200">
                {selectedObject.stereoDatasetId || 'NASA / JPL-Caltech'}
              </div>
            </div>
          )}

          <p className="text-xs text-zinc-300 leading-relaxed mt-3">
            {selectedObject.description}
          </p>

          {selectedObject.specs && (
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10">
              {Object.entries(selectedObject.specs).map(([label, val]) => (
                <div key={label} className="bg-white/[0.03] rounded-lg p-2 border border-white/5">
                  <div className="text-[10px] font-mono uppercase text-zinc-400">
                    {label}
                  </div>
                  <div className="text-xs font-mono font-medium text-zinc-100 mt-0.5">
                    {val}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* NASA Science Mars Video Briefing Modal (Reference: https://www.youtube.com/watch?v=Q_P0swqaZDk) */}
      {showNasaBriefingModal && (
        <div className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl bg-slate-950 border border-white/15 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-red-400" />
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    NASA Science Mars Reconnaissance Briefing
                  </h3>
                  <p className="text-[11px] font-mono text-zinc-400">
                    Source: science.nasa.gov • Reference Video Q_P0swqaZDk (t=27s)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNasaBriefingModal(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/Q_P0swqaZDk?start=27&rel=0"
                title="NASA Mars Science Briefing"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="px-5 py-3 bg-slate-900/60 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-300">
              <span>
                Features simulated in WebGL: 25.19° axial obliquity, thin semi-transparent CO₂ atmosphere, drifting 3D cloud shader, and Perseverance ZCAM/SCAM 3D micro-textures.
              </span>
              <button
                onClick={() => setShowNasaBriefingModal(false)}
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition cursor-pointer"
              >
                Return to 3D Globe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Consolidated Control Dock */}
      <div className="pointer-events-auto self-center w-full max-w-4xl bg-slate-950/85 border border-white/10 backdrop-blur-xl rounded-2xl p-3 sm:p-4 shadow-2xl">
        {/* Mode Selector Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 mb-3 border-b border-white/10">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveTab('surface')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'surface'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Mountain className="w-3.5 h-3.5" />
              <span>3D Mars Relief &amp; Textures</span>
            </button>

            <button
              onClick={() => setActiveTab('lighting')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'lighting'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>Atmosphere &amp; Clouds</span>
            </button>

            <button
              onClick={() => setActiveTab('orbital')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'orbital'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Satellite className="w-3.5 h-3.5" />
              <span>Moons &amp; Orbiters</span>
            </button>

            <button
              onClick={() => setActiveTab('camera')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                activeTab === 'camera'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Camera Views</span>
            </button>
          </div>

          {/* Always-visible Time Transport Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-zinc-100 text-xs font-medium transition cursor-pointer"
              title={isPaused ? 'Resume Sol Rotation' : 'Pause Sol Rotation'}
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-red-400" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-blue-400" />
                  <span>Pause</span>
                </>
              )}
            </button>

            <div className="flex items-center bg-black/40 rounded-lg p-0.5 border border-white/10">
              {speedOptions.map((spd) => (
                <button
                  key={spd}
                  onClick={() => {
                    setTimeSpeed(spd);
                    if (isPaused) setIsPaused(false);
                  }}
                  className={`px-2 py-1 rounded-md text-[11px] font-mono transition cursor-pointer ${
                    !isPaused && timeSpeed === spd
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab 1: 3D Mars Relief, Perseverance 3D Surface Texture Modes & NASA Landmarks */}
        {activeTab === 'surface' && (
          <div className="flex flex-col gap-3">
            {/* Row A: Perseverance & NASA 3D Surface Texture Mode Selector Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MARS_3D_TEXTURE_MODES.map((mode) => {
                const isSelected = textureMode === mode.id;
                const previewImg = texturePreviews[mode.id];
                return (
                  <button
                    key={mode.id}
                    onClick={() => setTextureMode(mode.id)}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition cursor-pointer ${
                      isSelected
                        ? 'bg-red-950/65 border-red-500/80 text-white shadow-md'
                        : 'bg-white/[0.03] border-white/10 text-zinc-300 hover:bg-white/[0.07] hover:border-white/20'
                    }`}
                  >
                    {previewImg && (
                      <img
                        src={previewImg}
                        alt={mode.label}
                        className="w-9 h-9 rounded-lg object-cover border border-white/15 shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <Layers className="w-3 h-3 text-red-400 shrink-0" />
                        <span className="text-[11px] font-semibold truncate">
                          {mode.shortLabel}
                        </span>
                      </div>
                      <div className="text-[9px] font-mono text-zinc-400 truncate">
                        {mode.datasetBadge}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Row B: 3D Relief Exaggeration Slider + 6 NASA Landmark Quick-Lock Buttons */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-3 bg-white/[0.03] px-3 py-2 rounded-xl border border-white/10 min-w-[230px]">
                <Sliders className="w-4 h-4 text-red-400 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-300">3D MOLA Relief</span>
                    <span className="text-red-400 font-semibold">
                      {reliefScale.toFixed(1)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2.5"
                    step="0.1"
                    value={reliefScale}
                    onChange={(e) => setReliefScale(parseFloat(e.target.value))}
                    className="w-full accent-red-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {MARS_LANDMARKS.map((lm) => {
                  const isActive = selectedObject?.id === lm.id;
                  const isRover = lm.category.includes('Rover');
                  return (
                    <button
                      key={lm.id}
                      onClick={() => {
                        if (lm.preferredTextureMode && setTextureMode) {
                          setTextureMode(lm.preferredTextureMode);
                        }
                        onSelectPreset({ landmarkId: lm.id });
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap border transition cursor-pointer ${
                        isActive
                          ? isRover
                            ? 'bg-blue-600/30 border-blue-400 text-blue-200'
                            : 'bg-red-600/30 border-red-400 text-red-200'
                          : 'bg-white/[0.03] border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {lm.title.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Thin Semi-Transparent Atmosphere, Drifting Procedural Clouds & Solar Phase */}
        {activeTab === 'lighting' && (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Control 1: Procedural Cloud Coverage */}
              <div className="flex items-center gap-2.5 bg-white/[0.03] px-3 py-2 rounded-xl border border-white/10">
                <Cloud className="w-4 h-4 text-blue-400 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-300">Drifting Cloud Layer</span>
                    <span className="text-blue-400 font-semibold">
                      {Math.round(cloudOpacity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={cloudOpacity}
                    onChange={(e) => setCloudOpacity(parseFloat(e.target.value))}
                    className="w-full accent-blue-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg mt-1"
                  />
                </div>
              </div>

              {/* Control 2: Cloud Drift Speed */}
              <div className="flex items-center gap-2.5 bg-white/[0.03] px-3 py-2 rounded-xl border border-white/10">
                <Wind className="w-4 h-4 text-red-400 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-300">Cloud Drift Speed</span>
                    <span className="text-red-400 font-semibold">
                      {cloudDriftSpeed.toFixed(1)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="3"
                    step="0.1"
                    value={cloudDriftSpeed}
                    onChange={(e) => setCloudDriftSpeed(parseFloat(e.target.value))}
                    className="w-full accent-red-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg mt-1"
                  />
                </div>
              </div>

              {/* Control 3: Semi-Transparent Atmospheric Shell & Solar Longitude */}
              <div className="flex items-center gap-2.5 bg-white/[0.03] px-3 py-2 rounded-xl border border-white/10">
                <Sun className="w-4 h-4 text-red-400 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-zinc-300">Atmo Shell &amp; Sun</span>
                    <span className="text-red-400 font-semibold">
                      {Math.round(dustIntensity * 100)}% • {sunAngle}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={sunAngle}
                    onChange={(e) => setSunAngle(Number(e.target.value))}
                    className="w-full accent-red-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setSunAngle(38);
                    setDustIntensity(0.42);
                    setCloudOpacity(0.68);
                    setCloudDriftSpeed(1.0);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 border border-white/10 cursor-pointer"
                >
                  Aphelion Ice Clouds
                </button>
                <button
                  onClick={() => {
                    setSunAngle(110);
                    setDustIntensity(0.82);
                    setCloudOpacity(0.88);
                    setCloudDriftSpeed(1.8);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 border border-white/10 cursor-pointer"
                >
                  Solstice Dust Plume
                </button>
                <button
                  onClick={() => {
                    setSunAngle(195);
                    setDustIntensity(0.35);
                    setCloudOpacity(0.55);
                    setCloudDriftSpeed(0.8);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 border border-white/10 cursor-pointer"
                >
                  Blue Sunset Limb
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                <span>Atmo Haze:</span>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={dustIntensity}
                  onChange={(e) => setDustIntensity(parseFloat(e.target.value))}
                  className="w-24 accent-red-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Martian Moons & Orbiters (Defaulting to Minimal Asteroids) */}
        {activeTab === 'orbital' && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              {[
                { id: 'minimal', label: 'Minimal: Odyssey + Phobos (2)' },
                { id: 'notable', label: 'Moons & Orbiters (5)' },
                { id: 'all', label: 'With Sparse Trojans (21)' },
                { id: 'none', label: 'Clean Globe (0)' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setDebrisMode(opt.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
                    debrisMode === opt.id
                      ? 'bg-blue-600/30 border-blue-400 text-blue-200'
                      : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {[
                { id: 'odyssey-orbiter', label: '2001 Mars Odyssey' },
                { id: 'phobos-moon', label: 'Phobos' },
                { id: 'deimos-moon', label: 'Deimos' },
                { id: 'mro-relay', label: 'MRO Relay' }
              ].map((craft) => (
                <button
                  key={craft.id}
                  onClick={() => onSelectPreset({ craftId: craft.id })}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 border border-white/10 whitespace-nowrap cursor-pointer"
                >
                  Track {craft.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Camera Angles */}
        {activeTab === 'camera' && (
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() =>
                  onSelectPreset({ theta: 0.45, phi: 1.38, radius: 9.6 })
                }
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-zinc-200 border border-white/10 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-red-400" />
                <span>Reset Orbital View</span>
              </button>
              <button
                onClick={() =>
                  onSelectPreset({ theta: 1.85, phi: 1.48, radius: 6.4 })
                }
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-zinc-200 border border-white/10 cursor-pointer"
              >
                Valles Marineris Canyon
              </button>
              <button
                onClick={() =>
                  onSelectPreset({ theta: -0.35, phi: 0.35, radius: 7.5 })
                }
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-zinc-200 border border-white/10 cursor-pointer"
              >
                North Polar Ice Cap
              </button>
              <button
                onClick={() =>
                  onSelectPreset({ theta: 0.2, phi: 1.35, radius: 18.5 })
                }
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-zinc-200 border border-white/10 cursor-pointer"
              >
                Wide Phobos &amp; Deimos System
              </button>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">
              Drag to orbit • Scroll to zoom • Click pins to inspect
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
