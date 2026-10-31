/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Bordered Space Punks editorial articles section with vertical rail, category tabs, overlapping moon image, and sidebar
*/
import React, { useState } from 'react';
import { ArrowUpRight, Clock, Compass, Layers, MapPin, Radio, Sparkles } from 'lucide-react';

const ARTICLES_DATA = [
  {
    id: 'art-1',
    category: 'DEEP SPACE',
    categoryLabel: 'LUNAR CARTOGRAPHY',
    title: 'Mapping the Lunar South Pole: Inside Shackleton Crater’s Permanent Shadow',
    deck: 'New synthetic aperture radar surveys reveal water-ice regolith deposits trapped within cold traps at minus 246 degrees Celsius.',
    author: 'Dr. Elena Rostova',
    affiliation: 'Planetary Science Institute',
    readTime: '6 MIN READ',
    date: 'OCT 26, 2026',
    coordinates: '89.9° S, 0.0° E',
    image: '/assets/aistudio/lunarorb_copernicus_000b6074.jpg',
  },
  {
    id: 'art-2',
    category: 'ASTROBIOLOGY',
    categoryLabel: 'OCEAN WORLDS',
    title: 'The Subsurface Ocean of Europa: Tidal Heating and Hydrothermal Plumes',
    deck: 'Gravitational flexing by Jupiter drives deep hydrothermal vents, synthesizing organic pre-biotic precursors beneath 20 kilometers of ice crust.',
    author: 'Dr. Sarah Chen',
    affiliation: 'Astrobiology Division',
    readTime: '8 MIN READ',
    date: 'OCT 24, 2026',
    coordinates: 'JUPITER SYSTEM // 9.4° N',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'art-3',
    category: 'ENVIRONMENT',
    categoryLabel: 'CLIMATE KINETICS',
    title: 'Atmospheric River Dynamics: Torrential Vapor Belts Over the Pacific Basin',
    deck: 'Satellite lidar tracking shows 1,000-kilometer plumes carrying twenty times the Mississippi River’s discharge in atmospheric suspended moisture.',
    author: 'Marcus Vance',
    affiliation: 'Atmospheric Research Center',
    readTime: '5 MIN READ',
    date: 'OCT 21, 2026',
    coordinates: 'PACIFIC EQUATORIAL',
    image: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'art-4',
    category: 'ANCIENT WORLDS',
    categoryLabel: 'GEOMORPHOLOGY',
    title: 'The Afar Triple Junction: Watching Continental Breakup in Real Time',
    deck: 'Where three tectonic plates tear apart in Ethiopia’s volcanic depression, basalt magma surges toward the surface, birthing a new ocean basin.',
    author: 'Tewodros Kassaye',
    affiliation: 'Addis Ababa Geological Survey',
    readTime: '7 MIN READ',
    date: 'OCT 18, 2026',
    coordinates: '11°30\' N, 41°30\' E',
    image: 'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?auto=format&fit=crop&w=800&q=80',
  },
];

const CATEGORIES = ['ALL', 'DEEP SPACE', 'ENVIRONMENT', 'ASTROBIOLOGY', 'ANCIENT WORLDS'];

