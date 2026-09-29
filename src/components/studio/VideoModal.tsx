import React, { useEffect, useRef } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Camera, Film, Sparkles } from 'lucide-react';
import { Campaign } from '../../data/studioData';

interface VideoModalProps {
  campaign: Campaign | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ campaign, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!campaign) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container: Sharp corners, hairline border, deep charcoal */}
      <div className="relative z-10 w-full max-w-5xl bg-[#0a0812] border border-white/10 shadow-[0_0_80px_-20px_rgba(139,92,246,0.35)] overflow-hidden flex flex-col">
        
        {/* Header HUD bar */}
        <div className="h-12 px-5 bg-black/80 border-b border-white/[0.08] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-[#f3f1f8] font-bold tracking-wider uppercase">
              {campaign.title}
            </span>
            <span className="text-white/20 hidden sm:inline">|</span>
            <span className="text-violet-400 font-mono hidden sm:inline">
              {campaign.format}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#aba4be] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close Preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Viewport (2.39:1 CinemaScope container) */}
        <div className="relative aspect-[21/9] sm:aspect-[2.35/1] w-full bg-black overflow-hidden flex items-center justify-center">
          <video
            ref={videoRef}
            src={campaign.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Letterbox borders */}
          <div className="absolute top-0 left-0 right-0 h-3 bg-black/90 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-3 bg-black/90 pointer-events-none" />
        </div>

        {/* Cinematic Production Metadata Footer */}
        <div className="p-6 bg-[#08070d] border-t border-white/[0.08] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-violet-400 uppercase block mb-1">
                {campaign.client} • {campaign.category}
              </span>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-white uppercase">
                {campaign.title}
              </h3>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono tracking-widest text-[#766e85] uppercase block">
                IMPACT TELEMETRY
              </span>
              <span className="text-xs font-mono font-bold text-violet-300">
                {campaign.metrics}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#aba4be] leading-relaxed">
            {campaign.description}
          </p>

          {/* Specs breakdown grid */}
          <div className="pt-4 border-t border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px] font-mono">
            <div>
              <span className="text-[#6f6782] uppercase block text-[9px]">CAMERA PACKAGE</span>
              <span className="text-white/90">{campaign.specs.camera}</span>
            </div>
            <div>
              <span className="text-[#6f6782] uppercase block text-[9px]">OPTICAL RIG</span>
              <span className="text-white/90">{campaign.specs.lens}</span>
            </div>
            <div>
              <span className="text-[#6f6782] uppercase block text-[9px]">COLOR MASTER</span>
              <span className="text-violet-400">{campaign.specs.colorGrade}</span>
            </div>
            <div>
              <span className="text-[#6f6782] uppercase block text-[9px]">DELIVERY ASSETS</span>
              <span className="text-white/90">{campaign.specs.deliverables}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
