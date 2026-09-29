import React, { useState } from 'react';
import { Play, ArrowUpRight, Film, SlidersHorizontal, Sparkles } from 'lucide-react';
import { CAMPAIGNS, Campaign } from '../../data/studioData';

interface WorkReelSectionProps {
  onSelectCampaign: (campaign: Campaign) => void;
}

export const WorkReelSection: React.FC<WorkReelSectionProps> = ({ onSelectCampaign }) => {
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const categories = [
    'ALL',
    'Product films',
    'Social content',
    'UGC campaigns',
    'Property stories'
  ];

  const filteredCampaigns = activeFilter === 'ALL'
    ? CAMPAIGNS
    : CAMPAIGNS.filter(c => c.category === activeFilter);

  return (
    <section id="work" className="py-24 sm:py-36 bg-[#08070d] relative">
      
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 sm:mb-16 border-b border-white/[0.08] pb-8">
          <div>
            <span className="text-[11px] font-semibold tracking-[0.25em] text-violet-400 uppercase font-mono block mb-3">
              02 // PRODUCTION ARCHIVE
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl text-[#f3f1f8] tracking-tight uppercase">
              SELECTED CAMPAIGNS
            </h2>
          </div>

          {/* Minimalist Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold tracking-wider uppercase transition-all rounded-none cursor-pointer ${
                  activeFilter === cat
                    ? 'bg-violet-600 text-white shadow-[0_0_15px_-2px_rgba(139,92,246,0.5)]'
                    : 'text-[#aba4be] hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Campaign Grid (Large cinematic showcases) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
          {filteredCampaigns.map((item, index) => (
            <article
              key={item.id}
              onClick={() => onSelectCampaign(item)}
              className="group relative bg-[#0e0c16] border border-white/[0.07] hover:border-violet-500/50 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              {/* Campaign Visual Viewport */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-black">
                <img 
                  src={item.thumbnail} 
                  alt={item.title}
                  className="w-full h-full object-cover object-center brightness-85 contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Violet ambient tint & gradient fade */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c16] via-transparent to-black/30 pointer-events-none" />
                <div className="absolute inset-0 bg-violet-900/10 group-hover:bg-violet-900/20 mix-blend-overlay transition-colors pointer-events-none" />

                {/* Top Corner Meta Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono">
                  <span className="px-2 py-0.5 bg-black/75 backdrop-blur-sm border border-white/10 text-violet-300 font-semibold tracking-wider uppercase">
                    {item.category}
                  </span>
                  <span className="px-2 py-0.5 bg-black/75 backdrop-blur-sm border border-white/10 text-white/80 font-mono tracking-widest">
                    {item.format}
                  </span>
                </div>

                {/* Play Hover Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                  <div className="w-14 h-14 bg-violet-600 text-white rounded-none flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.6)] transform scale-90 group-hover:scale-100 transition-transform">
                    <Play className="w-5 h-5 ml-0.5 fill-white" />
                  </div>
                </div>

                {/* Bottom Frame Filmstrip Numbers */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] font-mono text-[#aba4be]">
                  <span className="tracking-widest">CAM // {item.number}</span>
                  <span className="text-violet-400 font-bold">{item.metrics}</span>
                </div>
              </div>

              {/* Campaign Editorial Details */}
              <div className="p-6 sm:p-7 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono tracking-widest text-[#766e85] uppercase block mb-1">
                      {item.client} • {item.year}
                    </span>
                    <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#f3f1f8] tracking-tight group-hover:text-violet-300 transition-colors uppercase">
                      {item.title}
                    </h3>
                  </div>

                  <div className="p-2 border border-white/[0.08] group-hover:border-violet-500/50 group-hover:bg-violet-600/10 transition-colors shrink-0">
                    <ArrowUpRight className="w-4 h-4 text-[#aba4be] group-hover:text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#aba4be] leading-relaxed line-clamp-2">
                  {item.description}
                </p>

                {/* Camera / Optic Metadata Pills */}
                <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center gap-y-2 gap-x-4 text-[11px] font-mono text-[#766e85]">
                  <span>OPTICS: <strong className="text-white/80 font-normal">{item.specs.lens}</strong></span>
                  <span className="text-white/20">•</span>
                  <span>COLOR: <strong className="text-violet-400 font-normal">{item.specs.colorGrade}</strong></span>
                </div>
              </div>

            </article>
          ))}
        </div>

      </div>

    </section>
  );
};
