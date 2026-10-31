import React from 'react';

export function Footer() {
  return (
    <footer className="w-full border-t border-[var(--line)] bg-[var(--chip)] py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 font-bold text-[var(--accent)] tracking-tight">
            <img
              src="/assets/space-punks-logo.png"
              alt="Space Punks Logo"
              className="w-5 h-5 rounded-full object-cover shrink-0 border border-[#F5D000]/60"
            />
            <span>Space Punks // MOON &amp; EARTH</span>
          </div>
          <p className="text-[var(--muted)] mt-1 max-w-md">
            A high-contrast comparative laboratory documenting terrestrial and selenological topography, astrophysics invariants, and planetary exploration analogs.
          </p>
        </div>

        <div className="text-[var(--muted)] md:text-right space-y-1">
          <div>
            DATA:{' '}
            <a
              href="https://pds.nasa.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text)] underline hover:opacity-70 transition-opacity duration-300"
            >
              NASA PDS
            </a>
            ,{' '}
            <a
              href="https://astrogeology.usgs.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text)] underline hover:opacity-70 transition-opacity duration-300"
            >
              USGS ASTROGEOLOGY
            </a>
            ,{' '}
            <a
              href="https://www.lroc.asu.edu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text)] underline hover:opacity-70 transition-opacity duration-300"
            >
              LROC
            </a>
            ,{' '}
            <a
              href="https://www.nasa.gov/mission/apollo-11/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--text)] underline hover:opacity-70 transition-opacity duration-300"
            >
              APOLLO ARCHIVES
            </a>
          </div>
          <div>PUBLISHED FOR SCIENTIFIC EDUCATION AND EXPLORATORY SPACE ANALYSIS</div>
        </div>
      </div>
    </footer>
  );
}
