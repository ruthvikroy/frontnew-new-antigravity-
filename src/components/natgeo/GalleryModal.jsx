/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Space Punks photo gallery modal with full-screen high-resolution lightbox
*/
import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Camera, MapPin, Maximize2 } from 'lucide-react';

const ICELAND_GALLERY = [
  {
    url: 'https://images.unsplash.com/photo-1579033461380-adb47c3eb938?auto=format&fit=crop&w=1600&q=85',
    caption: 'Molten basalt magma rivers breaching the Reykjanes peninsula rift at twilight.',
    credit: 'Snorri Gunnarsson / Space Punks Contributor',
    location: 'Fagradalsfjall, Iceland',
    tech: 'ISO 800 • 35mm f/2.8 • 1/125s',
  },
  {
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=85',
    caption: 'Basaltic tephra and cooled pahoehoe lava terraces solidifying under sub-arctic winds.',
    credit: 'Elena Rostova / Geological Field Expedition',
    location: 'Geldingadalir Valley, Iceland',
    tech: 'ISO 400 • 24mm f/4.0 • 1/250s',
  },
  {
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85',
    caption: 'Incandescent volcanic degassing vent emitting sulfur dioxide plumes into twilight skies.',
    credit: 'K. Strickland / Volcanology Archive',
    location: 'Sundhnúkur Craters, Iceland',
    tech: 'ISO 1600 • 70mm f/2.8 • 1/60s',
  },
];

export function GalleryModal({ gallery, onClose }) {
  const [photoIndex, setPhotoIndex] = useState(0);

  if (!gallery) return null;

  const currentPhoto = ICELAND_GALLERY[photoIndex] || ICELAND_GALLERY[0];

  const handlePrev = () => {
    setPhotoIndex((prev) => (prev > 0 ? prev - 1 : ICELAND_GALLERY.length - 1));
  };

  const handleNext = () => {
    setPhotoIndex((prev) => (prev < ICELAND_GALLERY.length - 1 ? prev + 1 : 0));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div className="relative w-full max-w-5xl bg-[#050505] border border-white/15 shadow-2xl my-auto text-[#F1F1F1] flex flex-col overflow-hidden">
        <div className="bg-[#0A0A0A] border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[10px] font-mono-code text-[#888888] uppercase tracking-widest">
            <img src="/assets/space-punks-logo.png" alt="Logo" className="w-4 h-4 rounded-full object-cover shrink-0" />
            <span className="text-[#F5D000] font-bold">TEAM SPACE PUNKS // VISUAL ARCHIVE</span>
            <span>•</span>
            <span>PHOTO {photoIndex + 1} OF {ICELAND_GALLERY.length}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 border border-white/10 hover:border-white/30 text-[#888888] hover:text-[#F1F1F1] transition-colors cursor-pointer"
            aria-label="Close photo gallery"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black flex items-center justify-center overflow-hidden">
          <img
            src={currentPhoto.url}
            alt={currentPhoto.caption}
            className="w-full h-full object-cover filter contrast-115"
          />

          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full border border-white/20 bg-black/75 hover:bg-[#F5D000] hover:text-black text-white transition-all cursor-pointer shadow-lg"
            aria-label="Previous photograph"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full border border-white/20 bg-black/75 hover:bg-[#F5D000] hover:text-black text-white transition-all cursor-pointer shadow-lg"
            aria-label="Next photograph"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="p-6 bg-[#080808] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1 max-w-xl">
            <p className="text-xs sm:text-sm text-[#F1F1F1] font-editorial font-medium leading-relaxed">
              {currentPhoto.caption}
            </p>
            <span className="text-[10px] font-mono-code text-[#888888]">
              {currentPhoto.credit} • {currentPhoto.location}
            </span>
          </div>

          <div className="flex items-center gap-2 border border-white/10 bg-[#0A0A0A] px-3 py-1.5 text-[9px] font-mono-code text-[#888888]">
            <Camera size={12} className="text-orange-400" />
            <span>{currentPhoto.tech}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- End of GalleryModal.jsx --- */
