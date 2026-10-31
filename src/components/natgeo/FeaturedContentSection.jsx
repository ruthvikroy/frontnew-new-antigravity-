/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Staggered Space Punks editorial grid featuring asteroid article, Mars series, videos, lava galleries, and nebula discovery
*/
import React, { useState } from 'react';
import { Play, ArrowUpRight, Camera, Film, Layers, Radio, Sparkles, Compass } from 'lucide-react';

export function FeaturedContentSection({
  onOpenArticleModal = () => {},
  onOpenVideoModal = () => {},
  onOpenGalleryModal = () => {},
  onOpenMarsLab = () => {},
}) {
  const [videoCategory, setVideoCategory] = useState('ALL');

  return (
    <section
      id="featured"
      aria-label="Featured Editorial Grid"
      className="w-full bg-[#050505] border-b border-white/10 select-none"
    >
      <div className="max-w-[1720px] mx-auto border-x border-white/10">
        <div className="border-b border-white/10 px-6 sm:px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-[#F5D000]" />
            <span className="text-[10px] font-mono-code uppercase tracking-[0.25em] text-[#F1F1F1] font-bold">
              SECTION 03 // FEATURED DOSSIERS &amp; VISUAL MEDIA
            </span>
          </div>
          <span className="text-[10px] font-mono-code text-[#888888] uppercase tracking-widest hidden sm:inline">
            STAGGERED EDITORIAL MATRIX
          </span>
        </div>

        <div className="border-b border-white/10 p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 group">
          <div className="flex-1 flex flex-col justify-between gap-6 w-full">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-[10px] font-mono-code text-[#888888] tracking-widest uppercase">
                <span className="text-[#F5D000] font-bold">FEATURED ARTICLE // ASTEROIDS</span>
                <span>OCT 28, 2026 • 7 MIN READ</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-[-0.04em] text-[#F1F1F1] group-hover:text-[#F5D000] transition-colors leading-tight font-editorial">
                Is an Interstellar Asteroid Trapped Near Jupiter? Get the Facts.
              </h2>

              <p className="text-xs sm:text-sm text-[#888888] leading-relaxed max-w-2xl font-editorial">
                Retrograde co-orbital asteroid (514107) Kaʻepaokaʻawela orbits backward relative to Jupiter, locked in a stable 1:1 resonance. High-fidelity numerical simulations demonstrate this celestial nomad could not have originated from our Solar System’s protoplanetary disc, making it the first permanent interstellar immigrant ever identified.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10">
              <span className="text-[10px] font-mono-code text-[#888888] uppercase tracking-wider">
                ORBIT INCLINATION: 163.0° • ECCENTRICITY: 0.38
              </span>
              <button
                onClick={() => onOpenArticleModal({
                  title: 'Is an Interstellar Asteroid Trapped Near Jupiter? Get the Facts.',
                  author: 'Dr. Marcus Vance',
                  date: 'OCTOBER 28, 2026',
                  image: '/assets/aistudio/Asteroid_Bennu-1_f1af1811.jpeg',
                  category: 'DEEP SPACE EXPLORATION',
                })}
                className="px-4 py-2 border border-[#F5D000] bg-[#F5D000] text-black hover:bg-black hover:text-[#F5D000] text-xs font-mono-code font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(245,208,0,0.25)]"
              >
                <span>READ FULL DISPATCH</span>
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          <div className="w-full lg:w-[46%] shrink-0 relative aspect-[16/10] overflow-hidden border border-white/10 bg-[#080808]">
            <img
              src="/assets/aistudio/Asteroid_Bennu-1_f1af1811.jpeg"
              alt="Asteroid floating in deep space against Jupiter orbital background"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-3 left-3 text-[9px] font-mono-code text-white bg-black/80 px-2 py-0.5 border border-white/20 uppercase tracking-widest">
              TARGET: 514107 KAʻEPAOKAʻAWELA
            </div>
            <div className="absolute bottom-3 left-3 text-[10px] font-mono-code text-[#F1F1F1] bg-black/70 px-2 py-1 border border-white/10">
              DR. MARCUS VANCE • PLANETARY DYNAMICS GROUP
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-white/10 divide-y md:divide-y-0 md:divide-x divide-white/10">
          <div className="p-6 sm:p-8 flex flex-col justify-between gap-4 group">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-[10px] font-mono-code text-[#888888] tracking-widest uppercase">
                <span className="text-[#F5D000] font-bold">MEDIA // VIDEOS</span>
                <span>12:44 RUNTIME</span>
              </div>

              <h3 className="text-xl font-bold uppercase tracking-tight text-[#F1F1F1] group-hover:text-[#F5D000] transition-colors leading-snug font-editorial">
                Flight Over Jezero: NASA 3D Topographic Terrain Briefing
              </h3>

              <p className="text-xs text-[#888888] leading-relaxed line-clamp-2 font-editorial">
                Perseverance Mastcam-Z stereo imagery and HiRISE digital elevation modeling render a flight path over layered sedimentary sandstones and Jezero's fan delta.
              </p>
            </div>

            <div
              onClick={() => onOpenVideoModal({
                title: 'Flight Over Jezero: NASA 3D Topographic Terrain Briefing',
                duration: '12:44',
                videoId: 'Q_P0swqaZDk',
                poster: '/assets/aistudio/pia26344-1600x_c40461b6.webp',
              })}
              className="relative aspect-[16/9] w-full overflow-hidden border border-white/10 bg-black cursor-pointer"
            >
              <img
                src="/assets/aistudio/pia26344-1600x_c40461b6.webp"
                alt="NASA Perseverance rover panoramic Jezero delta terrain"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter contrast-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-white/40 bg-black/70 flex items-center justify-center text-[#F5D000] group-hover:scale-110 transition-transform shadow-xl">
                  <Play size={18} className="fill-[#F5D000] ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-2 left-2 text-[9px] font-mono-code text-white bg-black/80 px-1.5 py-0.5 border border-white/20 uppercase">
                NASA SCIENCE BRIEFING
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[10px] font-mono-code text-[#888888]">
              <span>CATEGORY: AREOLOGY</span>
              <span className="text-[#F5D000] font-bold">WATCH VIDEO →</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 flex flex-col justify-between gap-4 group">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-[10px] font-mono-code text-[#888888] tracking-widest uppercase">
                <span className="text-orange-400 font-bold">FIELD // GALLERIES</span>
                <span>18 PHOTOGRAPHS</span>
              </div>

              <h3 className="text-xl font-bold uppercase tracking-tight text-[#F1F1F1] group-hover:text-orange-400 transition-colors leading-snug font-editorial">
                Earth’s Primordial Fire: The Living Basalt Fissures of Iceland
              </h3>

              <p className="text-xs text-[#888888] leading-relaxed line-clamp-2 font-editorial">
                Incandescent molten magma rivers breach the surface of the Reykjanes peninsula, illuminating twilight clouds with volcanic incandescent plumes.
              </p>
            </div>

            <div
              onClick={() => onOpenGalleryModal({
                title: 'Earth’s Primordial Fire: The Living Basalt Fissures of Iceland',
                photographer: 'Snorri Gunnarsson',
                location: 'Reykjanes Peninsula, Iceland',
                image: 'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?auto=format&fit=crop&w=1200&q=80',
              })}
              className="relative aspect-[16/9] w-full overflow-hidden border border-white/10 bg-black cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1579033461380-adb47c3eb938?auto=format&fit=crop&w=1200&q=80"
                alt="Glowing volcanic basalt magma rivers in Iceland at twilight"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter contrast-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-mono-code text-white bg-black/80 px-2 py-0.5 border border-white/20">
                <Camera size={11} className="text-orange-400" />
                <span>GALLERY</span>
              </div>
              <div className="absolute bottom-2 left-2 text-[9px] font-mono-code text-zinc-300">
                FASEDALUR VOLCANIC RIFT
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[10px] font-mono-code text-[#888888]">
              <span>MAGMA TEMP: 1,190° C</span>
              <span className="text-orange-400 font-bold">VIEW GALLERY →</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 flex flex-col justify-between gap-4 group">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-[10px] font-mono-code text-[#888888] tracking-widest uppercase">
                <span className="text-cyan-400 font-bold">DISCOVERY // COSMOS</span>
                <span>SPECTROSCOPY SURVEY</span>
              </div>

              <h3 className="text-xl font-bold uppercase tracking-tight text-[#F1F1F1] group-hover:text-cyan-400 transition-colors leading-snug font-editorial">
                Cosmic Cartography: Mapping 10 Billion Stars Across the Void
              </h3>

              <p className="text-xs text-[#888888] leading-relaxed line-clamp-2 font-editorial">
                Space-based astrometric interferometry and infrared spectroscopy chart the Orion Cygnus arm, resolving stellar nurseries and dust filaments.
              </p>
            </div>

            <div
              onClick={() => onOpenArticleModal({
                title: 'Cosmic Cartography: Mapping 10 Billion Stars Across the Observable Void',
                author: 'Dr. Aris Thorne',
                date: 'OCTOBER 22, 2026',
                image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80',
                category: 'DEEP SPACE CARTOGRAPHY',
              })}
              className="relative aspect-[16/9] w-full overflow-hidden border border-white/10 bg-black cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80"
                alt="Deep space nebula with stellar nursery gas filaments"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter contrast-125"
              />
              <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/80" />
              <div className="absolute top-2 left-2 text-[9px] font-mono-code text-cyan-300 bg-black/80 px-2 py-0.5 border border-cyan-400/30">
                NGC 6523 SURVEY
              </div>
              <div className="absolute bottom-2 left-2 text-[9px] font-mono-code text-zinc-300">
                10 BILLION KINEMATIC VECTORS
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[10px] font-mono-code text-[#888888]">
              <span>PARALLAX ACCURACY: 0.1 µAS</span>
              <span className="text-cyan-400 font-bold">EXPLORE STAR MAP →</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- End of FeaturedContentSection.jsx --- */
