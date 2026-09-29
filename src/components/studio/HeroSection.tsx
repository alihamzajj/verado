import React, { useState } from 'react';
import { Play, ArrowRight, CornerDownRight, Disc, Eye } from 'lucide-react';

interface HeroSectionProps {
  onOpenReel: () => void;
  onOpenInquiry: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenReel, onOpenInquiry }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 overflow-hidden bg-[#08070d]">
      
      {/* Subtle ambient violet glow orb */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-violet-600/12 blur-[140px] pointer-events-none rounded-full" 
      />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 relative z-10">
        
        {/* Top Meta Label */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-violet-400 uppercase font-mono flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-violet-500 rounded-none inline-block" />
            DIRECTING FOR CATEGORY DEFINERS
          </span>
          <span className="text-white/20 text-xs font-mono">//</span>
          <span className="text-[11px] sm:text-xs font-medium tracking-[0.2em] text-[#766e85] uppercase font-mono hidden sm:inline">
            PARIS • NEW YORK • TOKYO
          </span>
        </div>

        {/* Oversized Asymmetric Headline */}
        <div className="max-w-6xl mb-12 sm:mb-16">
          <h1 className="font-heading font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-[5.4rem] text-[#f3f1f8] tracking-tight leading-[0.98] sm:leading-[0.96] uppercase">
            WE DIRECT <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-violet-300 to-white">VISCERAL FILMS</span>
            <br />
            THAT SHAPE CULTURE.
          </h1>
        </div>

        {/* Asymmetric Split: Strong Single CTA + Artwork Viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          
          {/* Left Column: Focused Studio Manifesto & Strong Primary CTA */}
          <div className="lg:col-span-4 space-y-8">
            <p className="text-sm sm:text-base text-[#b3adc2] font-normal leading-relaxed max-w-md">
              A high-precision creative production studio crafting product films, directed social content, and architectural chronicles with anamorphic cinema optics.
            </p>

            {/* ONE STRONG CALL-TO-ACTION */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
              <button
                onClick={onOpenInquiry}
                className="w-full sm:w-auto inline-flex items-center justify-between gap-6 px-7 py-4 text-xs font-extrabold tracking-[0.2em] uppercase bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-[0_0_30px_-5px_rgba(139,92,246,0.45)] hover:shadow-[0_0_40px_-2px_rgba(139,92,246,0.6)] rounded-none cursor-pointer group"
              >
                <span>COMMISSION A FILM</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenReel}
                className="w-full sm:w-auto inline-flex items-center gap-3 px-6 py-4 text-xs font-semibold tracking-[0.18em] uppercase text-[#aba4be] hover:text-white bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-violet-500/30 transition-all rounded-none cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-violet-400 fill-violet-400/40" />
                <span>PLAY SHOWREEL [01:45]</span>
              </button>
            </div>

            {/* Studio quick stats */}
            <div className="pt-6 border-t border-white/[0.06] grid grid-cols-2 gap-4">
              <div>
                <span className="block font-heading font-bold text-2xl text-[#f3f1f8] tracking-tight">180M+</span>
                <span className="text-[10px] tracking-widest uppercase text-[#766e85] font-mono">Organic Reach</span>
              </div>
              <div>
                <span className="block font-heading font-bold text-2xl text-violet-400 tracking-tight">2.39:1</span>
                <span className="text-[10px] tracking-widest uppercase text-[#766e85] font-mono">Cinema Master</span>
              </div>
            </div>
          </div>

          {/* Right Column: Cinematic Artwork of Real Creative Work (Widescreen Cinema Viewport) */}
          <div className="lg:col-span-8">
            <div 
              onClick={onOpenReel}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative aspect-[21/9] sm:aspect-[2.35/1] w-full bg-[#0e0c16] border border-white/[0.08] hover:border-violet-500/40 overflow-hidden cursor-pointer group transition-all duration-500 shadow-2xl"
            >
              {/* Background Cinematic Visual */}
              <img 
                src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1800&auto=format&fit=crop&q=85" 
                alt="Aura Valkyrie Cinematic Production Stills"
                className="w-full h-full object-cover object-center brightness-80 contrast-110 group-hover:scale-105 transition-transform duration-1000 ease-out"
              />

              {/* Atmospheric Midnight Violet Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#08070d] via-transparent to-black/40 pointer-events-none" />
              <div className="absolute inset-0 bg-violet-950/20 mix-blend-color pointer-events-none" />

              {/* Matte Letterbox Bars Simulation */}
              <div className="absolute top-0 left-0 right-0 h-4 sm:h-6 bg-black/80 border-b border-white/[0.05] flex items-center justify-between px-4 font-mono text-[9px] text-[#6f6782]">
                <span>ARRI ALEXA MINI LF // PRORES 4444 XQ</span>
                <span>ASPECT 2.39:1 ANAMORPHIC</span>
              </div>

              {/* Central Cinema Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-none bg-black/60 backdrop-blur-md border border-white/20 group-hover:border-violet-400 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                  <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:text-violet-300 ml-1 fill-white/20 transition-colors" />
                </div>
              </div>

              {/* HUD Camera Crosshairs */}
              <div className="absolute top-1/2 left-8 -translate-y-1/2 w-4 h-4 border-l border-t border-white/30 pointer-events-none" />
              <div className="absolute top-1/2 right-8 -translate-y-1/2 w-4 h-4 border-r border-t border-white/30 pointer-events-none" />

              {/* Bottom Film Stills Descriptor */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/90 to-transparent flex items-end justify-between text-xs">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-violet-400 uppercase block mb-0.5">
                    FEATURED FILM // AUTOMOTIVE
                  </span>
                  <h4 className="font-heading font-bold text-sm sm:text-base text-white tracking-tight">
                    AURA VALKYRIE : "NIGHTFALL FLIGHT"
                  </h4>
                </div>

                <div className="flex items-center gap-2 font-mono text-[10px] text-[#aba4be] bg-black/50 px-2.5 py-1 border border-white/10">
                  <Eye className="w-3 h-3 text-violet-400" />
                  <span>CLICK TO EXPAND REEL</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Razor-thin section boundary */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/[0.06]" />
    </section>
  );
};
