import React, { useState, useCallback, useEffect } from 'react';
import MarsDriftSimulation from './MarsDriftSimulation.jsx';
import MinimalHUD from './MinimalHUD.jsx';
import { GoogleDrivePanel } from './GoogleDrivePanel.jsx';
import { audioEngine } from './AudioEngine.js';

export default function MarsDriftContainer({ onReturnToDashboard, onSwitchToResearch }) {
  const [isPaused, setIsPaused] = useState(false);
  const [timeSpeed, setTimeSpeed] = useState(1);
  const [sunAngle, setSunAngle] = useState(38);
  const [dustIntensity, setDustIntensity] = useState(0.42);
  const [cloudOpacity, setCloudOpacity] = useState(0.65);
  const [cloudDriftSpeed, setCloudDriftSpeed] = useState(1.0);
  const [reliefScale, setReliefScale] = useState(1.0);
  const [textureMode, setTextureMode] = useState('global-mola');
  const [debrisMode, setDebrisMode] = useState('minimal');
  const [cameraPreset, setCameraPreset] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(true);
  const [fps, setFps] = useState(60);
  const [webglError, setWebglError] = useState(null);
  const [isDriveOpen, setIsDriveOpen] = useState(false);
  const [driveNotice, setDriveNotice] = useState(null);
  const [telemetry, setTelemetry] = useState({
    subSolarLon: '0.0',
    cameraAltitudeKm: 6150,
    dustOpticalDepth: '0.94',
    cloudCoverPct: 44,
  });

  const handleToggleAudio = useCallback(() => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    audioEngine.setMuted(nextMuted);
  }, [isAudioMuted]);

  const handleClearPreset = useCallback(() => {
    setCameraPreset(null);
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      } else if (e.code === 'Escape') {
        setSelectedObject(null);
        setIsDriveOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const currentConfig = {
    isPaused,
    timeSpeed,
    sunAngle,
    dustIntensity,
    cloudOpacity,
    cloudDriftSpeed,
    reliefScale,
    textureMode,
    debrisMode,
    selectedObjectId: selectedObject?.id || null,
  };

  const handleLoadConfig = useCallback((config) => {
    if (!config) return;
    if (typeof config.isPaused === 'boolean') setIsPaused(config.isPaused);
    if (typeof config.timeSpeed === 'number') setTimeSpeed(config.timeSpeed);
    if (typeof config.sunAngle === 'number') setSunAngle(config.sunAngle);
    if (typeof config.dustIntensity === 'number') setDustIntensity(config.dustIntensity);
    if (typeof config.cloudOpacity === 'number') setCloudOpacity(config.cloudOpacity);
    if (typeof config.cloudDriftSpeed === 'number') setCloudDriftSpeed(config.cloudDriftSpeed);
    if (typeof config.reliefScale === 'number') setReliefScale(config.reliefScale);
    if (typeof config.textureMode === 'string') setTextureMode(config.textureMode);
    if (typeof config.debrisMode === 'string') setDebrisMode(config.debrisMode);
    if (config.selectedObjectId) {
      setCameraPreset({ landmarkId: config.selectedObjectId });
    }
    setDriveNotice('Loaded Mars Orbital Snapshot from Google Drive');
    setTimeout(() => setDriveNotice(null), 4000);
  }, []);

  return (
    <main className="relative w-full h-full min-h-screen overflow-hidden bg-[#04060c] select-none flex-1 flex flex-col">
      {webglError ? (
        <div className="flex flex-col items-center justify-center w-full h-full p-6 text-center bg-slate-950 text-zinc-200">
          <div className="max-w-md p-6 rounded-2xl bg-slate-900/90 border border-red-500/30 shadow-2xl">
            <div className="text-xs font-mono uppercase tracking-widest text-red-400 mb-2">
              Graphics Telemetry Alert
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">
              3D WebGL Context Unavailable
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              {webglError}. Ensure hardware acceleration is enabled in your browser settings.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition cursor-pointer"
            >
              Reinitialize Mars Renderer
            </button>
          </div>
        </div>
      ) : (
        <MarsDriftSimulation
          isPaused={isPaused}
          timeSpeed={timeSpeed}
          sunAngle={sunAngle}
          dustIntensity={dustIntensity}
          cloudOpacity={cloudOpacity}
          cloudDriftSpeed={cloudDriftSpeed}
          reliefScale={reliefScale}
          textureMode={textureMode}
          debrisMode={debrisMode}
          cameraPreset={cameraPreset}
          selectedObject={selectedObject}
          onSelectObject={setSelectedObject}
          onClearPreset={handleClearPreset}
          isAudioMuted={isAudioMuted}
          onFpsUpdate={setFps}
          onWebglError={setWebglError}
          onTelemetryUpdate={setTelemetry}
        />
      )}

      <MinimalHUD
        onReturnToDashboard={onReturnToDashboard}
        onSwitchToResearch={onSwitchToResearch}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        timeSpeed={timeSpeed}
        setTimeSpeed={setTimeSpeed}
        sunAngle={sunAngle}
        setSunAngle={setSunAngle}
        dustIntensity={dustIntensity}
        setDustIntensity={setDustIntensity}
        cloudOpacity={cloudOpacity}
        setCloudOpacity={setCloudOpacity}
        cloudDriftSpeed={cloudDriftSpeed}
        setCloudDriftSpeed={setCloudDriftSpeed}
        reliefScale={reliefScale}
        setReliefScale={setReliefScale}
        textureMode={textureMode}
        setTextureMode={setTextureMode}
        debrisMode={debrisMode}
        setDebrisMode={setDebrisMode}
        onSelectPreset={setCameraPreset}
        selectedObject={selectedObject}
        onClearSelection={() => setSelectedObject(null)}
        isAudioMuted={isAudioMuted}
        onToggleAudio={handleToggleAudio}
        onOpenDrive={() => setIsDriveOpen(true)}
        fps={fps}
        telemetry={telemetry}
        driveNotice={driveNotice}
        onDismissDriveNotice={() => setDriveNotice(null)}
      />

      <GoogleDrivePanel
        isOpen={isDriveOpen}
        onClose={() => setIsDriveOpen(false)}
        currentPreset={currentConfig}
        onApplyPreset={handleLoadConfig}
      />
    </main>
  );
}
