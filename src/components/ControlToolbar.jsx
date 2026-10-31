import React from 'react';
import { Search, ArrowUpDown, SlidersHorizontal, X } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Analog Pairs' },
  { id: 'extreme-terrains', label: 'Extreme Terrains' },
  { id: 'deep-basins', label: 'Deep Basins' },
  { id: 'research-bases', label: 'Research Bases' },
  { id: 'volcanic-subterranean', label: 'Volcanic Tubes' },
  { id: 'historic-sites', label: 'Historic Sites' },
];

export function ControlToolbar({
  category,
  onSelectCategory,
  criterion,
  onSelectCriterion,
  direction,
  onToggleDirection,
  searchQuery,
  onSearchChange,
  totalCount,
  filteredCount,
  tempUnit,
  onToggleTempUnit,
}) {
  return (
    <div className="w-full bg-[var(--background)] border-y border-[var(--line)] px-6 py-3.5 sticky top-[57px] z-30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                category === cat.id
                  ? 'bg-[var(--chip)] text-[var(--accent)] font-semibold border border-[var(--accent)] shadow-[0_0_8px_rgba(170,136,255,0.25)]'
                  : 'bg-[var(--chip)] text-[var(--muted)] hover:text-[var(--text)] border border-[var(--line)] hover:border-[var(--muted)]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search, Sort, and Unit Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-56 min-w-[160px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="FILTER LOCATIONS..."
              className="w-full pl-8 pr-7 py-1.5 bg-[var(--chip)] border border-[var(--line)] rounded text-[var(--text)] placeholder:[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)] cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Sort Filter Selector */}
          <div className="flex items-center gap-1.5 bg-[var(--chip)] border border-[var(--line)] rounded px-2.5 py-1">
            <SlidersHorizontal className="w-3 h-3 text-[var(--accent)] shrink-0" />
            <label htmlFor="sort-criterion" className="sr-only">
              Sort by
            </label>
            <select
              id="sort-criterion"
              value={criterion}
              onChange={(e) => onSelectCriterion(e.target.value)}
              className="bg-transparent text-[var(--text)] focus:outline-none cursor-pointer pr-1"
            >
              <option value="elevation" className="bg-[#1c1c1c] text-[#dddddd]">Elevation Delta</option>
              <option value="temperature-swing" className="bg-[#1c1c1c] text-[#dddddd]">Temp Extreme Swing</option>
              <option value="latitude" className="bg-[#1c1c1c] text-[#dddddd]">Latitude</option>
              <option value="gravity-ratio" className="bg-[#1c1c1c] text-[#dddddd]">Gravity Contrast</option>
              <option value="name" className="bg-[#1c1c1c] text-[#dddddd]">Title Alphabetical</option>
            </select>
          </div>

          {/* Sort Direction Toggle Button */}
          <button
            onClick={onToggleDirection}
            className="p-1.5 bg-[var(--chip)] border border-[var(--line)] rounded text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-colors cursor-pointer"
            title={`Direction: ${direction === 'asc' ? 'Ascending' : 'Descending'}`}
            aria-label={`Toggle sort direction. Currently ${direction === 'asc' ? 'Ascending' : 'Descending'}`}
          >
            <ArrowUpDown className={`w-3.5 h-3.5 transition-transform ${direction === 'asc' ? 'rotate-180' : ''}`} />
          </button>

          {/* Temp Unit Toggle */}
          <button
            onClick={onToggleTempUnit}
            className="px-2.5 py-1 bg-[var(--chip)] border border-[var(--line)] rounded text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors cursor-pointer"
            title="Toggle temperature unit"
          >
            °{tempUnit}
          </button>

          {/* Counter */}
          <div className="text-[var(--muted)] pl-1 whitespace-nowrap">
            SHOWING <span className="text-[var(--text)] font-semibold">{filteredCount}</span> OF {totalCount}
          </div>
        </div>
      </div>
    </div>
  );
}
