import React from 'react';
import { PROCESS_STEPS } from '../../data/studioData';

export const ProcessSection: React.FC = () => {
  return (
    <section id="process" className="py-24 sm:py-36 bg-[#08070d] relative border-t border-white/[0.06]">
      
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-20">
          <div>
            <span className="text-[11px] font-semibold tracking-[0.25em] text-violet-400 uppercase font-mono block mb-3">
              04 // PRODUCTION PROTOCOL
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#f3f1f8] tracking-tight uppercase">
              HOW WE WORK
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-[#aba4be] max-w-md font-normal leading-relaxed">
            From initial treatment decks to final color grade master delivery, our pipeline eliminates creative drift and delivers uncompromising technical precision.
          </p>
        </div>

        {/* 4 Short Numbered Steps in architectural hairline grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.08] border border-white/[0.08]">
          {PROCESS_STEPS.map((step) => (
            <div 
              key={step.number}
              className="bg-[#08070d] p-8 sm:p-10 flex flex-col justify-between group hover:bg-[#0e0c16] transition-colors duration-300 min-h-[300px]"
            >
              {/* Step number: Vivid violet accent */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-extrabold text-3xl text-violet-500 tracking-tight">
                    {step.number}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-none bg-white/20 group-hover:bg-violet-400 transition-colors" />
                </div>

                <h3 className="font-heading font-bold text-lg sm:text-xl text-[#f3f1f8] tracking-tight group-hover:text-white transition-colors uppercase pt-4">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#aba4be] leading-relaxed pt-2">
                  {step.shortDesc}
                </p>
              </div>

              {/* Bottom focus tag */}
              <div className="pt-8 border-t border-white/[0.06] mt-6">
                <span className="text-[10px] font-mono tracking-widest text-violet-400 uppercase block">
                  {step.focus}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
};
