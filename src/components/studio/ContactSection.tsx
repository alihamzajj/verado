import React from 'react';
import { ArrowRight, Mail, MapPin, Clock, ShieldCheck, Film } from 'lucide-react';

interface ContactSectionProps {
  onOpenInquiry: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenInquiry }) => {
  return (
    <section id="contact" className="py-28 sm:py-44 bg-[#08070d] relative overflow-hidden border-t border-white/[0.08]">
      
      {/* Background ambient glow */}
      <div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-violet-600/10 blur-[160px] pointer-events-none rounded-full" 
      />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 relative z-10">
        
        {/* Top availability banner */}
        <div className="flex items-center gap-3 mb-8 sm:mb-12">
          <span className="w-2 h-2 bg-emerald-400 rounded-none animate-pulse" />
          <span className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-violet-400 uppercase font-mono">
            ACCEPTING Q4 COMMISSIONS // 2 SLOTS REMAINING
          </span>
        </div>

        {/* Oversized Asymmetric Closing Headline */}
        <div className="max-w-5xl mb-12 sm:mb-16">
          <h2 className="font-heading font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-[5.2rem] text-[#f3f1f8] tracking-tight leading-[0.98] uppercase">
            HAVE AN AMBITIOUS VISION?
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-violet-300 to-white">
              LET’S ROLL CAMERA.
            </span>
          </h2>
          <p className="mt-8 text-sm sm:text-base text-[#b3adc2] max-w-2xl font-normal leading-relaxed">
            We partner with category-defining founders, luxury houses, and ambitious creative directors to produce cinematic work that commands immediate authority.
          </p>
        </div>

        {/* ONE STRONG CLOSING ACTION WITH A CLEAR BUTTON */}
        <div className="mb-20 sm:mb-28 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <button
            onClick={onOpenInquiry}
            className="w-full sm:w-auto inline-flex items-center justify-between gap-8 px-8 sm:px-10 py-5 text-xs sm:text-sm font-extrabold tracking-[0.22em] uppercase bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-[0_0_35px_-4px_rgba(139,92,246,0.5)] hover:shadow-[0_0_50px_-2px_rgba(139,92,246,0.7)] rounded-none cursor-pointer group"
          >
            <span>INITIATE PRODUCTION</span>
            <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1.5 transition-transform" />
          </button>

          <a 
            href="mailto:directors@verado.studio"
            className="text-xs font-mono tracking-widest text-[#aba4be] hover:text-white uppercase px-6 py-5 border border-white/[0.08] hover:border-violet-500/40 bg-white/[0.02] transition-colors"
          >
            DIRECTORS@VERADO.STUDIO
          </a>
        </div>

        {/* Bottom Studio Coordinates (Clean hairline grid) */}
        <div className="pt-12 border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-3 gap-8 text-xs font-mono text-[#766e85]">
          <div>
            <span className="text-violet-400 uppercase tracking-widest block mb-2 font-semibold">
              // STUDIO ATELIERS
            </span>
            <p className="text-[#aba4be] leading-relaxed">
              Paris: 18 Rue du Faubourg Saint-Honoré<br />
              New York: 110 Greene St, SoHo<br />
              Tokyo: 5-7-22 Minami-Aoyama, Minato-ku
            </p>
          </div>

          <div>
            <span className="text-violet-400 uppercase tracking-widest block mb-2 font-semibold">
              // PRODUCTION CAPABILITIES
            </span>
            <p className="text-[#aba4be] leading-relaxed">
              Arri Alexa Mini LF & RED V-Raptor 8K<br />
              Cooke Anamorphic /i Optical Packages<br />
              DaVinci Resolve Color Mastering
            </p>
          </div>

          <div>
            <span className="text-violet-400 uppercase tracking-widest block mb-2 font-semibold">
              // CONFIDENTIALITY & TERMS
            </span>
            <p className="text-[#aba4be] leading-relaxed">
              Strict NDA protection on pre-release hardware.<br />
              Global broadcast & digital buyout rights.<br />
              Average turnaround: 3 to 5 weeks.
            </p>
          </div>
        </div>

      </div>

    </section>
  );
};
