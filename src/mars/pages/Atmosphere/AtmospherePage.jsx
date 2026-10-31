import React, { useMemo } from 'react';
import { useMarsStore } from '../../store/useMarsStore.js';
import {
  calculateAtmosphericDensity,
  calculateScaleHeightMeters,
  calculateSpeedOfSound,
  calculatePressureAtAltitude,
  convertTemperature,
  convertPressure,
} from '../../utils/physics.js';
import { MARS_ATMOSPHERE_COMPOSITION } from '../../data/atmosphere/scenarios.js';
import { RotateCcw } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const AtmospherePage = () => {
  const {
    atmosphere,
    setAtmosphereParam,
    resetAtmosphereToReference,
  } = useMarsStore();

  const density = useMemo(
    () => calculateAtmosphericDensity(atmosphere.pressureMbar, atmosphere.temperatureKelvin),
    [atmosphere.pressureMbar, atmosphere.temperatureKelvin]
  );

  const scaleHeightKm = useMemo(
    () => calculateScaleHeightMeters(atmosphere.temperatureKelvin) / 1000,
    [atmosphere.temperatureKelvin]
  );

  const speedOfSound = useMemo(
    () => calculateSpeedOfSound(atmosphere.temperatureKelvin),
    [atmosphere.temperatureKelvin]
  );

  const altitudeProfileData = useMemo(() => {
    const points = [];
    for (let alt = -7; alt <= 25; alt += 2) {
      const p = calculatePressureAtAltitude(alt, atmosphere.pressureMbar, atmosphere.temperatureKelvin);
      const t = Math.max(140, atmosphere.temperatureKelvin - (alt > 0 ? alt * 1.6 : alt * 0.8));
      points.push({
        altitude: alt,
        altitudeLabel: `${alt > 0 ? `+${alt}` : alt} km`,
        pressure: parseFloat(p.toFixed(2)),
        temperature: parseFloat(t.toFixed(1)),
      });
    }
    return points;
  }, [atmosphere.pressureMbar, atmosphere.temperatureKelvin]);

  const isHypothetical =
    Math.abs(atmosphere.pressureMbar - 6.10) > 0.05 ||
    Math.abs(atmosphere.temperatureKelvin - 210) > 1 ||
    Math.abs(atmosphere.co2Concentration - 95.32) > 0.1;

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-8 space-y-8 bg-[#04060A] min-h-[calc(100vh-3.5rem)] text-slate-100">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
            <span>Atmospheric Physics Laboratory</span>
            <span className="text-slate-700">·</span>
            <span>Fluid & Gas Dynamics</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-100 mt-1">
            Martian Atmosphere Simulator
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Examine thermodynamic and gas relationships under real Martian conditions or hypothetical
            scenarios. Calculations apply the ideal gas law with temperature-dependent scale height.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium flex items-center gap-2 ${
              isHypothetical
                ? 'bg-amber-950/40 border-amber-600/50 text-amber-300'
                : 'bg-emerald-950/40 border-emerald-600/50 text-emerald-300'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isHypothetical ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
            />
            <span>{isHypothetical ? 'Hypothetical Scenario' : 'Empirical Reference Conditions'}</span>
          </div>

          <button
            onClick={resetAtmosphereToReference}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
            Atmospheric Density (ρ)
          </span>
          <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
            {density.toFixed(4)}{' '}
            <span className="text-xs text-slate-400 font-normal">kg/m³</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            ~{((density / 1.225) * 100).toFixed(2)}% of Earth sea-level
          </span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
            Barometric Scale Height (H)
          </span>
          <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
            {scaleHeightKm.toFixed(2)}{' '}
            <span className="text-xs text-slate-400 font-normal">km</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            vs 8.5 km on Earth (H = R_spec·T / g)
          </span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
            Speed of Sound (c)
          </span>
          <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
            {speedOfSound.toFixed(1)}{' '}
            <span className="text-xs text-slate-400 font-normal">m/s</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            c = √(γ · R_spec · T), γ_CO2 = 1.29
          </span>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
            Dust Optical Depth (τ)
          </span>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            {atmosphere.dustOpticalDepth.toFixed(2)}{' '}
            <span className="text-xs text-slate-400 font-normal">tau</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            {atmosphere.dustOpticalDepth < 0.3 ? 'Clear sky' : atmosphere.dustOpticalDepth < 1.0 ? 'Dust haze' : 'Severe storm'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-100">Simulation Variables</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Adjust parameters to observe real-time gas dynamics responses.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Surface Pressure</span>
              <span className="text-cyan-400 font-bold tabular-nums">
                {atmosphere.pressureMbar.toFixed(2)} mbar ({convertPressure(atmosphere.pressureMbar, 'Pa').toFixed(0)} Pa)
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="25.0"
              step="0.1"
              value={atmosphere.pressureMbar}
              onChange={(e) => setAtmosphereParam('pressureMbar', parseFloat(e.target.value))}
              className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>0.5 mbar (Peak)</span>
              <span>Ref: 6.10 mbar</span>
              <span>25 mbar (Thick)</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Mean Temperature</span>
              <span className="text-cyan-400 font-bold tabular-nums">
                {atmosphere.temperatureKelvin.toFixed(1)} K ({convertTemperature(atmosphere.temperatureKelvin, 'C').toFixed(1)} °C)
              </span>
            </div>
            <input
              type="range"
              min="130"
              max="310"
              step="1"
              value={atmosphere.temperatureKelvin}
              onChange={(e) => setAtmosphereParam('temperatureKelvin', parseFloat(e.target.value))}
              className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>130 K (Polar Night)</span>
              <span>Ref: 210 K</span>
              <span>310 K (Summer Noon)</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Carbon Dioxide (CO₂)</span>
              <span className="text-cyan-400 font-bold tabular-nums">
                {atmosphere.co2Concentration.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min="80.0"
              max="99.0"
              step="0.1"
              value={atmosphere.co2Concentration}
              onChange={(e) => setAtmosphereParam('co2Concentration', parseFloat(e.target.value))}
              className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>80.0%</span>
              <span>Ref: 95.32%</span>
              <span>99.0%</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Dust Optical Depth (τ)</span>
              <span className="text-amber-400 font-bold tabular-nums">
                {atmosphere.dustOpticalDepth.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="4.0"
              step="0.05"
              value={atmosphere.dustOpticalDepth}
              onChange={(e) => setAtmosphereParam('dustOpticalDepth', parseFloat(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>0.05 (Clear)</span>
              <span>0.5 (Haze)</span>
              <span>4.0 (Global Storm)</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300">Surface Wind Velocity</span>
              <span className="text-slate-200 font-bold tabular-nums">
                {atmosphere.windSpeedMs.toFixed(1)} m/s ({(atmosphere.windSpeedMs * 3.6).toFixed(1)} km/h)
              </span>
            </div>
            <input
              type="range"
              min="1.0"
              max="40.0"
              step="0.5"
              value={atmosphere.windSpeedMs}
              onChange={(e) => setAtmosphereParam('windSpeedMs', parseFloat(e.target.value))}
              className="w-full accent-slate-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>1 m/s (Calm)</span>
              <span>10 m/s (Breeze)</span>
              <span>40 m/s (Gale)</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
                  Thermodynamic Profile
                </span>
                <h2 className="text-base font-bold text-slate-100">
                  Atmospheric Pressure vs Elevation
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                P(z) = P₀ · exp(-z / H)
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={altitudeProfileData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="altitude"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickFormatter={(v) => `${v} km`}
                    label={{ value: 'Elevation relative to MOLA datum (km)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 11 }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    domain={[0, 'auto']}
                    tickFormatter={(v) => `${v} mb`}
                    label={{ value: 'Pressure (mbar)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                    formatter={(val) => [`${val} mbar`, 'Pressure']}
                    labelFormatter={(label) => `Altitude: ${label} km`}
                  />
                  <Line
                    type="monotone"
                    dataKey="pressure"
                    stroke="#06b6d4"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: '#06b6d4' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
              <span>Deep Canyon: Valles Marineris (-7 km) ~11.5 mbar</span>
              <span>Datum: 0 km ~6.1 mbar</span>
              <span>Volcano: Olympus Mons (+21.9 km) ~0.8 mbar</span>
            </div>
          </div>

          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold block">
                  Spectrometric Abundance
                </span>
                <h2 className="text-base font-bold text-slate-100">
                  Martian Atmospheric Gas Constituents
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-400">
                In-situ GCMS (Viking & Curiosity SAM)
              </span>
            </div>

            <div className="space-y-2.5">
              {MARS_ATMOSPHERE_COMPOSITION.map((gas) => (
                <div key={gas.chemicalFormula} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-200">
                      {gas.gas} <span className="text-slate-400">({gas.chemicalFormula})</span>
                    </span>
                    <span className="text-amber-400 font-bold tabular-nums">
                      {gas.percentage > 1 ? `${gas.percentage.toFixed(2)}%` : `${gas.percentage}% (${gas.ppm} ppm)`}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-600 to-orange-500 rounded-full"
                      style={{ width: `${Math.max(1, gas.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
