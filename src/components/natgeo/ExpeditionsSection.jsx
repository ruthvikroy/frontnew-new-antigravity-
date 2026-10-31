/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Full-width Space Punks interactive atlas and expeditions section with torn paper separator and grayscale world map
*/
import React, { useState } from 'react';
import { Compass, MapPin, Globe, ChevronLeft, ChevronRight, ArrowUpRight, Wind, ShieldAlert, Sparkles } from 'lucide-react';

const EXPEDITIONS = [
  {
    id: 'exp-mariana',
    name: 'Mariana Trench // Challenger Deep',
    country: 'Western Pacific Ocean',
    coordinates: '11°22\'48" N, 142°35\'24" E',
    category: 'HADAL ZONE HYDROSTATICS',
    elevation: '-10,994 M',
    temperature: '1.2° C',
    pressure: '1,086 BAR',
    lead: 'Dr. Hiroshi Tanaka',
    team: 'Submersible DeepSea Alpha-4',
    summary: 'Probing the deepest tectonic trench on Earth. Hadal zone barophilic microbes survive under extreme hydrostatic pressure, metabolizing hydrogen sulfide along subduction fault fissures.',
    mapPos: { x: 80, y: 55 },
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'exp-atacama',
    name: 'Atacama Desert // ALMA Array',
    country: 'Antofagasta Region, Chile',
    coordinates: '23°01\'22" S, 67°45\'18" W',
    category: 'SUBMILLIMETER ASTROPHYSICS',
    elevation: '5,050 M',
    temperature: '-8.5° C',
    pressure: '550 MBAR',
    lead: 'Dr. Sofia Morales',
    team: 'ALMA Scientific Consortium',
    summary: 'The driest non-polar desert on Earth hosts 66 high-precision radio antennas on the Chajnantor Plateau, imaging nascent protoplanetary disks and prebiotic molecules across interstellar nurseries.',
    mapPos: { x: 32, y: 72 },
    heroImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'exp-svalbard',
    name: 'Svalbard Global Seed Vault',
    country: 'Spitsbergen Island, Norway',
    coordinates: '78°14\'09" N, 15°29\'29" E',
    category: 'CRYOGENIC BIOPRESERVATION',
    elevation: '130 M',
    temperature: '-18.0° C',
    pressure: '1,008 MBAR',
    lead: 'Dr. Erik Lindström',
    team: 'Nordic Genetic Resource Centre',
    summary: 'Buried deep within sandstone permafrost mountain rock, the vault protects over 1.2 million distinct agricultural crop seed varieties against catastrophic global biocidal events.',
    mapPos: { x: 52, y: 14 },
    heroImage: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'exp-danakil',
    name: 'Danakil Depression // Dallol Springs',
    country: 'Afar Region, Ethiopia',
    coordinates: '14°14\'30" N, 40°18\'00" E',
    category: 'EXTREMOPHILE GEOCHEMISTRY',
    elevation: '-125 M',
    temperature: '48.0° C',
    pressure: '1,024 MBAR',
    lead: 'Dr. Amina Kebede',
    team: 'East African Rift Project',
    summary: 'A hyperacidic, hyper-saline hydrothermal basin where continental tectonic plates tear apart. Neon-green sulfuric chimneys provide a terrestrial geochemical analog for early Archean Earth and ancient Mars.',
    mapPos: { x: 58, y: 52 },
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'exp-chicxulub',
    name: 'Chicxulub Impact Crater',
    country: 'Yucatán Peninsula, Mexico',
    coordinates: '21°24\'00" N, 89°31\'00" W',
    category: 'PALEOGENE ASTROBLEME',
    elevation: '0 M (Sub-Surface Ring)',
    temperature: '28.0° C',
    pressure: '1,013 MBAR',
    lead: 'Dr. Carlos Mendoza',
    team: 'International Ocean Discovery',
    summary: 'Scientific drilling into the 180-kilometer submerged impact structure where a 12-kilometer asteroid struck Earth 66 million years ago, ending the Mesozoic Era and triggering catastrophic climate winter.',
    mapPos: { x: 25, y: 48 },
    heroImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'exp-mcmurdo',
    name: 'McMurdo Dry Valleys',
    country: 'Victoria Land, Antarctica',
    coordinates: '77°50\'50" S, 166°40\'00" E',
    category: 'POLAR HYPER-ARID ANALOG',
    elevation: '750 M',
    temperature: '-34.0° C',
    pressure: '985 MBAR',
    lead: 'Dr. Rebecca Thorne',
    team: 'US Antarctic Program Deep Coring',
    summary: 'The driest and coldest desert environment on our planet. Katabatic winds exceeding 320 km/h strip snow cover, exposing endolithic cyanobacteria living shielded inside porous sandstone boulders.',
    mapPos: { x: 86, y: 92 },
    heroImage: 'https://images.unsplash.com/photo-1516655855035-d5215bcb5604?auto=format&fit=crop&w=1200&q=80',
  },
];

