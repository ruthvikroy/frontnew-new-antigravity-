import React, { useRef, useEffect } from 'react';
import { LocationCard } from './LocationCard.jsx';
import { ArrowLeftRight, Layers, Sliders, ChevronDown, ChevronUp } from 'lucide-react';

export function SideBySideDashboard({
  pairs,
  tempUnit,
  syncScroll,
  focusedPairId,
  onFocusPair,
  onOpenDetails,
  onResetFilters,
  onPlayClick,
}) {
  const earthColRef = useRef(null);
  const moonColRef = useRef(null);
  const isSyncingRef = useRef(false);

  // Synchronized scrolling logic for dual column mode
  useEffect(() => {
    if (!syncScroll) return;
    const earthCol = earthColRef.current;
    const moonCol = moonColRef.current;
    if (!earthCol || !moonCol) return;

    const handleEarthScroll = () => {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;
      moonCol.scrollTop = earthCol.scrollTop;
      requestAnimationFrame(() => {
        isSyncingRef.current = false;
      });
    };

    const handleMoonScroll = () => {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;
      earthCol.scrollTop = moonCol.scrollTop;
      requestAnimationFrame(() => {
        isSyncingRef.current = false;
      });
    };

    earthCol.addEventListener('scroll', handleEarthScroll, { passive: true });
    moonCol.addEventListener('scroll', handleMoonScroll, { passive: true });

    return () => {
      earthCol.removeEventListener('scroll', handleEarthScroll);
      moonCol.removeEventListener('scroll', handleMoonScroll);
    };
  }, [syncScroll]);

  // Scroll intersection observer to sync focused vector on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            const pairId = entry.target.getAttribute('data-pair-id');
            const matched = pairs.find((p) => p.id === pairId);
            if (matched) {
              onFocusPair(matched);
            }
          }
        });
      },
      {
        rootMargin: '-10% 0px -40% 0px',
        threshold: [0.4],
      }
    );

    const elements = document.querySelectorAll('[data-pair-container="true"]');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pairs, onFocusPair]);

  const scrollToPair = (index) => {
    const elements = document.querySelectorAll('[data-pair-container="true"]');
    if (elements[index]) {
      elements[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (pairs.length === 0) {
    return (
      <div className="w-full py-24 px-6 text-center">
        <div className="max-w-md mx-auto bg-[var(--chip)] border border-[var(--line)] rounded p-8">
          <Layers className="w-10 h-10 text-[var(--muted)] mx-auto mb-3" />
          <h3 className="font-bold text-[var(--accent)] mb-2">No Analog Pairs Found</h3>
          <p className="text-[var(--muted)] mb-6">
            No locations matched your filter or search query. Adjust the filters to explore comparative telemetry.
          </p>
          <button
            onClick={onResetFilters}
            className="px-4 py-2 bg-[var(--line)] hover:bg-[var(--line)]/80 text-[var(--accent)] rounded transition-colors cursor-pointer border border-[var(--line)]"
          >
            Reset All Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <section id="dashboard" className="w-full max-w-7xl mx-auto px-6 py-8 relative">
      {/* Column Headers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-4 pb-3 border-b border-[var(--line)]">
        <div className="lg:col-span-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_#aa88ff]" />
            <h3 className="font-bold text-[var(--accent)] tracking-tight">
              Terrestrial Stations (Earth)
            </h3>
          </div>
          <span className="text-[var(--muted)]">
            Datum: Mean Sea Level
          </span>
        </div>

        <div className="hidden lg:flex lg:col-span-2 items-center justify-center">
          <div className="tracking-widest text-[var(--accent)] uppercase text-center">
            Side-By-Side Analogs
          </div>
        </div>

        <div className="lg:col-span-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_#aa88ff]" />
            <h3 className="font-bold text-[var(--accent)] tracking-tight">
              Selenological Sites (Moon)
            </h3>
          </div>
          <span className="text-[var(--muted)]">
            Datum: 1,737.4 KM Sphere
          </span>
        </div>
      </div>

      {/* Paired Location Stream with Scroll Animations */}
      <div className="space-y-6">
        {pairs.map((pair, index) => {
          const isFocused = pair.id === focusedPairId;
          const elevDelta = Math.abs(pair.earth.metrics.elevationMeters - pair.moon.metrics.elevationMeters);
          const tempDelta = Math.abs(
            Math.abs(pair.earth.metrics.tempMaxCelsius - pair.earth.metrics.tempMinCelsius) -
            Math.abs(pair.moon.metrics.tempMaxCelsius - pair.moon.metrics.tempMinCelsius)
          );

          return (
            <div
              key={pair.id}
              data-pair-container="true"
              data-pair-id={pair.id}
              className={`relative rounded transition-all duration-500 p-2 sm:p-4 border ${
                isFocused
                  ? 'bg-[var(--chip)]/60 border-[var(--accent)] shadow-[0_4px_24px_rgba(0,0,0,0.8)]'
                  : 'bg-black/40 border-[var(--line)] hover:border-[var(--muted)]'
              }`}
            >
              {/* Pair Thematic Index Kicker */}
              <div className="flex items-center justify-between px-2 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-[var(--accent)] font-semibold">
                    {(index + 1).toString().padStart(2, '0')}.
                  </span>
                  <span className="font-semibold text-[var(--text)] uppercase tracking-wider">
                    {pair.title}
                  </span>
                  <span className="text-[var(--muted)] hidden sm:inline">•</span>
                  <span className="text-[var(--muted)] hidden sm:inline">{pair.categoryLabel}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-1">
                    {index > 0 && (
                      <button
                        onClick={() => scrollToPair(index - 1)}
                        className="p-1 text-[var(--muted)] hover:text-[var(--accent)] rounded transition-colors cursor-pointer"
                        title="Scroll to previous location"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {index < pairs.length - 1 && (
                      <button
                        onClick={() => scrollToPair(index + 1)}
                        className="p-1 text-[var(--muted)] hover:text-[var(--accent)] rounded transition-colors cursor-pointer"
                        title="Scroll to next location"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => onOpenDetails(pair)}
                    className="text-[var(--accent)] hover:underline flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Compare Metrics</span>
                  </button>
                </div>
              </div>

              {/* Side-by-Side Dual Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* Earth Column (Left) */}
                <div className="lg:col-span-5 h-full">
                  <LocationCard
                    location={pair.earth}
                    type="earth"
                    tempUnit={tempUnit}
                    isHovered={isFocused}
                    onFocus={() => onFocusPair(pair)}
                    onOpenDetails={() => onOpenDetails(pair)}
                    onPlayClick={onPlayClick}
                  />
                </div>

                {/* Central Comparative Connector Spine */}
                <div className="lg:col-span-2 flex flex-col items-center justify-center py-4 lg:py-0">
                  <div className="w-full flex lg:flex-col items-center justify-center gap-3 bg-[var(--chip)] border border-[var(--line)] rounded p-3 shadow-lg">
                    <div className="text-center">
                      <span className="text-[var(--muted)] block uppercase">
                        Elevation Delta
                      </span>
                      <span className="font-semibold text-[var(--text)]">
                        Δ {elevDelta.toLocaleString()} M
                      </span>
                    </div>

                    <div className="hidden lg:block w-full h-px bg-[var(--line)]" />

                    <div className="text-center">
                      <span className="text-[var(--muted)] block uppercase">
                        Thermal Variance
                      </span>
                      <span className="font-semibold text-[var(--accent)]">
                        Δ {tempDelta.toFixed(0)}°C SWING
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenDetails(pair)}
                      className="mt-1 px-3 py-1 text-[var(--text)] hover:text-[var(--accent)] bg-black hover:bg-[var(--line)] rounded border border-[var(--line)] hover:border-[var(--accent)] transition-colors flex items-center gap-1 cursor-pointer"
                      title="Inspect side-by-side metric differences"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      <span>Diff</span>
                    </button>
                  </div>
                </div>

                {/* Moon Column (Right) */}
                <div className="lg:col-span-5 h-full">
                  <LocationCard
                    location={pair.moon}
                    type="moon"
                    tempUnit={tempUnit}
                    isHovered={isFocused}
                    onFocus={() => onFocusPair(pair)}
                    onOpenDetails={() => onOpenDetails(pair)}
                    onPlayClick={onPlayClick}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
