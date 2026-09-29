import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Download, ArrowUpRight, Smartphone, Apple } from 'lucide-react';
import { Project } from '../../types';

interface AppCardProps {
  project: Project;
}

export const AppCard: React.FC<AppCardProps> = ({ project }) => {
  return (
    <div className="group relative rounded-[28px] bg-[#121118] border border-white/[0.07] hover:border-violet-400/40 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-2xl hover:shadow-purple-950/40 overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
      {/* Subtle purple radial background glow on hover */}
      <div 
        className="absolute -right-20 -top-20 w-48 h-48 rounded-full opacity-0 group-hover:opacity-20 transition-opacity blur-3xl pointer-events-none bg-violet-500"
      />

      <div>
        {/* Top Header: Logo, Badges & Rating */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="relative">
            <img 
              src={project.logo} 
              alt={project.name}
              className="w-16 h-16 rounded-2xl object-cover ring-1 ring-white/15 shadow-lg group-hover:scale-105 transition-transform duration-300" 
            />
            {project.badge && (
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-violet-400 text-black shadow-sm">
                {project.badge}
              </span>
            )}
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-violet-500/10 text-violet-300 border border-violet-500/20">
              <Star className="w-3.5 h-3.5 fill-current text-violet-400" />
              <span>{project.rating.toFixed(1)}</span>
              <span className="text-[10px] text-violet-300/70">({(project.reviewsCount / 1000).toFixed(1)}k)</span>
            </div>
            
            {/* Platform Badges */}
            <div className="flex items-center gap-1 text-[10px] font-mono uppercase text-slate-400">
              {project.platforms.includes('iOS') && (
                <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#0A090F] text-slate-300 border border-white/10">
                  <Apple className="w-3 h-3 text-slate-200" />
                  iOS
                </span>
              )}
              {project.platforms.includes('Android') && (
                <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-[#0A090F] text-slate-300 border border-white/10">
                  <Smartphone className="w-3 h-3 text-emerald-400" />
                  Android
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Title and descriptions */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-1.5 text-violet-300 font-mono text-[10px] uppercase tracking-wider font-semibold">
            <span>&#125;</span>
            <span>{project.category}</span>
          </div>
          <h3 className="text-xl font-bold text-white group-hover:text-violet-200 transition-colors">
            {project.name}
          </h3>
          <p className="text-xs text-slate-400 font-medium line-clamp-1">
            {project.tagline}
          </p>
        </div>

        <p className="text-sm text-slate-300/90 line-clamp-2 leading-relaxed mb-4 font-normal">
          {project.shortDescription}
        </p>
      </div>

      {/* Footer Info & CTA */}
      <div className="pt-4 border-t border-white/10 space-y-4">
        {/* Technologies Pills */}
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((tech) => (
            <span 
              key={tech} 
              className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-[#0A090F] text-slate-300 border border-white/10"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-slate-500">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <Download className="w-3.5 h-3.5 text-violet-400" />
            <span>{project.downloads}</span>
          </div>

          <Link
            to={`/projects/${project.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider bg-black hover:bg-[#16151E] text-white border border-white/20 hover:border-violet-400 transition-all duration-200 shadow-sm"
          >
            <span>View Project</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-violet-400" />
          </Link>
        </div>
      </div>
    </div>
  );
};
