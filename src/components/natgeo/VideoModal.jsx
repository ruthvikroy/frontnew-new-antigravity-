/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Space Punks video briefing modal with embedded player and field notes
*/
import React from 'react';
import { X, Film, Sparkles, Clock, Globe } from 'lucide-react';

export function VideoModal({ video, onClose }) {
  if (!video) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-[#050505] border border-white/15 shadow-2xl my-auto text-[#F1F1F1] overflow-hidden">
        <div className="bg-[#0A0A0A] border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[10px] font-mono-code text-[#888888] uppercase tracking-widest">
            <img src="/assets/space-punks-logo.png" alt="Logo" className="w-4 h-4 rounded-full object-cover shrink-0" />
            <span className="text-[#F5D000] font-bold">TEAM SPACE PUNKS // MISSION VIDEO</span>
            <span>•</span>
            <span>NASA SCIENCE CO-PRODUCTION</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 border border-white/10 hover:border-white/30 text-[#888888] hover:text-[#F1F1F1] transition-colors cursor-pointer"
            aria-label="Close video player"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 sm:p-8 flex flex-col gap-6">
          <div className="relative aspect-video w-full border border-white/10 bg-black overflow-hidden shadow-2xl">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube-nocookie.com/embed/${video.videoId || 'Q_P0swqaZDk'}?autoplay=1&rel=0&modestbranding=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-[10px] font-mono-code text-[#888888] uppercase">
              <span className="text-[#F5D000] font-bold">MARTIAN RECONNAISSANCE</span>
              <span>•</span>
              <span>RUNTIME: {video.duration || '12:44'}</span>
              <span>•</span>
              <span>4K DIGITAL ELEVATION MODEL</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#F1F1F1] font-editorial">
              {video.title}
            </h2>

            <p className="text-xs sm:text-sm text-[#888888] leading-relaxed font-editorial">
              Using high-resolution stereo imaging from the Mars Reconnaissance Orbiter (HiRISE) and surface telemetry captured by the Perseverance rover, this flyover traverses the ancient fan delta in Jezero Crater where organic-rich clay minerals precipitated 3.8 billion years ago.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- End of VideoModal.jsx --- */
