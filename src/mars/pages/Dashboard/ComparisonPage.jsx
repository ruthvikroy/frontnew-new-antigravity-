import React from 'react';
import { useMarsStore } from '../../store/useMarsStore.js';
import { EARTH_MARS_COMPARISONS } from '../../data/comparison/comparison.js';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export const ComparisonPage = () => {
  const { selectedComparisonId, setSelectedComparisonId } = useMarsStore();

  const selectedItem =
    EARTH_MARS_COMPARISONS.find((c) => c.id === selectedComparisonId) ||
    EARTH_MARS_COMPARISONS[0];

  const normalizedChartData = [
    { property: 'Radius', Earth: 100, Mars: 53.2 },
    { property: 'Mass', Earth: 100, Mars: 10.7 },
    { property: 'Gravity', Earth: 100, Mars: 37.9 },
    { property: 'Solar Day', Earth: 100, Mars: 102.7 },
    { property: 'Year Length', Earth: 100, Mars: 188.1 },
    { property: 'Axial Tilt', Earth: 100, Mars: 107.5 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-8 space-y-8 bg-[#04060A] min-h-[calc(100vh-3.5rem)] text-slate-100">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-orange-400 uppercase tracking-wider">
            <span>Comparative Planetology</span>
            <span className="text-slate-700">·</span>
            <span>Terrestrial Worlds</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-100 mt-1">
            Earth vs Mars Planetary Comparison
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Direct physical, dynamic, and atmospheric comparison between Earth and Mars.
            Examine how differences in planetary mass and distance from the Sun dictate planetary evolution.
          </p>
        </div>
      </div>

      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            True Physical Proportional Scale (Radius: 6,371 km vs 3,389.5 km)
          </span>
          <span className="text-xs font-mono text-amber-400 font-semibold">
            Mars Radius = 53.2% of Earth
          </span>
        </div>

        <div className="flex items-center justify-around py-8 border-y border-slate-800/80 bg-slate-950/40 rounded-xl">
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-48 h-48 sm:w-56 sm:h-56 rounded-full shadow-2xl shadow-blue-900/40 relative flex items-center justify-center border border-blue-400/30 overflow-hidden"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #22c55e 0%, #0284c7 40%, #0f172a 90%)',
              }}
            >
              <div className="absolute inset-0 bg-white/10 rounded-full blur-sm" />
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            </div>
            <div className="text-center font-mono">
              <span className="text-sm font-bold text-blue-400 block">EARTH</span>
              <span className="text-xs text-slate-400">R = 6,371.0 km · 1.00 g₀</span>
            </div>
          </div>

          <div className="text-slate-600 text-sm font-mono flex flex-col items-center gap-1">
            <span>VS</span>
            <span className="text-[10px] text-slate-500">1 : 0.53</span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full shadow-2xl shadow-orange-950/60 relative flex items-center justify-center border border-amber-600/40 overflow-hidden"
              style={{
                background: 'radial-gradient(circle at 35% 35%, #ea580c 0%, #9a3412 55%, #180904 95%)',
              }}
            >
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-2 bg-white/90 rounded-full blur-[1px]" />
              <div className="absolute w-5 h-6 bg-amber-950/70 rounded-full blur-[2px] top-7 right-4" />
            </div>
            <div className="text-center font-mono">
              <span className="text-sm font-bold text-amber-500 block">MARS</span>
              <span className="text-xs text-slate-400">R = 3,389.5 km · 0.38 g₀</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold block">
              Relative Dimension Ratios
            </span>
            <h2 className="text-base font-bold text-slate-100">
              Normalized Planetary Ratios (Earth Baseline = 100%)
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Source: NASA JPL Planetary Fact Sheets
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={normalizedChartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="property" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 200]} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                formatter={(val) => [`${val}%`, '']}
              />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              <Bar dataKey="Earth" name="Earth (100% baseline)" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Mars" name="Mars (% of Earth)" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-3">
        <span className="text-xs font-mono uppercase text-slate-400 font-semibold block">
          Select Parameter for Deep Comparison
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {EARTH_MARS_COMPARISONS.map((comp) => {
            const isSelected = selectedComparisonId === comp.id;
            return (
              <button
                key={comp.id}
                onClick={() => setSelectedComparisonId(comp.id)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-orange-500/80 shadow-lg'
                    : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-900/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-100 font-mono">
                    {comp.property}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    {comp.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800/80">
                  <div className="bg-blue-950/30 p-2 rounded-lg border border-blue-900/30">
                    <span className="text-[9px] text-blue-400 uppercase block">EARTH</span>
                    <span className="text-slate-100 font-semibold truncate block">
                      {comp.earthValue}
                    </span>
                  </div>
                  <div className="bg-orange-950/30 p-2 rounded-lg border border-orange-900/30">
                    <span className="text-[9px] text-amber-400 uppercase block">MARS</span>
                    <span className="text-slate-100 font-semibold truncate block">
                      {comp.marsValue}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                  {comp.scientificContext}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-amber-500 font-semibold">
              Comparative Analysis
            </span>
            <span className="text-slate-700">·</span>
            <span className="text-xs font-mono text-slate-400 uppercase">{selectedItem.category}</span>
          </div>
          <span className="text-xs font-mono text-slate-300">
            Ratio (Mars/Earth): <strong className="text-amber-400">{selectedItem.ratioMarsToEarth}x</strong>
          </span>
        </div>

        <h2 className="text-xl font-bold text-slate-100">{selectedItem.property}</h2>
        <p className="text-sm text-slate-300 leading-relaxed">{selectedItem.scientificContext}</p>
      </div>
    </div>
  );
};