export function ExpeditionsSection({ onSelectExpedition = () => {} }) {
  const [activeExpIndex, setActiveExpIndex] = useState(0);
  const activeExp = EXPEDITIONS[activeExpIndex];

  const handlePrev = () => {
    setActiveExpIndex((prev) => (prev > 0 ? prev - 1 : EXPEDITIONS.length - 1));
  };

  const handleNext = () => {
    setActiveExpIndex((prev) => (prev < EXPEDITIONS.length - 1 ? prev + 1 : 0));
  };

  return (
    <section
      id="expeditions"
      aria-label="Expeditions and Interactive Atlas"
      className="relative w-full bg-[#050505] text-[#F1F1F1] select-none overflow-hidden"
    >
      <div className="relative w-full h-8 sm:h-12 bg-white torn-paper-edge z-20 shadow-[0_15px_30px_rgba(0,0,0,0.8)] -mt-1" />

      <div className="relative w-full bg-[#050505] border-b border-white/10 pt-8 pb-12 sm:pb-16">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-8 border-x border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/10 pb-8 mb-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[#F5D000] text-[10px] font-mono-code uppercase tracking-[0.25em] font-bold">
                <span className="w-1.5 h-1.5 bg-[#F5D000]" />
                <span>SECTION 04 // GLOBAL EXPEDITIONS &amp; FIELD ATLAS</span>
              </div>
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-[-0.05em] text-[#F1F1F1] font-editorial leading-none">
                Interactive Atlas.
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-2 text-[10px] font-mono-code text-[#888888]">
                <span className="text-[#F5D000] font-bold">LOCATION {activeExpIndex + 1} OF {EXPEDITIONS.length}</span>
                <span>•</span>
                <span>GLOBAL TELEMETRY ACTIVE</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  className="p-2 border border-white/10 bg-[#0A0A0A] hover:border-white/30 text-[#888888] hover:text-[#F1F1F1] transition-colors"
                  aria-label="Previous Expedition"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 border border-white/10 bg-[#0A0A0A] hover:border-white/30 text-[#888888] hover:text-[#F1F1F1] transition-colors"
                  aria-label="Next Expedition"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="relative w-full aspect-[21/9] min-h-[360px] sm:min-h-[460px] border border-white/10 bg-[#070707] overflow-hidden flex items-center justify-center">
            <svg
              className="absolute inset-0 w-full h-full opacity-35"
              viewBox="0 0 1000 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="1000" height="500" fill="url(#grid)" />

              <line x1="0" y1="250" x2="1000" y2="250" stroke="#F5D000" strokeWidth="0.75" strokeDasharray="4 4" opacity="0.6" />
              <line x1="500" y1="0" x2="500" y2="500" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" strokeDasharray="3 3" />

              <path
                d="M 120,90 Q 220,70 280,120 T 320,240 T 260,320 T 150,220 Z"
                fill="rgba(255,255,255,0.12)"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1"
              />
              <path
                d="M 280,260 Q 340,290 320,400 T 260,460 T 240,320 Z"
                fill="rgba(255,255,255,0.12)"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1"
              />
              <path
                d="M 460,110 Q 520,70 580,120 T 520,220 T 450,180 Z"
                fill="rgba(255,255,255,0.12)"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1"
              />
              <path
                d="M 470,200 Q 560,220 540,360 T 480,410 T 450,260 Z"
                fill="rgba(255,255,255,0.12)"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1"
              />
              <path
                d="M 580,80 Q 750,60 880,140 T 820,260 T 640,220 Z"
                fill="rgba(255,255,255,0.12)"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1"
              />
              <path
                d="M 760,310 Q 860,320 840,400 T 750,400 Z"
                fill="rgba(255,255,255,0.12)"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1"
              />
              <path
                d="M 150,470 Q 500,450 850,470 T 500,490 Z"
                fill="rgba(255,255,255,0.08)"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
              />
            </svg>

            {EXPEDITIONS.map((exp, idx) => {
              const isSelected = idx === activeExpIndex;
              return (
                <button
                  key={exp.id}
                  onClick={() => setActiveExpIndex(idx)}
                  style={{ left: `${exp.mapPos.x}%`, top: `${exp.mapPos.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
                >
                  <div className="relative flex items-center justify-center">
                    <span
                      className={`w-6 h-6 rounded-full absolute transition-all duration-300 ${
                        isSelected
                          ? 'border border-[#F5D000] scale-125 animate-ping bg-[#F5D000]/20'
                          : 'border border-white/30 group-hover:border-[#F5D000]'
                      }`}
                    />
                    <span
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        isSelected ? 'bg-[#F5D000] shadow-[0_0_12px_#F5D000]' : 'bg-white group-hover:bg-[#F5D000]'
                      }`}
                    />
                  </div>
                  <span
                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-1.5 py-0.5 whitespace-nowrap text-[8px] font-mono-code uppercase tracking-wider border transition-all ${
                      isSelected
                        ? 'border-[#F5D000] bg-black text-[#F5D000] font-bold shadow-lg'
                        : 'border-white/10 bg-black/80 text-[#888888] group-hover:text-white'
                    }`}
                  >
                    {exp.name.split('//')[0].trim()}
                  </span>
                </button>
              );
            })}

            <div className="absolute top-4 left-4 border border-white/10 bg-[#050505]/90 px-3 py-2 text-[9px] font-mono-code text-[#888888] flex items-center gap-3">
              <span className="text-[#F5D000] font-bold">TERRESTRIAL GRATICULE</span>
              <span>WGS-84 PROJECTION</span>
              <span className="text-white/40">1:50,000,000</span>
            </div>

            <div className="absolute bottom-4 right-4 z-20">
              <button
                onClick={() => onSelectExpedition(activeExp)}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#F5D000] bg-black/90 hover:bg-[#F5D000] text-[#F5D000] hover:text-black transition-all duration-500 flex flex-col items-center justify-center text-center p-2 cursor-pointer shadow-[0_0_30px_rgba(245,208,0,0.3)] group"
              >
                <Compass size={22} className="group-hover:rotate-45 transition-transform duration-500 mb-1" />
                <span className="text-[9px] font-mono-code font-black uppercase tracking-widest leading-tight">
                  LAUNCH<br />EXPEDITION
                </span>
              </button>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-px bg-white/10 border border-white/10">
            <div className="lg:col-span-8 p-6 sm:p-8 bg-[#070707] flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between text-[10px] font-mono-code text-[#888888] tracking-widest uppercase">
                  <span className="text-[#F5D000] font-bold">{activeExp.category}</span>
                  <span>{activeExp.country}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#F1F1F1] font-editorial">
                  {activeExp.name}
                </h3>

                <p className="text-xs sm:text-sm text-[#888888] leading-relaxed font-editorial">
                  {activeExp.summary}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-white/10 text-[10px] font-mono-code">
                <div className="p-2.5 border border-white/10 bg-[#050505]">
                  <span className="text-[#888888] block">COORDINATES</span>
                  <span className="text-[#F1F1F1] font-bold truncate block">{activeExp.coordinates}</span>
                </div>
                <div className="p-2.5 border border-white/10 bg-[#050505]">
                  <span className="text-[#888888] block">ELEVATION</span>
                  <span className="text-[#F5D000] font-bold block">{activeExp.elevation}</span>
                </div>
                <div className="p-2.5 border border-white/10 bg-[#050505]">
                  <span className="text-[#888888] block">AMBIENT TEMP</span>
                  <span className="text-[#F1F1F1] font-bold block">{activeExp.temperature}</span>
                </div>
                <div className="p-2.5 border border-white/10 bg-[#050505]">
                  <span className="text-[#888888] block">PRESSURE</span>
                  <span className="text-[#F1F1F1] font-bold block">{activeExp.pressure}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 sm:p-8 bg-[#090909] flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-mono-code uppercase tracking-widest text-[#888888] font-bold">
                  FIELD TEAM LEADER
                </span>
                <div className="flex flex-col">
                  <span className="text-base font-bold text-[#F1F1F1] font-editorial">{activeExp.lead}</span>
                  <span className="text-xs text-[#888888] font-editorial">{activeExp.team}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => onSelectExpedition(activeExp)}
                  className="w-full py-3 border border-[#F5D000] bg-[#F5D000] text-black hover:bg-black hover:text-[#F5D000] text-xs font-mono-code font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(245,208,0,0.2)]"
                >
                  <span>VIEW FULL FIELD DOSSIER</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- End of ExpeditionsSection.jsx --- */
