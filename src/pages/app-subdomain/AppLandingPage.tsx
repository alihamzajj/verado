import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { detectAppSubdomain, getProjectSubdomain } from '../../utils/subdomain';
import { 
  ShieldCheck, 
  Download, 
  Star, 
  CheckCircle2, 
  ExternalLink, 
  Smartphone, 
  Lock, 
  ArrowRight,
  Cpu,
  Sparkles,
  Play,
  Film,
  Apple,
  ArrowUpRight,
  Menu,
  X,
  Layers,
  ChevronRight,
  Maximize2
} from 'lucide-react';

interface AppLandingPageProps {
  appIdOverride?: string;
  isSubdomainMode?: boolean;
}

export const AppLandingPage: React.FC<AppLandingPageProps> = ({
  appIdOverride,
  isSubdomainMode = false,
}) => {
  const { id } = useParams<{ id: string }>();
  const { projects } = useApp();
  const [selectedScreenshot, setSelectedScreenshot] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeMediaTab, setActiveMediaTab] = useState<'screens' | 'video'>('screens');

  // Determine active app
  const detectedSubdomain = detectAppSubdomain(projects);
  const targetId = appIdOverride || id || (detectedSubdomain ? detectedSubdomain.projectId : 'shoecheck');

  const project = projects.find(
    p => p.id.toLowerCase() === targetId.toLowerCase() ||
         p.id.toLowerCase().replace(/[^a-z0-9]/g, '') === targetId.toLowerCase().replace(/[^a-z0-9]/g, '') ||
         p.name.toLowerCase().replace(/[^a-z0-9]/g, '') === targetId.toLowerCase().replace(/[^a-z0-9]/g, '')
  );

  const appName = project?.name || 'ShoeCheck AI';
  const tagline = project?.tagline || 'Instant Sneaker Legit-Check & Condition Analyzer';
  const description = project?.fullDescription || project?.shortDescription || 'High-performance mobile application engineered with reactive state architectures, on-device intelligence, and responsive haptic interactions.';
  const subdomain = project ? getProjectSubdomain(project) : (detectedSubdomain?.subdomain || targetId);

  // Path to this app's privacy policy
  const privacyPath = isSubdomainMode ? '/privacy' : `/apps/${project?.id || targetId}/privacy`;

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B10] text-slate-100 p-2 sm:p-4 md:p-6 transition-colors duration-300 font-sans selection:bg-violet-600/40">
      <div className="flex-1 flex flex-col max-w-[1440px] w-full mx-auto space-y-4 sm:space-y-6">
        
        {/* 1. FLOATING LUXURY NAVBAR */}
        <header className="sticky top-2 sm:top-4 z-50 w-full px-1 sm:px-0">
          <div className="rounded-[24px] sm:rounded-full bg-[#0D0B14]/80 backdrop-blur-2xl border border-white/[0.08] px-5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] transition-all">
            
            {/* Left: Brand Identity + App Tag */}
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-2 group">
                <span className="text-violet-400 font-mono text-xl font-bold tracking-tight select-none">
                  &#125;
                </span>
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-violet-200 transition-colors">
                  Verado
                </span>
              </a>

              <div className="h-4 w-px bg-white/15 hidden sm:block" />

              <div className="flex items-center gap-2">
                {project?.logo ? (
                  <img 
                    src={project.logo} 
                    alt={appName} 
                    className="w-6 h-6 rounded-lg object-cover ring-1 ring-white/20 shadow-md" 
                  />
                ) : (
                  <div className="w-6 h-6 rounded-lg bg-violet-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
                    {appName.charAt(0)}
                  </div>
                )}
                <span className="font-bold text-sm text-white hidden md:inline-block tracking-tight">
                  {appName}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-violet-950/70 border border-violet-500/30 text-[10px] font-mono text-violet-300 hidden sm:inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{subdomain}.verado.dev</span>
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5">
              <a 
                href="#overview" 
                className="px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/[0.04] transition-all"
              >
                Overview
              </a>
              <a 
                href="#features" 
                className="px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/[0.04] transition-all"
              >
                Features
              </a>
              <a 
                href="#screenshots" 
                className="px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/[0.04] transition-all"
              >
                Screenshots
              </a>
              <a 
                href="#specs" 
                className="px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/[0.04] transition-all"
              >
                Tech Specs
              </a>
              <Link 
                to={privacyPath}
                className="px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider text-violet-300 hover:text-white hover:bg-violet-950/40 border border-violet-500/30 transition-all font-semibold"
              >
                Privacy Policy
              </Link>
            </nav>

            {/* Right CTAs */}
            <div className="flex items-center gap-2.5">
              <Link
                to={privacyPath}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-slate-200 text-xs font-mono uppercase tracking-wider transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                <span>Privacy</span>
              </Link>

              {project?.appStoreUrl ? (
                <a
                  href={project.appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-black hover:bg-slate-200 font-mono text-xs uppercase tracking-wider font-bold transition-all duration-300 shadow-xl hover:scale-105"
                >
                  <Apple className="w-3.5 h-3.5 fill-current" />
                  <span>Get App</span>
                </a>
              ) : (
                <a
                  href="#overview"
                  className="group relative inline-flex items-center gap-2 px-5 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all duration-300 shadow-xl hover:scale-105"
                >
                  <span>Explore App</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-full bg-white/5 text-slate-300 hover:text-white"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>

          {/* Mobile dropdown */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-2 p-4 rounded-3xl bg-[#0D0B14]/95 backdrop-blur-2xl border border-white/10 space-y-3 font-mono text-xs uppercase shadow-2xl">
              <a href="#overview" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white">Overview</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white">Features</a>
              <a href="#screenshots" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white">Screenshots</a>
              <a href="#specs" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white">Tech Specs</a>
              <Link to={privacyPath} onClick={() => setMobileMenuOpen(false)} className="block py-2 text-violet-300 font-bold">Privacy Policy →</Link>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Subdomain: {subdomain}.verado.dev</span>
                <a href="/" className="text-violet-400 hover:underline">Verado Studio ↗</a>
              </div>
            </div>
          )}
        </header>

        {/* 2. SIGNATURE HERO CONTAINER (Clean Widescreen Showcase - NO Mobile Phone Screen) */}
        <section id="overview" className="relative rounded-[36px] sm:rounded-[44px] overflow-hidden hero-radial-glow border border-black/80 shadow-[inset_0_0_35px_rgba(0,0,0,0.85),0_20px_50px_rgba(0,0,0,0.6)] p-6 sm:p-10 lg:p-14 text-white flex flex-col justify-center">
          
          {/* Curved Line Arcs & Orbits */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none stroke-white/20 fill-none" 
            viewBox="0 0 1200 700" 
            preserveAspectRatio="none"
          >
            <path d="M -100,180 C 350,20 600,550 1300,120" strokeWidth="1" />
            <path d="M -50,550 C 400,150 820,120 1250,480" strokeWidth="1" />
            <ellipse cx="780" cy="280" rx="380" ry="340" transform="rotate(-28 780 280)" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
          </svg>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: App Brand, Metadata, and Action Buttons */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* App Icon + Category + Badge */}
              <div className="flex items-center gap-4">
                {project?.logo ? (
                  <img 
                    src={project.logo} 
                    alt={appName}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-1 ring-white/15 shadow-2xl" 
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-violet-600 flex items-center justify-center text-3xl font-black text-white shadow-2xl">
                    {appName.charAt(0)}
                  </div>
                )}
                
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1">
                      <span>&#125;</span>
                      <span>{project?.category || 'Flagship Mobile'}</span>
                    </span>
                    {project?.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-violet-400 text-black">
                        {project.badge}
                      </span>
                    )}
                  </div>
                  
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-950/70 border border-violet-500/30 text-[11px] font-mono text-violet-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{subdomain}.verado.dev</span>
                  </span>
                </div>
              </div>

              {/* Title & Headline */}
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.06]">
                  {appName}
                </h1>

                <p className="text-base sm:text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-200 to-purple-200 leading-snug">
                  {tagline}
                </p>
              </div>

              {/* Description */}
              <div className="flex items-start gap-2.5 max-w-xl">
                <span className="text-violet-400 font-mono text-lg font-bold select-none leading-none pt-0.5">
                  &#125;
                </span>
                <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed font-normal">
                  {description}
                </p>
              </div>

              {/* Metrics & Ratings */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 py-2 border-y border-white/[0.08] font-mono text-xs">
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-current text-amber-400" />
                  <span className="text-white font-bold">{project?.rating || 4.9}</span>
                  <span className="text-slate-400 text-[11px]">({project?.reviewsCount ? `${(project.reviewsCount / 1000).toFixed(1)}k` : '14k'} reviews)</span>
                </div>
                <div className="w-px h-5 bg-white/15" />
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Download className="w-3.5 h-3.5 text-violet-400" />
                  <span className="font-semibold text-white">{project?.downloads || '850K+'}</span>
                  <span className="text-slate-400 text-[11px]">Downloads</span>
                </div>
                <div className="w-px h-5 bg-white/15" />
                <div className="text-slate-300">
                  <span className="text-slate-400 text-[11px]">Build: </span>
                  <span className="text-violet-300 font-semibold">v{project?.version || '3.2.1'}</span>
                </div>
              </div>

              {/* Store & Privacy Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {project?.appStoreUrl && (
                  <a
                    href={project.appStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white text-black hover:bg-slate-200 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xl hover:scale-105"
                  >
                    <Apple className="w-4 h-4 fill-current" />
                    <span>Apple App Store</span>
                  </a>
                )}

                {project?.playStoreUrl && (
                  <a
                    href={project.playStoreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-black hover:bg-[#16151B] text-white border border-white/20 hover:border-violet-400 font-mono text-xs uppercase tracking-wider transition-all duration-300 shadow-xl"
                  >
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>Google Play</span>
                  </a>
                )}

                <Link
                  to={privacyPath}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-violet-950/60 hover:bg-violet-900/70 text-violet-200 border border-violet-500/40 font-mono text-xs uppercase tracking-wider transition-all shadow-lg"
                >
                  <ShieldCheck className="w-4 h-4 text-violet-400" />
                  <span>Privacy Policy</span>
                </Link>
              </div>

              {/* Verification Disclosures */}
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono pt-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Apple & Google Play privacy verified • On-device neural inference • Zero data selling</span>
              </div>

            </div>

            {/* Right Column: Cinematic Widescreen Media Display (NO Mobile Phone Screen) */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              
              {/* Media Switcher Tab (if both video & screenshots exist) */}
              {project?.demoVideoUrl && (
                <div className="mb-3 inline-flex items-center gap-1.5 p-1 rounded-full bg-[#0D0B14]/90 border border-white/10 shadow-lg backdrop-blur-md w-fit font-mono text-[11px] uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => setActiveMediaTab('screens')}
                    className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                      activeMediaTab === 'screens' 
                        ? 'bg-white/15 text-white border border-white/20 font-bold shadow-md' 
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Screenshots
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMediaTab('video')}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                      activeMediaTab === 'video' 
                        ? 'bg-violet-600 text-white font-bold shadow-md' 
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current text-white" />
                    <span>Video Trailer</span>
                  </button>
                </div>
              )}

              {/* Widescreen Media Showcase Container */}
              <div className="relative rounded-[32px] overflow-hidden bg-[#100E17] border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.8)] aspect-[16/10] w-full flex items-center justify-center group">
                
                {/* Subtle crystal glow backdrop */}
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/10 via-transparent to-purple-600/15 pointer-events-none" />

                {activeMediaTab === 'video' && project?.demoVideoUrl ? (
                  <video
                    src={project.demoVideoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : project?.screenshots && project.screenshots.length > 0 ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={project.screenshots[selectedScreenshot] || project.screenshots[0]} 
                      alt={`${appName} preview`}
                      className="w-full h-full object-cover transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono">
                      <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-white font-semibold">
                        Preview 0{selectedScreenshot + 1}
                      </span>
                      <span className="text-white/70 text-[11px]">
                        {appName} Interface
                      </span>
                    </div>
                  </div>
                ) : project?.coverImage ? (
                  <img 
                    src={project.coverImage} 
                    alt={appName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="p-8 text-center space-y-2">
                    <Layers className="w-12 h-12 text-violet-400 mx-auto" />
                    <h3 className="font-bold text-white text-lg">{appName}</h3>
                    <p className="text-xs text-slate-400">{tagline}</p>
                  </div>
                )}

              </div>

              {/* Quick Thumbnail Strip */}
              {project?.screenshots && project.screenshots.length > 1 && (
                <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                  {project.screenshots.slice(0, 4).map((shot, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedScreenshot(idx);
                        setActiveMediaTab('screens');
                      }}
                      className={`relative rounded-xl overflow-hidden border transition-all h-14 w-20 flex-shrink-0 cursor-pointer ${
                        selectedScreenshot === idx && activeMediaTab === 'screens'
                          ? 'border-violet-400 ring-2 ring-violet-500/50 scale-105'
                          : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={shot} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

            </div>

          </div>

        </section>

        {/* 3. STATS SECTION (Signature NixtNode Metric Cards with Technical Dividers) */}
        <section className="relative px-1 sm:px-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
            
            {/* Stat Card 1 */}
            <div className="relative rounded-[32px] bg-[#0E0D14] border border-white/[0.08] p-6 sm:p-8 shadow-2xl flex flex-col justify-between h-full min-h-[200px] transition-transform duration-300 hover:-translate-y-1.5 group backdrop-blur-xl shadow-[0_12px_36px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1.5">
                  <span className="text-violet-400 font-bold">&#125;</span>
                  <span>METRIC 01</span>
                </span>
                <div className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_#A78BFA]" />
              </div>

              <div>
                <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-200 via-purple-300 to-violet-400 tracking-tight">
                  {project?.downloads || '850K+'}
                </div>
                
                {/* Technical Node Divider Line */}
                <div className="flex items-center justify-between w-full my-3 opacity-60">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_6px_#A78BFA]" />
                  <div className="flex-1 h-px bg-white/20 mx-2" />
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_6px_#A78BFA]" />
                </div>

                <div className="flex items-baseline justify-between">
                  <p className="text-xs sm:text-sm text-slate-200 font-medium">
                    Verified Global Installations
                  </p>
                  <span className="font-mono text-[10px] text-emerald-400 font-semibold">Active</span>
                </div>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="relative rounded-[32px] bg-[#0E0D14] border border-white/[0.08] p-6 sm:p-8 shadow-2xl flex flex-col justify-between h-full min-h-[200px] transition-transform duration-300 hover:-translate-y-1.5 group backdrop-blur-xl shadow-[0_12px_36px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1.5">
                  <span className="text-violet-400 font-bold">&#125;</span>
                  <span>METRIC 02</span>
                </span>
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
              </div>

              <div>
                <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-300 to-emerald-400 tracking-tight flex items-center gap-2">
                  <span>{project?.rating ? project.rating.toFixed(1) : '4.9'}</span>
                  <Star className="w-7 h-7 fill-emerald-400 text-emerald-400" />
                </div>
                
                {/* Technical Node Divider Line */}
                <div className="flex items-center justify-between w-full my-3 opacity-60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399]" />
                  <div className="flex-1 h-px bg-white/20 mx-2" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399]" />
                </div>

                <div className="flex items-baseline justify-between">
                  <p className="text-xs sm:text-sm text-slate-200 font-medium">
                    Store Satisfaction Rating
                  </p>
                  <span className="font-mono text-[10px] text-slate-400">{project?.reviewsCount ? `${(project.reviewsCount / 1000).toFixed(1)}k Reviews` : 'Top Tier'}</span>
                </div>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="relative rounded-[32px] bg-[#0E0D14] border border-white/[0.08] p-6 sm:p-8 shadow-2xl flex flex-col justify-between h-full min-h-[200px] transition-transform duration-300 hover:-translate-y-1.5 group backdrop-blur-xl shadow-[0_12px_36px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1.5">
                  <span className="text-violet-400 font-bold">&#125;</span>
                  <span>METRIC 03</span>
                </span>
                <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#C084FC]" />
              </div>

              <div>
                <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-violet-300 to-pink-300 tracking-tight">
                  &lt;50ms
                </div>
                
                {/* Technical Node Divider Line */}
                <div className="flex items-center justify-between w-full my-3 opacity-60">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_#C084FC]" />
                  <div className="flex-1 h-px bg-white/20 mx-2" />
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_#C084FC]" />
                </div>

                <div className="flex items-baseline justify-between">
                  <p className="text-xs sm:text-sm text-slate-200 font-medium">
                    Local-First On-Device AI Inference
                  </p>
                  <span className="font-mono text-[10px] text-violet-300 font-semibold">120 FPS</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 4. CLEAN SCREENSHOT CARDS (Clean Showcase - NO mobile phone frames) */}
        {project?.screenshots && project.screenshots.length > 0 && (
          <section id="screenshots" className="rounded-[36px] sm:rounded-[44px] bg-[#0E0D14] border border-white/[0.08] p-6 sm:p-10 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-violet-400 font-mono text-xs uppercase tracking-wider block font-bold">
                  &#125; Interface Gallery
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                  Product UI & Screenshots
                </h2>
              </div>
              <p className="text-xs font-mono text-slate-400">
                Verified high-resolution application screens
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {project.screenshots.map((shot, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-violet-400 transition-all duration-300 shadow-xl bg-[#12111A] aspect-[9/16]"
                >
                  <img 
                    src={shot} 
                    alt={`Screenshot ${idx + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between font-mono text-xs">
                    <span className="text-white font-bold text-[11px]">
                      Screen 0{idx + 1}
                    </span>
                    <span className="text-violet-300 text-[10px]">
                      {appName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. CORE FEATURES GRID */}
        <section id="features" className="rounded-[36px] sm:rounded-[44px] bg-[#0C0B12] border border-white/[0.08] p-6 sm:p-10 lg:p-12 shadow-2xl space-y-8">
          <div>
            <span className="text-violet-400 font-mono text-xs uppercase tracking-wider block font-bold">
              &#125; Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
              Precision Engineering & Features
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(project?.features || [
              'On-device convolutional neural network acceleration',
              'Sub-50ms offline inference pipeline',
              'Automated cryptographic verification and signatures',
              'Haptic-feedback micro-interactions',
              'Low-battery background telemetry sync',
              'Zero cloud storage without user confirmation',
            ]).map((feat, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-[28px] bg-[#12111A] border border-white/[0.08] hover:border-violet-500/40 transition-all duration-300 space-y-3 group shadow-xl hover:-translate-y-1"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/30 flex items-center justify-center text-violet-300 group-hover:bg-violet-600/20 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-violet-200 transition-colors">
                  {feat}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Engineered with native platform hardware integration, delivering consistent 120 FPS performance and zero noticeable UI latency.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. TECH STACK SPECIFICATIONS */}
        <section id="specs" className="rounded-[36px] sm:rounded-[44px] bg-[#0E0D14] border border-white/[0.08] p-6 sm:p-10 shadow-2xl space-y-6">
          <div>
            <span className="text-violet-400 font-mono text-xs uppercase tracking-wider block font-bold">
              &#125; Stack Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Technical Specifications
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
            {(project?.technologies || ['Flutter', 'CoreML', 'TensorFlow Lite', 'FastAPI', 'SQLite', 'Metal']).map((tech, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#14121F] border border-white/[0.08] text-center space-y-1.5 hover:border-violet-500/30 transition-colors">
                <Cpu className="w-5 h-5 text-violet-400 mx-auto" />
                <span className="text-white font-medium block text-xs">{tech}</span>
                <span className="text-[10px] text-slate-500 uppercase">Framework</span>
              </div>
            ))}
          </div>
        </section>

        {/* 7. PRIVACY PLEDGE CARD (App Store & Google Play Ready) */}
        <section className="relative rounded-[36px] sm:rounded-[44px] overflow-hidden p-8 sm:p-12 bg-gradient-to-r from-violet-950/70 via-[#13111F] to-[#0E0D16] border border-violet-500/40 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Apple & Google Play Certified Privacy Architecture</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Privacy by Design. Zero Data Monetization.
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We never sell your camera frames, biometric health metrics, or academic notes to advertising networks. Read our formal legal policy crafted for App Store and Google Play compliance.
            </p>

            <div className="pt-2">
              <Link
                to={privacyPath}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-xl hover:scale-105"
              >
                <span>Read Full Privacy Policy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* 8. FOOTER */}
        <footer className="mt-8 pt-8 pb-4 border-t border-white/[0.08] text-xs font-mono text-slate-400 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-violet-400 font-bold">&#125;</span>
              <span className="text-white font-bold">{appName}</span>
              <span className="text-slate-600">•</span>
              <span className="text-violet-300">{subdomain}.verado.dev</span>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <Link to={privacyPath} className="text-violet-300 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <a href="mailto:support@verado.dev" className="hover:text-white transition-colors">
                Support
              </a>
              <a href="/" className="hover:text-white transition-colors flex items-center gap-1">
                <span>Verado Main Studio</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          <div className="text-center sm:text-left text-[11px] text-slate-500 pt-2 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© 2026 Verado Mobile Studios Inc. All rights reserved.</p>
            <p>App Store Review Guideline 5.1.1 & Google Play Certified</p>
          </div>
        </footer>

      </div>
    </div>
  );
};
