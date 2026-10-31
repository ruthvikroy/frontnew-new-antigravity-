/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Space Punks expedition field dossier modal with environmental telemetry and log
*/
import React from 'react';
import { X, MapPin, Compass, Thermometer, Gauge, Mountain, User, ArrowLeft, Shield } from 'lucide-react';

export function ExpeditionDetailModal({ expedition, onClose }) {
  if (!expedition) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-[#050505] border border-white/15 shadow-2xl my-auto text-[#F1F1F1] overflow-hidden">
        <div className="bg-[#0A0A0A] border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[10px] font-mono-code text-[#888888] uppercase tracking-widest">
            <img src="/assets/space-punks-logo.png" alt="Logo" className="w-4 h-4 rounded-full object-cover shrink-0" />
            <span className="text-[#F5D000] font-bold">FIELD EXPEDITION DOSSIER</span>
            <span>•</span>
            <span>TEAM SPACE PUNKS // EXPEDITION CONTROL</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 border border-white/10 hover:border-white/30 text-[#888888] hover:text-[#F1F1F1] transition-colors cursor-pointer"
            aria-label="Close expedition dossier"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 sm:p-10 max-h-[82vh] overflow-y-auto flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono-code text-[#F5D000] uppercase tracking-[0.25em] font-bold">
              {expedition.category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#F1F1F1] font-editorial">
              {expedition.name}
            </h1>
            <span className="text-xs font-mono-code text-[#888888] uppercase tracking-wider">
              {expedition.country} • COORD: {expedition.coordinates}
            </span>
          </div>

          <div className="relative aspect-[16/9] w-full border border-white/10 overflow-hidden bg-black">
            <img
              src={expedition.heroImage}
              alt={expedition.name}
              className="w-full h-full object-cover filter contrast-115"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 text-[10px] font-mono-code text-white bg-black/80 px-2.5 py-1 border border-white/20">
              LOCATION LOG // {expedition.elevation}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono-code">
            <div className="p-3 border border-white/10 bg-[#0A0A0A]">
              <span className="text-[#888888] block">ELEVATION</span>
              <span className="text-[#F5D000] font-bold text-xs mt-0.5 block">{expedition.elevation}</span>
            </div>
            <div className="p-3 border border-white/10 bg-[#0A0A0A]">
              <span className="text-[#888888] block">AMBIENT TEMP</span>
              <span className="text-[#F1F1F1] font-bold text-xs mt-0.5 block">{expedition.temperature}</span>
            </div>
            <div className="p-3 border border-white/10 bg-[#0A0A0A]">
              <span className="text-[#888888] block">PRESSURE</span>
              <span className="text-[#F1F1F1] font-bold text-xs mt-0.5 block">{expedition.pressure}</span>
            </div>
            <div className="p-3 border border-white/10 bg-[#0A0A0A]">
              <span className="text-[#888888] block">TEAM</span>
              <span className="text-[#F1F1F1] font-bold text-xs mt-0.5 truncate block">{expedition.team}</span>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#CCCCCC] leading-relaxed font-editorial border-t border-white/10 pt-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F1F1F1] font-mono-code">
              SCIENTIFIC OBJECTIVE &amp; FIELD SUMMARY
            </h3>
            <p>{expedition.summary}</p>
            <p>
              Autonomous sampling platforms and robotic probes deploy geochemical mass spectrometers to analyze geochemical gradients in situ. Extreme conditions isolate novel enzymatic pathways, revealing the evolutionary boundaries of carbon-based biology on Earth and establishing benchmark analogs for planetary exploration.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-white/10 bg-[#0A0A0A] hover:border-white/30 text-xs font-mono-code text-[#888888] hover:text-[#F1F1F1] uppercase flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>RETURN TO ATLAS</span>
            </button>
            <span className="text-[10px] font-mono-code text-[#F5D000]">
              EXPEDITION ACTIVE // WGS-84 VALIDATED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- End of ExpeditionDetailModal.jsx --- */
