import React, { useEffect } from 'react';
import { Mars3DViewer } from '../../components/mars/Mars3DViewer.jsx';
import { useMarsStore } from '../../store/useMarsStore.js';
import { ENVIRONMENT_SCENARIOS } from '../../data/atmosphere/scenarios.js';
import {
  Play,
  Pause,
  RotateCcw,
  Sun,
} from 'lucide-react';

export const EnvironmentPage = () => {
  const {
    selectedScenarioId,
    setScenario,
    atmosphere,
    solarTime,
    setSolarTimePlaying,
    setSolarTimeSpeed,
    setLocalSolarHour,
    setSolarLongitudeLs,
    advanceSolarTime,
  } = useMarsStore();

  const activeScenario =
    ENVIRONMENT_SCENARIOS.find((s) => s.id === selectedScenarioId) || ENVIRONMENT_SCENARIOS[0];

  useEffect(() => {
    if (!solarTime.isPlaying) return;
    const interval = setInterval(() => {
      advanceSolarTime(0.5);
    }, 500);
    return () => clearInterval(interval);
  }, [solarTime.isPlaying, advanceSolarTime]);

  const getSeasonName = (ls) => {
    if (ls >= 0 && ls < 90) return 'Northern Spring / Southern Autumn';
    if (ls >= 90 && ls < 180) return 'Northern Summer / Southern Winter';
    if (ls >= 180 && ls < 270) return 'Northern Autumn / Southern Spring (Dust Season)';
    return 'Northern Winter / Southern Summer';
  };

  const formattedHours = Math.floor(solarTime.localSolarHour)
    .toString()
    .padStart(2, '0');
  const formattedMinutes = Math.floor((solarTime.localSolarHour % 1) * 60)
    .toString()
    .padStart(2, '0');

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] flex flex-col lg:flex-row bg-[#04060A]">
      <div className="w-full lg:w-3/5 h-[52vh] lg:h-[calc(100vh-3.5rem)] relative border-b lg:border-b-0 lg:border-r border-slate-800">
        <Mars3DViewer />

        <div className="absolute top-4 left-4 z-10 max-w-sm bg-slate-950/90 border border-slate-800/90 rounded-2xl p-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold uppercase">
              <Sun className="w-3.5 h-3.5" />
              Insolation & Sky State
            </span>
            <span className="text-slate-200">Ls {solarTime.solarLongitudeLs.toFixed(1)}°</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-400 text-[10px] block">SURFACE INSOLATION</span>
              <span className="text-amber-400 font-bold">
                {activeScenario.surfaceIlluminationPct}% direct
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">OPTICAL DEPTH (τ)</span>
              <span className="text-slate-100 font-bold">
                {atmosphere.dustOpticalDepth.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">LOCAL SOLAR TIME</span>
              <span className="text-slate-100 font-bold">
                {formattedHours}:{formattedMinutes} LST
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block">DUST VISIBILITY</span>
              <span className="text-amber-300 font-bold uppercase">
                {activeScenario.dustVisibility}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-300 mt-2.5 leading-relaxed">
            {activeScenario.description}
          </p>
        </div>
      </div>

      <div className="w-full lg:w-2/5 p-5 lg:p-6 overflow-y-auto space-y-6 h-auto lg:h-[calc(100vh-3.5rem)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-wider">
            <span>Environmental Dynamics</span>
            <span className="text-slate-700">·</span>
            <span>Diurnal & Seasonal Simulation</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 mt-1">
            Environment & Lighting Lab
          </h1>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Simulate planetary diurnal cycles, orbital seasons, and atmospheric dust storm events.
            Observe the day/night terminator boundary and atmospheric haze transitions in real time.
          </p>
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase text-slate-300 font-semibold block">
            Atmospheric & Dust Scenarios
          </span>
          <div className="space-y-2">
            {ENVIRONMENT_SCENARIOS.map((sc) => {
              const isSelected = selectedScenarioId === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => setScenario(sc.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/70 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-100">{sc.name}</span>
                    <span className="text-[10px] font-mono text-amber-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                      τ {sc.opticalDepth.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug line-clamp-2">
                    {sc.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold block">
                Planetary Ephemeris Clock
              </span>
              <h2 className="text-sm font-bold text-slate-100">
                Local Solar Time & Rotation
              </h2>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSolarTimePlaying(!solarTime.isPlaying)}
                className={`px-3 py-1 text-xs font-mono rounded-lg border flex items-center gap-1.5 transition-colors ${
                  solarTime.isPlaying
                    ? 'bg-amber-600/20 border-amber-500/40 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {solarTime.isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{solarTime.isPlaying ? 'Simulating' : 'Paused'}</span>
              </button>

              <button
                onClick={() => {
                  setLocalSolarHour(12.0);
                  setSolarLongitudeLs(71.0);
                }}
                className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="Reset to Midday Prime Meridian"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Local Solar Hour (0° Lon)</span>
              <span className="text-amber-400 font-bold tabular-nums">
                {formattedHours}:{formattedMinutes} LST
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="24"
              step="0.1"
              value={solarTime.localSolarHour}
              onChange={(e) => setLocalSolarHour(parseFloat(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>00:00 Midnight</span>
              <span>06:00 Dawn</span>
              <span>12:00 Noon</span>
              <span>18:00 Dusk</span>
              <span>24:00</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Solar Longitude (Ls Season)</span>
              <span className="text-cyan-400 font-bold tabular-nums">
                Ls {solarTime.solarLongitudeLs.toFixed(1)}°
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={solarTime.solarLongitudeLs}
              onChange={(e) => setSolarLongitudeLs(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0° Equinox</span>
              <span>90° Summer</span>
              <span>180° Equinox</span>
              <span>270° Perihelion</span>
              <span>360°</span>
            </div>
            <span className="text-[11px] font-mono text-slate-300 block text-right mt-1">
              Season: {getSeasonName(solarTime.solarLongitudeLs)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-800">
            <span className="text-slate-400">Simulation Clock Multiplier:</span>
            <div className="flex items-center gap-1">
              {[1, 60, 300, 1000].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setSolarTimeSpeed(speed)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                    solarTime.speedMultiplier === speed
                      ? 'bg-amber-600 text-slate-950 font-bold'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-slate-400 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/80 leading-normal">
            Note: Time acceleration simulates diurnal lighting and orbital position at accelerated
            rates for interactive exploration. Physical observations are clearly distinguished from
            simulated scenarios.
          </div>
        </div>
      </div>
    </div>
  );
};
