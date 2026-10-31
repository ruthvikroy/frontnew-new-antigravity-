import React, { useEffect } from 'react';
import { X, Activity, ShieldAlert, SunMedium, Compass } from 'lucide-react';

export function MetricComparisonDrawer({ pair, onClose, tempUnit }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!pair) return null;

  const { earth, moon } = pair;
  const elevationDiff = Math.abs(earth.metrics.elevationMeters - moon.metrics.elevationMeters);
  const gravityRatio = (earth.metrics.gravityMps2 / moon.metrics.gravityMps2).toFixed(2);
  const radiationRatio = (moon.metrics.radiationMsvYear / Math.max(earth.metrics.radiationMsvYear, 0.1)).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-[#000000] border border-[var(--line)] rounded shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--line)] flex items-center justify-between bg-[var(--chip)]">
          <div>
            <div className="uppercase tracking-widest text-[var(--accent)] mb-0.5">
              Differential Science Analysis // {pair.categoryLabel}
            </div>
            <h2 id="drawer-title" className="font-bold text-[var(--accent)]">
              {pair.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[var(--muted)] hover:text-[var(--text)] rounded hover:bg-black transition-colors cursor-pointer"
            aria-label="Close comparative modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Side-by-Side Location Identity Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Earth Header Card */}
            <div className="p-4 rounded bg-[var(--chip)] border border-[var(--line)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[var(--accent)] font-semibold tracking-wider">
                  TERRESTRIAL // {earth.designation}
                </span>
                <span className="text-[var(--muted)]">
                  {earth.coordinatesFormatted}
                </span>
              </div>
              <h3 className="font-bold text-[var(--text)]">{earth.name}</h3>
              <p className="text-[var(--muted)] mt-1">{earth.region}</p>
              <div className="mt-3 text-[var(--text)] bg-black p-2.5 rounded border border-[var(--line)]">
                <span className="text-[var(--muted)] block uppercase mb-1">
                  Scientific Mission Value:
                </span>
                {earth.scientificSignificance}
              </div>
            </div>

            {/* Moon Header Card */}
            <div className="p-4 rounded bg-[var(--chip)] border border-[var(--line)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[var(--accent)] font-semibold tracking-wider">
                  SELENOLOGICAL // {moon.designation}
                </span>
                <span className="text-[var(--muted)]">
                  {moon.coordinatesFormatted}
                </span>
              </div>
              <h3 className="font-bold text-[var(--text)]">{moon.name}</h3>
              <p className="text-[var(--muted)] mt-1">{moon.region}</p>
              <div className="mt-3 text-[var(--text)] bg-black p-2.5 rounded border border-[var(--line)]">
                <span className="text-[var(--muted)] block uppercase mb-1">
                  Scientific Mission Value:
                </span>
                {moon.scientificSignificance}
              </div>
            </div>
          </div>

          {/* Comparative Metric Diff Matrix */}
          <div className="space-y-4">
            <h4 className="uppercase tracking-wider text-[var(--muted)]">
              Direct Telemetry Variance
            </h4>

            {/* Gravity Differential */}
            <div className="bg-[var(--chip)] p-4 rounded border border-[var(--line)]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[var(--text)] flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[var(--accent)]" />
                  Surface Gravitational Acceleration
                </span>
                <span className="text-[var(--accent)]">Ratio {gravityRatio} : 1 (6.06x stronger on Earth)</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-[var(--muted)] mb-1">
                    <span>Earth ({earth.metrics.gravityMps2} m/s²)</span>
                    <span>100%</span>
                  </div>
                  <div className="w-full bg-black h-2 rounded overflow-hidden border border-[var(--line)]">
                    <div className="bg-[var(--accent)] h-full w-full rounded" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[var(--muted)] mb-1">
                    <span>Moon ({moon.metrics.gravityMps2} m/s²)</span>
                    <span>16.5%</span>
                  </div>
                  <div className="w-full bg-black h-2 rounded overflow-hidden border border-[var(--line)]">
                    <div className="bg-[var(--accent)] h-full w-[16.5%] rounded" />
                  </div>
                </div>
              </div>
            </div>

            {/* Temperature Swing Comparison */}
            <div className="bg-[var(--chip)] p-4 rounded border border-[var(--line)]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[var(--text)] flex items-center gap-1.5">
                  <SunMedium className="w-3.5 h-3.5 text-[var(--accent)]" />
                  Thermal Dynamic Range (Min → Max)
                </span>
                <span className="text-[var(--muted)]">
                  Lunar Swing: {Math.abs(moon.metrics.tempMaxCelsius - moon.metrics.tempMinCelsius)}°
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-black rounded border border-[var(--line)]">
                  <div className="text-[var(--muted)] uppercase">Earth Extreme Range</div>
                  <div className="text-[var(--accent)] font-semibold mt-0.5">
                    {earth.metrics.tempMinCelsius}°C TO {earth.metrics.tempMaxCelsius}°C
                  </div>
                  <div className="text-[var(--muted)] mt-1">
                    Moderated by atmospheric convective heat circulation.
                  </div>
                </div>
                <div className="p-3 bg-black rounded border border-[var(--line)]">
                  <div className="text-[var(--muted)] uppercase">Moon Extreme Range</div>
                  <div className="text-[var(--accent)] font-semibold mt-0.5">
                    {moon.metrics.tempMinCelsius}°C TO {moon.metrics.tempMaxCelsius}°C
                  </div>
                  <div className="text-[var(--muted)] mt-1">
                    Extreme radiation in vacuum without atmospheric buffer.
                  </div>
                </div>
              </div>
            </div>

            {/* Elevation Difference */}
            <div className="bg-[var(--chip)] p-4 rounded border border-[var(--line)]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[var(--text)] flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[var(--accent)]" />
                  Elevation Datum Offset
                </span>
                <span className="text-[var(--text)] font-medium">Δ {elevationDiff.toLocaleString()} METERS ABSOLUTE</span>
              </div>
              <p className="text-[var(--muted)] mt-1">
                Earth reference: Mean Sea Level. Moon reference: Mean radius sphere (1,737.4 km).
              </p>
            </div>

            {/* Radiation Environment */}
            <div className="bg-[var(--chip)] p-4 rounded border border-[var(--line)]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[var(--text)] flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-[var(--accent)]" />
                  Cosmic &amp; Solar Radiation Exposure
                </span>
                <span className="text-[var(--accent)] font-medium">
                  LUNAR EXPOSURE IS ~{radiationRatio}X TERRESTRIAL DOSAGE
                </span>
              </div>
              <p className="text-[var(--muted)] mt-1">
                Earth’s magnetosphere shields 99.5% of galactic cosmic rays (GCR). Lunar expeditions require regolith or subterranean basalt shielding.
              </p>
            </div>
          </div>

          {/* Thematic Synthesis Note */}
          <div className="p-4 rounded bg-[var(--chip)] border border-[var(--line)]">
            <span className="text-[var(--muted)] uppercase block mb-1">
              Comparative Frontier Synthesis
            </span>
            <p className="text-[var(--text)] leading-relaxed">
              {pair.thematicParallels}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[var(--line)] bg-[var(--chip)] flex items-center justify-between">
          <div className="text-[var(--muted)]">
            Sources: NASA Planetary Data System, LROC, USGS Astrogeology
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-[var(--accent)] bg-black border border-[var(--line)] hover:border-[var(--accent)] rounded transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
