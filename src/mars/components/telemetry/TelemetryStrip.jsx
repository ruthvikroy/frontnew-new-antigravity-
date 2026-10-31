import React from 'react';
import { useMarsStore } from '../../store/useMarsStore.js';
import { MARS_TELEMETRY } from '../../data/mars/telemetry.js';
import { CheckCircle2 } from 'lucide-react';

export const TelemetryStrip = () => {
  const { unitSystem, selectedMetricId, setSelectedMetricId } = useMarsStore();

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {MARS_TELEMETRY.map((metric) => {
          const isSelected = selectedMetricId === metric.id;
          const formatted = metric.format
            ? metric.format(metric.value, unitSystem)
            : { value: String(metric.value), unit: metric.unit };

          return (
            <button
              key={metric.id}
              onClick={() => setSelectedMetricId(metric.id)}
              className={`text-left p-3 rounded-xl border transition-all relative overflow-hidden group ${
                isSelected
                  ? 'bg-slate-900/90 border-amber-500/80 shadow-md shadow-amber-950/20'
                  : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[11px] font-mono tracking-wider uppercase text-slate-400 group-hover:text-slate-200 truncate">
                  {metric.name}
                </span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                    metric.evidenceType === 'Observed'
                      ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                      : 'bg-cyan-950/40 text-cyan-400 border border-cyan-800/40'
                  }`}
                >
                  {metric.evidenceType}
                </span>
              </div>

              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-bold font-mono text-slate-100 tabular-nums">
                  {formatted.value}
                </span>
                <span className="text-xs font-mono text-amber-400/90 font-medium">
                  {formatted.unit}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-1 mt-1.5 leading-snug">
                {metric.explanation}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const SelectedTelemetryDetail = () => {
  const { selectedMetricId, unitSystem } = useMarsStore();
  const metric = MARS_TELEMETRY.find((m) => m.id === selectedMetricId) || MARS_TELEMETRY[0];
  const formatted = metric.format
    ? metric.format(metric.value, unitSystem)
    : { value: String(metric.value), unit: metric.unit };

  return (
    <div className="bg-slate-950/90 border border-slate-800/90 rounded-2xl p-5 shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
              Parameter Dossier
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs font-mono text-slate-400 uppercase">{metric.category}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mt-1">{metric.name}</h2>
        </div>

        <div className="text-right">
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            {formatted.value}{' '}
            <span className="text-xs text-slate-400 font-normal">{formatted.unit}</span>
          </div>
          {metric.earthComparisonRatio !== undefined && (
            <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
              {(metric.earthComparisonRatio * 100).toFixed(1)}% of Earth standard
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800/70 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="md:col-span-2">
          <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
            Physical Interpretation
          </span>
          <p className="text-slate-300 leading-relaxed">{metric.explanation}</p>
        </div>

        <div className="space-y-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800/60 font-mono text-[11px]">
          <div>
            <span className="text-slate-400 block">EVIDENCE CLASSIFICATION</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {metric.evidenceType} Empirical In-situ / Orbital
            </span>
          </div>
          <div className="pt-2 border-t border-slate-800">
            <span className="text-slate-400 block">DATA SOURCE & INSTRUMENTATION</span>
            <span className="text-slate-200 block mt-0.5 text-[10px] leading-tight">
              {metric.source}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
