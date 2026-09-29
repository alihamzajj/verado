import React, { useState, useEffect } from 'react';
import { Play, Volume2, VolumeX, ArrowUpRight, Film } from 'lucide-react';

interface HeaderProps {
  onOpenReel: () => void;
  onOpenInquiry: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenReel, onOpenInquiry }) => {
  const [scrolled, setScrolled] = useState(false);
  const [timecode, setTimecode] = useState('00:04:18:22');
  const [audioActive, setAudioActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);

    // Live cinema timecode ticker
    const interval = setInterval(() => {
      const now = new Date();
      const frames = Math.floor((now.getMilliseconds() / 1000) * 24).toString().padStart(2, '0');
      const sec = now.getSeconds().toString().padStart(2, '0');
      const min = now.getMinutes().toString().padStart(2, '0');
      const hr = (now.getHours() % 24).toString().padStart(2, '0');
      setTimecode(`${hr}:${min}:${sec}:${frames}`);
    }, 41);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#08070d]/90 backdrop-blur-md border-b border-white/[0.08] py-4' 
          : 'bg-gradient-to-b from-[#08070d]/90 to-transparent border-b border-white/[0.04] py-6'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 flex items-center justify-between">
        
        {/* Brand identity: Sora bold, geometric, tight tracking */}
        <div className="flex items-center gap-6">
          <a href="#" className="flex items-baseline gap-2.5 group">
            <span className="font-heading font-extrabold text-xl sm:text-2xl text-[#f3f1f8] tracking-tighter uppercase transition-colors group-hover:text-violet-400">
              VERADO
            </span>
            <span className="hidden sm:inline-block text-[10px] tracking-[0.25em] text-[#766e85] uppercase font-mono">
              STUDIO // PARIS • NY • TOKYO
            </span>
          </a>

          {/* Cinema Record HUD status */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 bg-white/[0.02] border border-white/[0.06] font-mono text-[10px] text-[#aba4be]">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-violet-400 font-semibold tracking-wider">REC</span>
            <span className="text-white/20">|</span>
            <span className="tracking-widest text-[#f3f1f8]">{timecode}</span>
            <span className="text-white/20">|</span>
            <span className="text-[#847b9b]">4K DCI RAW</span>
          </div>
        </div>

        {/* Center / Right navigation & CTA */}
        <div className="flex items-center gap-8">
          
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-[0.18em] uppercase text-[#aba4be]">
            <a href="#work" className="hover:text-white transition-colors">
              01 // WORK
            </a>
            <a href="#services" className="hover:text-white transition-colors">
              02 // SERVICES
            </a>
            <a href="#process" className="hover:text-white transition-colors">
              03 // PROCESS
            </a>
            <a href="#contact" className="hover:text-white transition-colors">
              04 // CONTACT
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Quick Reel trigger */}
            <button
              onClick={onOpenReel}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold tracking-wider uppercase text-[#f3f1f8] bg-white/[0.03] hover:bg-violet-600/10 border border-white/[0.08] hover:border-violet-500/40 transition-all rounded-none group cursor-pointer"
              title="Watch Studio Showreel"
            >
              <Play className="w-3 h-3 text-violet-400 group-hover:scale-110 transition-transform fill-violet-400/30" />
              <span className="hidden sm:inline">2026 Reel</span>
            </button>

            {/* Initiate Project button: Vivid violet accent, sharp corners */}
            <button
              onClick={onOpenInquiry}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 text-xs font-bold tracking-wider uppercase bg-violet-600 hover:bg-violet-500 text-white transition-all shadow-[0_0_20px_-3px_rgba(139,92,246,0.4)] rounded-none cursor-pointer group"
            >
              <span>Initiate Project</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
