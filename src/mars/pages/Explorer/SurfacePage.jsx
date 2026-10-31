import React, { useState } from 'react';
import { Mars3DViewer } from '../../components/mars/Mars3DViewer.jsx';
import { useMarsStore } from '../../store/useMarsStore.js';
import { MARS_LOCATIONS } from '../../data/locations/locations.js';
import {
  Search,
  MapPin,
  Radio,
  BookOpen,
} from 'lucide-react';

export const SurfacePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const { selectedLocation, triggerFlyToLocation } = useMarsStore();

  const activeLoc = selectedLocation || MARS_LOCATIONS[0];

  const filteredLocations = MARS_LOCATIONS.filter((loc) => {
    const matchesSearch =
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.missionInfo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || loc.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="w-full min-h-[calc(100vh-3.5rem)] flex flex-col lg:flex-row bg-[#04060A] border-b border-slate-800">
      {/* Left Column: Interactive 3D Mars Surface Focus (Flex-1) */}
      <div className="w-full lg:w-3/5 h-[50vh] lg:h-[calc(100vh-3.5rem)] relative border-b lg:border-b-0 lg:border-r border-slate-800">
        <Mars3DViewer />

        {/* Floating Active Target Badge */}
        <div className="absolute top-4 left-4 z-10 bg-slate-950/90 border border-amber-500/40 rounded-xl px-4 py-2.5 shadow-xl backdrop-blur-md flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block">
              Active Surface Target
            </span>
            <span className="text-sm font-bold text-slate-100 font-mono">
              {activeLoc.name}
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: Geographical Atlas & Location Dossier (40% width) */}
      <div className="w-full lg:w-2/5 flex flex-col h-auto lg:h-[calc(100vh-3.5rem)] overflow-y-auto p-5 lg:p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider">
            <span>Geographical Atlas</span>
            <span className="text-slate-700">·</span>
            <span>Surface Exploration</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 mt-1">
            Martian Surface Geography
          </h1>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            Select a geological region to highlight its surface coordinates and fly the 3D planetary
            view directly to its location.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search craters, volcanoes, canyons, missions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 font-mono"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-[11px] font-mono">
            {['all', 'volcano', 'canyon', 'crater', 'plain', 'polar'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-2.5 py-1 rounded-md capitalize whitespace-nowrap transition-colors ${
                  selectedType === type
                    ? 'bg-amber-600/20 text-amber-300 border border-amber-500/40 font-medium'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Location Selection Cards List */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {filteredLocations.map((loc) => {
            const isSelected = activeLoc.id === loc.id;
            return (
              <button
                key={loc.id}
                onClick={() => triggerFlyToLocation(loc)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-amber-500/60 shadow-md'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      loc.type === 'volcano'
                        ? 'bg-red-400'
                        : loc.type === 'canyon'
                        ? 'bg-amber-400'
                        : loc.type === 'crater'
                        ? 'bg-orange-400'
                        : loc.type === 'polar'
                        ? 'bg-cyan-300'
                        : 'bg-emerald-400'
                    }`}
                  />
                  <div className="truncate">
                    <span className="text-xs font-semibold text-slate-200 block truncate">
                      {loc.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {loc.lat > 0 ? `${loc.lat.toFixed(1)}°N` : `${Math.abs(loc.lat).toFixed(1)}°S`},{' '}
                      {loc.lon > 0 ? `${loc.lon.toFixed(1)}°E` : `${Math.abs(loc.lon).toFixed(1)}°W`}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 ml-3">
                  <span className="text-xs font-mono font-bold text-amber-400 block">
                    {loc.elevationKm > 0 ? `+${loc.elevationKm}` : loc.elevationKm} km
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 uppercase">
                    {loc.type}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Location Full Dossier */}
        <div className="bg-slate-950/90 border border-slate-800/90 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold">
                Geological Dossier
              </span>
              <h2 className="text-xl font-bold text-slate-100 mt-0.5">{activeLoc.name}</h2>
            </div>
            <div className="text-right font-mono">
              <span className="text-xs text-slate-400 block">MOLA ELEVATION</span>
              <span className="text-lg font-bold text-amber-400">
                {activeLoc.elevationKm > 0 ? `+${activeLoc.elevationKm}` : activeLoc.elevationKm} km
              </span>
            </div>
          </div>

          {/* Coordinates Strip */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-400 block text-[10px]">AEROCENTRIC LATITUDE</span>
              <span className="text-slate-200 font-semibold">
                {activeLoc.lat > 0 ? `${activeLoc.lat}° North` : `${Math.abs(activeLoc.lat)}° South`}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">AEROCENTRIC LONGITUDE</span>
              <span className="text-slate-200 font-semibold">
                {activeLoc.lon > 0 ? `${activeLoc.lon}° East` : `${Math.abs(activeLoc.lon)}° West`}
              </span>
            </div>
          </div>

          {/* Geographical Description */}
          <div>
            <span className="text-xs font-mono uppercase text-slate-400 block mb-1">
              Geographical Description
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">{activeLoc.description}</p>
          </div>

          {/* Geological Significance */}
          <div>
            <span className="text-xs font-mono uppercase text-slate-400 block mb-1">
              Geological Significance
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeLoc.geologicalSignificance}
            </p>
          </div>

          {/* Mission & Source Data */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs font-mono">
            <div className="flex items-start gap-2">
              <Radio className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 text-[10px] block">MISSIONS & SOUNDINGS</span>
                <span className="text-slate-300 text-[11px] leading-tight block">
                  {activeLoc.missionInfo}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 pt-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 text-[10px] block">SCIENTIFIC CITATION</span>
                <span className="text-slate-400 text-[10px] leading-tight block">
                  {activeLoc.sourceReference}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
