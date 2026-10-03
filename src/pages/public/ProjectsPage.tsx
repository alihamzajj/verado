import React, { useState, useMemo } from 'react';
import { Search, Filter, Smartphone, Apple, Layers, Sparkles, X, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppCard } from '../../components/common/AppCard';
import { ProjectCategory, Platform } from '../../types';

export const ProjectsPage: React.FC = () => {
  const { projects } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'downloads' | 'name'>('featured');

  const categories = [
    'All',
    'AI & Computer Vision',
    'Health & Fitness',
    'Finance & Crypto',
    'Productivity & Tools',
    'Travel & Navigation',
  ];

  const platforms = ['All', 'Android', 'iOS', 'Android + iOS'];

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Must be published and not archived for public view
      if (!project.published || project.isArchived) return false;

      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        project.name.toLowerCase().includes(query) ||
        project.tagline.toLowerCase().includes(query) ||
        project.shortDescription.toLowerCase().includes(query) ||
        project.technologies.some((t) => t.toLowerCase().includes(query));

      // Category match
      const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;

      // Platform match
      let matchesPlatform = true;
      if (selectedPlatform === 'Android') {
        matchesPlatform = project.platforms.includes('Android');
      } else if (selectedPlatform === 'iOS') {
        matchesPlatform = project.platforms.includes('iOS');
      } else if (selectedPlatform === 'Android + iOS') {
        matchesPlatform = project.platforms === 'Android + iOS';
      }

      return matchesSearch && matchesCategory && matchesPlatform;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'downloads') {
        const parseDL = (str: string) => parseFloat(str.replace(/[^\d.]/g, '')) * (str.includes('M') ? 1000 : 1);
        return parseDL(b.downloads) - parseDL(a.downloads);
      }
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      // default: featured first, then rating
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return b.rating - a.rating;
    });
  }, [projects, searchQuery, selectedCategory, selectedPlatform, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedPlatform('All');
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'All' || selectedPlatform !== 'All';

  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-x-hidden">
      
      {/* Header Banner */}
      <div className="rounded-2xl sm:rounded-[36px] lg:rounded-[44px] overflow-hidden bg-gradient-to-b from-[#180F2E] via-[#110B20] to-[#0A0714] border border-violet-500/20 p-5 sm:p-12 lg:p-16 text-center max-w-7xl mx-auto shadow-2xl shadow-purple-950/40 relative text-white">
        
        {/* Soft, gentle ambient amethyst glow from the top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-52 bg-gradient-to-b from-violet-500/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />

        {/* Curved Line Arcs & Orbits */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg 
            className="w-full h-full stroke-white/10 fill-none opacity-40 sm:opacity-100" 
            viewBox="0 0 1200 700" 
            preserveAspectRatio="none"
          >
            <path d="M -100,180 C 350,20 600,550 1300,120" strokeWidth="1" />
            <path d="M -50,550 C 400,150 820,120 1250,480" strokeWidth="1" />
            <ellipse cx="780" cy="280" rx="380" ry="340" transform="rotate(-28 780 280)" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono uppercase tracking-wider bg-violet-500/15 text-violet-300 border border-violet-500/25 shadow-sm">
            <span>&#125;</span>
            <span>App Portfolio & Marketplace</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] sm:leading-[1.08]">
            Explore Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-200 to-purple-300">
              Mobile Apps
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300/90 mt-2 sm:mt-3 leading-relaxed max-w-2xl mx-auto font-normal">
            Filter through our native iOS, Android, and cross-platform productions. Click any project to inspect technical architecture, interactive demo videos, and store download links.
          </p>
        </div>
      </div>

      {/* Control Bar: Search & Sort */}
      <div className="p-4 sm:p-6 rounded-2xl sm:rounded-[28px] bg-[#16161D] border border-white/[0.08] shadow-2xl space-y-3 sm:space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by app name, technology, or feature..."
              className="w-full pl-10 pr-10 py-2.5 rounded-full bg-[#0B0B10] border border-white/10 text-xs font-mono text-white placeholder:text-white/40 focus:outline-none focus:border-violet-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-mono uppercase tracking-wider text-white/50 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2 px-3.5 rounded-full bg-[#0B0B10] border border-white/10 text-xs font-mono uppercase text-white focus:outline-none focus:border-violet-400 cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="rating">Highest Rating</option>
              <option value="downloads">Most Downloaded</option>
              <option value="name">Alphabetical (A-Z)</option>
            </select>
          </div>

        </div>

        {/* Filter Rows: Platforms & Categories */}
        <div className="pt-3 border-t border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Platform Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 shrink-0 mr-1 font-semibold">Platform:</span>
            {platforms.map((plat) => (
              <button
                key={plat}
                onClick={() => setSelectedPlatform(plat)}
                className={`px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  selectedPlatform === plat
                    ? 'bg-black text-white border border-violet-400 shadow-md font-bold'
                    : 'bg-[#16151B] text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {plat === 'iOS' && <Apple className="w-3 h-3" />}
                {plat === 'Android' && <Smartphone className="w-3 h-3 text-emerald-400" />}
                <span>{plat}</span>
              </button>
            ))}
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 shrink-0 mr-1 font-semibold">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-black text-white border border-violet-400 shadow-md font-bold'
                    : 'bg-[#16151B] text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Active Filter summary */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-mono text-slate-400">
            <span>
              Showing {filteredProjects.length} matches for current filters
            </span>
            <button
              onClick={clearFilters}
              className="text-violet-400 hover:text-violet-300 font-bold uppercase tracking-wider cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <AppCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="py-20 rounded-[32px] bg-[#0F0E11] border border-white/10 text-center max-w-lg mx-auto p-8 shadow-2xl">
          <p className="text-base text-white font-bold">No applications found</p>
          <p className="text-xs font-mono text-slate-400 mt-1">Try tweaking your search query or selecting a different category filter.</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-6 py-2.5 rounded-full bg-black hover:bg-[#16151B] text-white border border-white/20 font-mono text-xs uppercase tracking-wider cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}

    </div>
  );
};
