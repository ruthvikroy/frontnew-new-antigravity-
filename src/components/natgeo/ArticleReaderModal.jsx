/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Space Punks editorial article reader modal with Swiss typography and photo layout
*/
import React from 'react';
import { X, Clock, Calendar, Share2, Bookmark, ArrowLeft } from 'lucide-react';

export function ArticleReaderModal({ article, onClose }) {
  if (!article) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-[#050505] border border-white/15 shadow-2xl my-auto text-[#F1F1F1] overflow-hidden">
        <div className="sticky top-0 z-20 bg-[#0A0A0A]/95 border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[10px] font-mono-code text-[#888888] uppercase tracking-widest">
            <img src="/assets/space-punks-logo.png" alt="Logo" className="w-4 h-4 rounded-full object-cover shrink-0" />
            <span className="text-[#F5D000] font-bold">{article.category || 'EXPEDITION DISPATCH'}</span>
            <span>•</span>
            <span>TEAM SPACE PUNKS // MISSION ARCHIVE</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 border border-white/10 hover:border-white/30 text-[#888888] hover:text-[#F1F1F1] transition-colors cursor-pointer"
            aria-label="Close article reader"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 sm:p-12 max-h-[82vh] overflow-y-auto">
          <div className="mb-6 flex flex-col gap-3">
            <span className="text-[11px] font-mono-code text-[#F5D000] uppercase tracking-[0.2em] font-bold">
              {article.categoryLabel || 'SCIENTIFIC REPORT'}
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#F1F1F1] font-editorial leading-tight">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono-code text-[#888888] pt-2 border-b border-white/10 pb-4">
              <span className="text-[#F1F1F1] font-bold">{article.author || 'TEAM SPACE PUNKS FIELD DESK'}</span>
              <span>•</span>
              <span>{article.date || 'OCTOBER 2026'}</span>
              <span>•</span>
              <span className="text-[#F5D000]">{article.readTime || '7 MIN READ'}</span>
            </div>
          </div>

          {article.image && (
            <div className="mb-8 border border-white/10 overflow-hidden bg-black aspect-[16/9] relative">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover filter contrast-110"
              />
              <div className="absolute bottom-2 left-2 text-[9px] font-mono-code text-zinc-300 bg-black/80 px-2 py-0.5 border border-white/10">
                CREDIT: SPACE PUNKS / NASA ARCHIVE
              </div>
            </div>
          )}

          <div className="space-y-6 text-sm sm:text-base text-[#CCCCCC] leading-relaxed font-editorial">
            <p className="text-base sm:text-lg text-[#F1F1F1] font-semibold leading-relaxed border-l-2 border-[#F5D000] pl-4">
              {article.deck || 'Retrograde orbital motion remains one of the most enigmatic dynamic signatures in celestial mechanics. When an object circumvents its host star backward, it tells a tale of gravitational capture.'}
            </p>

            <p>
              In our Solar System, virtually all planets, dwarf planets, and major asteroid families orbit the Sun in a prograde counterclockwise direction. This uniform vector is an unyielding fossil of the angular momentum conserved when the proto-stellar solar nebula first collapsed 4.6 billion years ago.
            </p>

            <blockquote className="my-6 p-4 sm:p-6 bg-[#0A0A0A] border-y border-white/10 text-center italic text-[#F1F1F1] text-lg sm:text-xl font-editorial">
              "We are measuring ancient wanderers that slipped through the gravitational net of distant stellar nurseries before our oceans even formed."
            </blockquote>

            <p>
              Asteroid (514107) Kaʻepaokaʻawela, however, defies this primordial consensus. Orbiting inside Jupiter’s co-orbital resonance, it traverses its 12-year heliocentric path directly opposite to Jupiter’s orbital sweep. Over billions of orbits, high-precision N-body gravitational simulations demonstrate that if it had been formed in our local disc, orbital resonance chaos would have ejected it into interstellar space within 10 million years.
            </p>

            <p>
              The survival of this body requires that it was captured during the Sun's infancy, while our star still resided in its dense birth star cluster. This interstellar visitor represents a permanent physical messenger from another star system, anchored forever inside Jupiter's gravitational embrace.
            </p>
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-white/10 bg-[#0A0A0A] hover:border-white/30 text-xs font-mono-code text-[#888888] hover:text-[#F1F1F1] uppercase flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>RETURN TO DISPATCH MATRIX</span>
            </button>

            <div className="text-[10px] font-mono-code text-[#888888]">
              ARCHIVE DISPATCH // REF-ID: {article.id || 'AST-514107'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- End of ArticleReaderModal.jsx --- */