export function ArticlesSection({ onSelectArticle = () => {}, onLaunchSimulation = () => {} }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const filteredArticles = selectedCategory === 'ALL'
    ? ARTICLES_DATA
    : ARTICLES_DATA.filter((a) => a.category === selectedCategory);

  return (
    <section
      id="articles"
      aria-label="Editorial Articles Panel"
      className="w-full bg-[#050505] border-b border-white/10 relative overflow-hidden"
    >
      <div className="max-w-[1720px] mx-auto border-x border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-white/10">
          <div className="lg:col-span-1 border-b lg:border-b-0 lg:border-r border-white/10 p-4 lg:py-8 flex lg:flex-col justify-between items-center text-[10px] font-mono-code text-[#888888] tracking-[0.25em] uppercase">
            <span className="text-[#F5D000] font-bold">SEC 02</span>
            <div className="hidden lg:block [writing-mode:vertical-rl] rotate-180 tracking-[0.35em] text-[#888888]">
              DISPATCH &amp; FIELD NOTES
            </div>
            <span>2026</span>
          </div>

          <div className="lg:col-span-8 p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-white/10 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-[10px] font-mono-code uppercase tracking-[0.25em] text-[#F5D000] block mb-2 font-bold">
                  CURATED DISPATCHES
                </span>
                <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-[-0.05em] text-[#F1F1F1] font-editorial leading-none">
                  Articles.
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 text-[10px] font-mono-code uppercase tracking-wider transition-all border ${
                      selectedCategory === cat
                        ? 'border-[#F5D000] bg-[#F5D000] text-black font-bold'
                        : 'border-white/10 text-[#888888] hover:text-[#F1F1F1] hover:border-white/20 bg-[#0A0A0A]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10">
              {filteredArticles.map((article, idx) => (
                <article
                  key={article.id}
                  onClick={() => onSelectArticle(article)}
                  className="bg-[#050505] hover:bg-[#0A0A0A] p-6 sm:p-7 flex flex-col justify-between gap-6 transition-all duration-300 group cursor-pointer relative overflow-hidden"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-[10px] font-mono-code text-[#888888] tracking-widest uppercase">
                      <span className="text-[#F5D000] font-bold">{article.categoryLabel}</span>
                      <span>{article.readTime}</span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold uppercase tracking-tight text-[#F1F1F1] group-hover:text-[#F5D000] transition-colors leading-snug font-editorial">
                      {article.title}
                    </h3>

                    <p className="text-xs text-[#888888] line-clamp-3 leading-relaxed font-editorial">
                      {article.deck}
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-4 flex items-center justify-between text-[10px] font-mono-code text-[#888888]">
                    <div className="flex flex-col">
                      <span className="text-[#F1F1F1] font-bold">{article.author}</span>
                      <span>{article.affiliation}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[#F5D000] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                      <span className="font-bold tracking-wider">READ</span>
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 border border-white/10 bg-[#0A0A0A] p-5 sm:p-7 relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden shrink-0 border border-white/15 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
                <img
                  src="/assets/aistudio/lunarorb_copernicus_000b6074.jpg"
                  alt="Lunar Copernicus crater monochromatic reconnaissance"
                  className="w-full h-full object-cover filter contrast-125 grayscale"
                />
                <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/70" />
                <div className="absolute top-2 left-2 text-[8px] font-mono-code text-[#F5D000] bg-black/70 px-1 border border-[#F5D000]/40">
                  LUNAR RECON
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-[10px] font-mono-code text-[#F5D000] uppercase tracking-widest font-bold">
                  <Sparkles size={12} />
                  <span>SPECIAL ORBITAL FEATURE // MOON HIGH-RESOLUTION ATLAS</span>
                </div>
                <h4 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-[#F1F1F1] font-editorial">
                  Copernicus Crater &amp; Fra Mauro Formation
                </h4>
                <p className="text-xs text-[#888888] leading-relaxed font-editorial">
                  Copernicus, a 93-kilometer impact crater in eastern Oceanus Procellarum, was surveyed during Apollo 12 and Lunar Orbiter 2. Central peaks rise 1.2 kilometers above the sunken crater floor.
                </p>
                <div className="pt-2 flex items-center gap-4">
                  <button
                    onClick={onLaunchSimulation}
                    className="px-3.5 py-1.5 border border-[#F5D000] bg-[#F5D000]/10 hover:bg-[#F5D000] text-[#F5D000] hover:text-black font-mono-code text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    FLY TO COPERNICUS IN 3D
                  </button>
                  <span className="text-[10px] font-mono-code text-[#888888]">
                    COORD: 9.62° N, 20.08° W
                  </span>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-3 p-6 sm:p-8 bg-[#070707] flex flex-col justify-between gap-8">
            <div className="flex flex-col gap-6">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[10px] font-mono-code uppercase tracking-[0.25em] text-[#F5D000] block mb-1 font-bold">
                  EDITOR'S NOTEBOOK
                </span>
                <h3 className="text-sm font-bold uppercase tracking-wide text-[#F1F1F1] font-editorial">
                  The Imperative to Probe
                </h3>
                <p className="text-xs text-[#888888] leading-relaxed mt-2 font-editorial">
                  "Every millimeter of lunar basalt and Martian iron oxide carries the genesis log of our solar system. In exploration, humanity looks directly into its own cosmic ancestry."
                </p>
                <span className="text-[9px] font-mono-code uppercase text-[#F1F1F1]/70 block mt-2 tracking-wider">
                  — K. STRICKLAND, EDITOR IN CHIEF
                </span>
              </div>

              <div className="border-b border-white/10 pb-4 flex flex-col gap-2.5">
                <span className="text-[10px] font-mono-code uppercase tracking-[0.25em] text-[#888888] font-bold">
                  FIELD TELEMETRY
                </span>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono-code">
                  <div className="p-2 border border-white/10 bg-[#0A0A0A]">
                    <span className="text-[#888888] block">MOON DISTANCE</span>
                    <span className="text-[#F1F1F1] font-bold">384,400 KM</span>
                  </div>
                  <div className="p-2 border border-white/10 bg-[#0A0A0A]">
                    <span className="text-[#888888] block">MARS APHELION</span>
                    <span className="text-[#F5D000] font-bold">1.666 AU</span>
                  </div>
                  <div className="p-2 border border-white/10 bg-[#0A0A0A]">
                    <span className="text-[#888888] block">SOLAR WIND</span>
                    <span className="text-[#F1F1F1] font-bold">412 KM/S</span>
                  </div>
                  <div className="p-2 border border-white/10 bg-[#0A0A0A]">
                    <span className="text-[#888888] block">ISS ORBIT VEL</span>
                    <span className="text-[#F1F1F1] font-bold">7.66 KM/S</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono-code uppercase tracking-[0.25em] text-[#888888] font-bold">
                  ARCHIVAL INDICES
                </span>
                <ul className="text-xs font-mono-code text-[#888888] space-y-1.5">
                  <li className="flex items-center justify-between hover:text-[#F1F1F1] cursor-pointer">
                    <span>• VOYAGER INTERSTELLAR ARCHIVE</span>
                    <span className="text-[#F5D000]">1977</span>
                  </li>
                  <li className="flex items-center justify-between hover:text-[#F1F1F1] cursor-pointer">
                    <span>• APOLLO 11 TRANQUILITY BASE</span>
                    <span className="text-[#F5D000]">1969</span>
                  </li>
                  <li className="flex items-center justify-between hover:text-[#F1F1F1] cursor-pointer">
                    <span>• HUBBLE DEEP FIELD SOUTH</span>
                    <span className="text-[#F5D000]">1998</span>
                  </li>
                  <li className="flex items-center justify-between hover:text-[#F1F1F1] cursor-pointer">
                    <span>• JAMES WEBB COSMIC INFRARED</span>
                    <span className="text-[#F5D000]">2022</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-4 border border-[#F5D000]/40 bg-[#F5D000]/5 text-center flex flex-col gap-2">
              <span className="text-[9px] font-mono-code uppercase tracking-[0.2em] text-[#F5D000] font-bold">
                TEAM SPACE PUNKS // FIELD REPORT
              </span>
              <p className="text-[11px] text-[#F1F1F1] font-editorial">
                Support planetary science &amp; extreme environmental fieldwork worldwide.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

/* --- End of ArticlesSection.jsx --- */
