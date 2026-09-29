import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { SERVICES } from '../../data/studioData';

interface ServicesSectionProps {
  onSelectService: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="services" className="py-24 sm:py-36 bg-[#08070d] relative border-t border-white/[0.06]">
      
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10">
        
        {/* Section Label */}
        <div className="mb-12 sm:mb-16">
          <span className="text-[11px] font-semibold tracking-[0.25em] text-violet-400 uppercase font-mono block mb-3">
            03 // CAPABILITIES
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#f3f1f8] tracking-tight uppercase">
            DIRECTORIAL DISCIPLINES
          </h2>
        </div>

        {/* Compact Numbered List — One line each */}
        <div className="border-t border-white/[0.08] divide-y divide-white/[0.08]">
          {SERVICES.map((service, index) => {
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={service.number}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onSelectService(service.title)}
                className="group py-8 sm:py-10 transition-colors duration-300 hover:bg-white/[0.015] cursor-pointer"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-baseline">
                  
                  {/* Number: Vivid violet accent, bold geometric Sora */}
                  <div className="lg:col-span-1">
                    <span className="font-heading font-extrabold text-2xl sm:text-3xl text-violet-500 group-hover:text-violet-400 tracking-tight">
                      {service.number}
                    </span>
                  </div>

                  {/* Title: Sora bold tight tracking */}
                  <div className="lg:col-span-4">
                    <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#f3f1f8] group-hover:text-white group-hover:translate-x-1 transition-all uppercase tracking-tight">
                      {service.title}
                    </h3>
                  </div>

                  {/* One Line Description */}
                  <div className="lg:col-span-6">
                    <p className="text-xs sm:text-sm text-[#aba4be] group-hover:text-[#d3cee2] leading-relaxed transition-colors">
                      {service.oneLineDesc}
                    </p>
                  </div>

                  {/* Action arrow */}
                  <div className="lg:col-span-1 flex justify-start lg:justify-end">
                    <div className="w-8 h-8 rounded-none border border-white/[0.08] group-hover:border-violet-500/50 group-hover:bg-violet-600/10 flex items-center justify-center transition-all">
                      <ArrowRight className="w-3.5 h-3.5 text-[#766e85] group-hover:text-violet-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                </div>

                {/* Sub-tag row on hover */}
                <div className="mt-3 pl-0 lg:pl-[8.333%] flex items-center gap-3 text-[11px] font-mono text-[#766e85]">
                  <span className="text-violet-400 font-semibold">{service.deliverablesTag}</span>
                  <span className="text-white/10">•</span>
                  <span>{service.detail}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
};
