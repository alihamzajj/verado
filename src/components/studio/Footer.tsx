import React from 'react';
import { ArrowUp, Film } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-12 sm:py-16 bg-[#06050a] border-t border-white/[0.08] relative">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-white/[0.06]">
          
          <div>
            <span className="font-heading font-extrabold text-2xl text-[#f3f1f8] tracking-tighter uppercase block">
              VERADO STUDIO
            </span>
            <p className="text-xs font-mono text-[#766e85] mt-1 tracking-wider uppercase">
              CINEMATIC CREATIVE DIRECTION & HIGH-END PRODUCTION
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-8 text-xs font-mono tracking-widest text-[#aba4be] uppercase">
            <a href="#work" className="hover:text-violet-400 transition-colors">WORK REEL</a>
            <a href="#services" className="hover:text-violet-400 transition-colors">SERVICES</a>
            <a href="#process" className="hover:text-violet-400 transition-colors">PROCESS</a>
            <a href="#contact" className="hover:text-violet-400 transition-colors">CONTACT</a>
          </div>

          <button
            onClick={scrollToTop}
            className="p-3 border border-white/[0.08] hover:border-violet-500/50 hover:bg-violet-600/10 text-[#aba4be] hover:text-white transition-all rounded-none cursor-pointer flex items-center gap-2 text-xs font-mono"
            title="Scroll to top"
          >
            <span>TOP</span>
            <ArrowUp className="w-3.5 h-3.5 text-violet-400" />
          </button>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] font-mono text-[#6f6782]">
          <p>© 2026 VERADO STUDIO INC. ALL CINEMA RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <span>2.39:1 DCI MASTER</span>
            <span>•</span>
            <span>COLOR GRADED IN DAVINCI RESOLVE</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
