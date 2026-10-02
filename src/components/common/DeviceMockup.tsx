import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface DeviceMockupProps {
  imageSrc?: string;
  appName?: string;
  tagline?: string;
  category?: string;
  accentColor?: string;
  className?: string;
  showOverlay?: boolean;
  hideStatusBar?: boolean;
  children?: React.ReactNode;
}

export const DeviceMockup: React.FC<DeviceMockupProps> = ({
  imageSrc,
  appName = 'App Showcase',
  tagline = 'Next-gen Mobile App',
  category,
  accentColor = '#38bdf8',
  className = '',
  showOverlay = false,
  hideStatusBar = false,
  children,
}) => {
  return (
    <div className={`relative mx-auto select-none ${className}`}>
      {/* Outer Phone Border with Titanium & Violet Finish */}
      <div className="relative rounded-[46px] p-2.5 sm:p-3 bg-gradient-to-b from-[#2E2842] via-[#1A1624] to-[#0F0E11] shadow-2xl shadow-purple-950/60 ring-1 ring-white/20">
        
        {/* Antenna bands */}
        <div className="absolute top-20 -left-0.5 w-1 h-5 bg-[#3B3454] rounded-l" />
        <div className="absolute top-32 -left-0.5 w-1 h-8 bg-[#3B3454] rounded-l" />
        <div className="absolute top-44 -left-0.5 w-1 h-8 bg-[#3B3454] rounded-l" />
        <div className="absolute top-28 -right-0.5 w-1 h-12 bg-[#3B3454] rounded-r" />

        {/* Inner Bezel Screen */}
        <div className="relative rounded-[36px] overflow-hidden bg-[#0F0E11] aspect-[9/19] w-[240px] sm:w-[265px] md:w-[275px] border border-white/10 flex flex-col justify-between">
          
          {/* Dynamic Island & Status Bar */}
          {!hideStatusBar && (
            <div className="relative z-20 px-5 pt-3 pb-1 flex items-center justify-between text-[11px] font-semibold text-white/90">
              <span className="font-mono text-[10px]">9:41</span>
              
              {/* Dynamic Island Pill */}
              <div className="absolute left-1/2 -translate-x-1/2 top-2.5 h-5 w-20 bg-black rounded-full flex items-center justify-between px-2 shadow-md border border-white/10">
                <div className="w-2 h-2 rounded-full bg-[#16151B] border border-white/20" />
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>

              <div className="flex items-center gap-1.5 text-white/80">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>
          )}

          {/* Screen Content */}
          <div className="relative flex-1 overflow-hidden h-full">
            {children ? (
              children
            ) : imageSrc ? (
              <div className="relative w-full h-full">
                <img 
                  src={imageSrc} 
                  alt={appName}
                  className="w-full h-full object-cover transition-opacity duration-500" 
                />
                {showOverlay && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B14] via-[#0D0B14]/35 to-transparent pointer-events-none" />
                    
                    {/* Overlay Card Inside Phone */}
                    <div className="absolute bottom-4 inset-x-3 p-3.5 rounded-2xl bg-[#0D0B14]/88 backdrop-blur-xl border border-white/10 shadow-2xl">
                      {category && (
                        <span 
                          className="inline-block text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 text-white shadow-sm"
                          style={{ backgroundColor: accentColor }}
                        >
                          {category}
                        </span>
                      )}
                      <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">{appName}</h4>
                      <p className="text-[10px] text-white/70 line-clamp-2 mt-0.5 leading-snug">{tagline}</p>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <div 
                  className="w-14 h-14 rounded-2xl mb-3 shadow-lg flex items-center justify-center text-white font-bold text-xl"
                  style={{ backgroundColor: accentColor }}
                >
                  {appName.charAt(0)}
                </div>
                <h4 className="text-sm font-bold text-white">{appName}</h4>
                <p className="text-xs text-white/60 mt-1">{tagline}</p>
              </div>
            )}
          </div>

          {/* Home Indicator Bar */}
          <div className="h-3 flex items-center justify-center pb-2 z-20">
            <div className="w-24 h-1 bg-white/40 rounded-full" />
          </div>

        </div>
      </div>
    </div>
  );
};
