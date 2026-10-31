import React from 'react';
import { Mars3DViewer } from '../../components/mars/Mars3DViewer.jsx';
import { useMarsStore } from '../../store/useMarsStore.js';
import { MARS_LOCATIONS } from '../../data/locations/locations.js';
import { MapPin, Globe } from 'lucide-react';

export const ExplorerPage = () => {
  const {
    selectedLocation,
    triggerFlyToLocation,
    atmosphere,
    solarTime,
  } = useMarsStore();

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] flex flex-col bg-[#04060A] overflow-hidden">
      {/* 3D Mars Engine Viewport takes full height */}
      <div className="flex-1 w-full h-full relative">
        <Mars3DViewer />

        {/* Top Floating Telemetry Overlay (Left) */}
        <div className="absolute top-4 left-4 z-10 max-w-sm flex flex-col gap-2 pointer-events-none">
          <div className="bg-slate-950/85 border border-slate-800/80 rounded-xl p-3.5 shadow-xl backdrop-blur-md pointer-events-auto">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold uppercase">
                <Globe className="w-3.5 h-3.5" />
                Orbital Telemetry HUD
              </span>
              <span>1.524 AU</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1 border-t border-slate-800/70">
              <div>
                <span className="text-slate-400 text-[10px] block">AXIAL OBLIQUITY</span>
                <span className="text-slate-100 font-bold">25.19° Tilt</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">ORBITAL SEASON</span>
                <span className="text-amber-400 font-bold">Ls {solarTime.solarLongitudeLs.toFixed(1)}°</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">DUST EXTINCTION</span>
                <span className="text-slate-100 font-bold">τ {atmosphere.dustOpticalDepth.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">MEAN GRAVITY</span>
                <span className="text-slate-100 font-bold">3.71 m/s²</span>
              </div>
            </div>
          </div>

          {/* Quick Location Nav Accordion */}
          <div className="bg-slate-950/85 border border-slate-800/80 rounded-xl p-3 shadow-xl backdrop-blur-md pointer-events-auto">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2">
              Select Feature Target
            </span>
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
              {MARS_LOCATIONS.map((loc) => {
                const isSelected = selectedLocation?.id === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => triggerFlyToLocation(loc)}
                    className={`px-2.5 py-1.5 rounded-lg text-left text-xs font-mono transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-600/20 border border-amber-500/40 text-amber-300 font-semibold'
                        : 'hover:bg-slate-900 text-slate-300'
                    }`}
                  >
                    <span className="truncate">{loc.name}</span>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                      {loc.elevationKm > 0 ? `+${loc.elevationKm}` : loc.elevationKm} km
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Location Target Dossier (Top-Right) */}
        {selectedLocation && (
          <div className="absolute top-4 right-4 z-10 max-w-xs bg-slate-950/90 border border-slate-800/90 rounded-xl p-4 shadow-2xl backdrop-blur-md hidden sm:block pointer-events-auto">
            <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-400 mb-1">
              <MapPin className="w-3 h-3" />
              <span>Target Coordinates Locked</span>
            </div>
            <h2 className="text-base font-bold text-slate-100 leading-tight">
              {selectedLocation.name}
            </h2>

            <div className="mt-2 text-xs font-mono space-y-1 text-slate-400 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
              <div className="flex justify-between">
                <span>Latitude:</span>
                <span className="text-slate-200">{selectedLocation.lat > 0 ? `${selectedLocation.lat}° N` : `${Math.abs(selectedLocation.lat)}° S`}</span>
              </div>
              <div className="flex justify-between">
                <span>Longitude:</span>
                <span className="text-slate-200">{selectedLocation.lon > 0 ? `${selectedLocation.lon}° E` : `${Math.abs(selectedLocation.lon)}° W`}</span>
              </div>
              <div className="flex justify-between">
                <span>Elevation:</span>
                <span className="text-amber-400 font-bold">
                  {selectedLocation.elevationKm > 0 ? `+${selectedLocation.elevationKm}` : selectedLocation.elevationKm} km datum
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 mt-2.5 leading-relaxed line-clamp-3">
              {selectedLocation.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
