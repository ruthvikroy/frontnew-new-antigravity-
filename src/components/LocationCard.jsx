import React, { useState } from 'react';
import { Globe, Moon, MapPin, Gauge, Thermometer, Radio, Orbit, Clock, Activity, ChevronRight } from 'lucide-react';
import { calculateLunarWeight, calculateLunarJumpHeight } from '../utils/comparator.js';

export function LocationCard({
  location,
  type,
  tempUnit,
  isHovered,
  onFocus,
  onOpenDetails,
  onPlayClick,
}) {
  const [imageError, setImageError] = useState(false);
  const [showGravityCalc, setShowGravityCalc] = useState(false);
  const [userWeight, setUserWeight] = useState(70);

  const isEarth = type === 'earth';

  const convertTemp = (celsius) => {
    if (tempUnit === 'F') {
      return ((celsius * 9) / 5 + 32).toFixed(1);
    }
    return celsius.toFixed(1);
  };

  const accentColor = 'text-[var(--accent)]';
  const borderColor = isHovered
    ? 'border-[var(--accent)] shadow-[0_0_15px_rgba(170,136,255,0.2)]'
    : 'border-[var(--line)] hover:border-[var(--muted)]';

  const feltWeight = isEarth ? userWeight : calculateLunarWeight(userWeight);
  const jumpHeightCm = isEarth ? 45 : calculateLunarJumpHeight(45);

  return (
    <article
      onMouseEnter={() => {
        onFocus();
        if (onPlayClick) onPlayClick();
      }}
      className={`group relative bg-[var(--chip)] border ${borderColor} rounded p-5 flex flex-col justify-between transition-all duration-300 h-full`}
    >
      {/* Top Banner & Image */}
      <div>
        <div className="relative w-full h-44 rounded overflow-hidden bg-black mb-4 border border-[var(--line)]">
          {!imageError && location.imageUrl ? (
            <img
              src={location.imageUrl}
              alt={location.imageAlt}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-black">
              {isEarth ? (
                <Globe className="w-10 h-10 text-[var(--accent)]/40 mb-2 stroke-[1.2]" />
              ) : (
                <Moon className="w-10 h-10 text-[var(--accent)]/40 mb-2 stroke-[1.2]" />
              )}
              <span className="text-[var(--muted)] text-center">
                {location.terrainType}
              </span>
            </div>
          )}

          {/* Type Badge & Coordinates Overlay */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-1 rounded bg-[var(--chip)] border border-[var(--line)] text-[var(--text)]">
            <span className="text-[var(--accent)] font-semibold">{isEarth ? 'EARTH' : 'MOON'}</span>
            <span className="text-[var(--muted)]">•</span>
            <span className="tracking-wider">{location.designation}</span>
          </div>

          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-[var(--chip)] border border-[var(--line)] text-[var(--muted)] flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5 text-[var(--accent)]" />
            <span>{location.coordinatesFormatted}</span>
          </div>
        </div>

        {/* Location Identity */}
        <div className="mb-3">
          <div className="text-[var(--muted)] uppercase tracking-wider mb-0.5">
            {location.region}
          </div>
          <h4 className="font-bold text-[var(--accent)] transition-colors">
            {location.name}
          </h4>
          <p className="text-[var(--muted)] mt-1 line-clamp-2 leading-relaxed">
            {location.summary}
          </p>
        </div>

        {/* Telemetry Metric Matrix */}
        <div className="grid grid-cols-2 gap-2 my-4">
          {/* Elevation */}
          <div className="bg-black border border-[var(--line)] rounded p-2.5">
            <div className="flex items-center gap-1 text-[var(--muted)] uppercase">
              <Orbit className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Elevation</span>
            </div>
            <div className="font-semibold text-[var(--text)] mt-1">
              {location.metrics.elevationMeters > 0 ? '+' : ''}
              {location.metrics.elevationMeters.toLocaleString()} M
            </div>
            <div className="text-[var(--muted)]">
              {isEarth ? 'REL. TO SEA LEVEL' : 'REL. TO LUNAR DATUM'}
            </div>
          </div>

          {/* Temperature Range */}
          <div className="bg-black border border-[var(--line)] rounded p-2.5">
            <div className="flex items-center gap-1 text-[var(--muted)] uppercase">
              <Thermometer className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Temp Range</span>
            </div>
            <div className={`font-semibold mt-1 ${accentColor}`}>
              {convertTemp(location.metrics.tempMinCelsius)}° TO {convertTemp(location.metrics.tempMaxCelsius)}° {tempUnit}
            </div>
            <div className="text-[var(--muted)]">
              SWING: {Math.abs(location.metrics.tempMaxCelsius - location.metrics.tempMinCelsius).toFixed(0)}°
            </div>
          </div>

          {/* Gravity */}
          <div className="bg-black border border-[var(--line)] rounded p-2.5">
            <div className="flex items-center gap-1 text-[var(--muted)] uppercase">
              <Gauge className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Surface Gravity</span>
            </div>
            <div className="font-semibold text-[var(--text)] mt-1">
              {location.metrics.gravityMps2.toFixed(2)} M/S²
            </div>
            <div className="text-[var(--muted)]">
              {isEarth ? '1.000 G' : '0.165 G (1/6TH)'}
            </div>
          </div>

          {/* Atmosphere / Comm Delay */}
          <div className="bg-black border border-[var(--line)] rounded p-2.5">
            <div className="flex items-center gap-1 text-[var(--muted)] uppercase">
              {isEarth ? (
                <>
                  <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Atmosphere</span>
                </>
              ) : (
                <>
                  <Radio className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Comm Delay</span>
                </>
              )}
            </div>
            <div className="font-semibold text-[var(--text)] mt-1">
              {isEarth
                ? `${location.metrics.atmosphereKpa.toLocaleString()} KPA`
                : `${location.metrics.commDelaySeconds}S DELAY`}
            </div>
            <div className="text-[var(--muted)] truncate">
              {isEarth ? 'STANDARD 1 ATM' : 'EXOSPHERE VACUUM'}
            </div>
          </div>
        </div>

        {/* Interactive In-Card Gravity Simulator Toggle */}
        <div className="my-2">
          <button
            onClick={() => setShowGravityCalc(!showGravityCalc)}
            className="w-full py-1.5 px-2 bg-black hover:bg-[var(--line)] border border-[var(--line)] rounded text-[var(--muted)] hover:text-[var(--text)] flex items-center justify-between transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Interactive Gravity Simulator</span>
            </span>
            <span className="text-[var(--accent)]">{showGravityCalc ? 'HIDE' : 'CALCULATE'}</span>
          </button>

          {showGravityCalc && (
            <div className="mt-2 p-3 bg-black border border-[var(--line)] rounded space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[var(--muted)] uppercase">Your Weight (kg):</span>
                <input
                  type="number"
                  min="20"
                  max="250"
                  value={userWeight}
                  onChange={(e) => setUserWeight(Math.max(1, Number(e.target.value) || 0))}
                  className="w-20 px-2 py-0.5 bg-[var(--chip)] border border-[var(--line)] rounded text-right text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[var(--line)]">
                <div className="bg-[var(--chip)] p-2 rounded">
                  <span className="text-[var(--muted)] block uppercase">Felt Weight</span>
                  <span className="text-[var(--text)] font-semibold">{feltWeight} KG</span>
                </div>
                <div className="bg-[var(--chip)] p-2 rounded">
                  <span className="text-[var(--muted)] block uppercase">Est. Jump</span>
                  <span className={`${accentColor} font-semibold`}>{jumpHeightCm} CM</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Action Link */}
      <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between">
        <span className="text-[var(--muted)] truncate max-w-[200px]">
          TERRAIN: <span className="text-[var(--text)]">{location.terrainType}</span>
        </span>
        <button
          onClick={onOpenDetails}
          className="text-[var(--muted)] hover:text-[var(--accent)] underline underline-offset-4 transition-all cursor-pointer flex items-center gap-1"
        >
          <span>Inspect Telemetry</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
}
