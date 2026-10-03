import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { detectAppSubdomain, getProjectSubdomain } from '../../utils/subdomain';
import { Modal } from '../../components/common/Modal';
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
  Maximize2,
  Copy,
  Check
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
  const [downloadModalPlatform, setDownloadModalPlatform] = useState<'ios' | 'android' | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

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

  const handleOpenDownload = (platform: 'ios' | 'android') => {
    setDownloadModalPlatform(platform);
  };

  const handleCopyLink = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const iosUrl = project?.appStoreUrl || `https://apps.apple.com/app/${appName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  const androidUrl = project?.playStoreUrl || `https://play.google.com/store/apps/details?id=dev.verado.${subdomain}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0B10] text-slate-100 p-2 sm:p-4 md:p-6 transition-colors duration-300 font-sans selection:bg-violet-600/40">
      <div className="flex-1 flex flex-col max-w-[1440px] w-full mx-auto space-y-4 sm:space-y-6">
        
        {/* 1. FLOATING LUXURY NAVBAR */}
        <header className="sticky top-2 sm:top-4 z-50 w-full px-1 sm:px-0">
          <div className="flex items-center justify-between p-3 sm:p-4 rounded-full bg-[#0D0B14]/85 backdrop-blur-2xl border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
            
            {/* App Brand & Subdomain indicator */}
            <div className="flex items-center gap-3 pl-2 sm:pl-3">
              <a 
                href="/" 
                className="text-xs font-mono font-bold uppercase tracking-wider text-violet-400 hover:text-white transition-colors flex items-center gap-1.5"
                title="Return to Verado Main Studio"
              >
                <span>VERADO</span>
                <span className="text-white/40">/</span>
              </a>

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
                href="#download" 
                className="px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider text-violet-300 hover:text-white hover:bg-violet-950/40 border border-violet-500/30 transition-all font-semibold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-violet-400" />
                <span>Download</span>
              </a>
              <a 
                href="#specs" 
                className="px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/[0.04] transition-all"
              >
                Tech Specs
              </a>
              <Link 
                to={privacyPath}
                className="px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/[0.04] transition-all"
              >
                Privacy
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

              {/* Prominent Glowing Download Button */}
              <a
                href="#download"
                className="group relative inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_25px_rgba(139,92,246,0.55)] hover:scale-105"
              >
                <Download className="w-3.5 h-3.5 animate-bounce" />
                <span>Download App</span>
              </a>

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
              <a href="#download" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-violet-300 font-bold flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                <span>Download App →</span>
              </a>
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

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1">
                      <span>&#125;</span>
                      <span>{project?.category || 'Mobile Intelligence'}</span>
                    </span>

                    {project?.badge && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-violet-400 text-black">
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

              {/* Store & Download Action Buttons */}
              <div className="space-y-3 pt-1">
                <div className="flex flex-wrap items-center gap-3">
                  
                  {/* Primary Download Anchor */}
                  <a
                    href="#download"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(139,92,246,0.4)] hover:shadow-[0_0_35px_rgba(139,92,246,0.6)] hover:scale-105"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download App</span>
                  </a>

                  {/* Direct Apple App Store Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenDownload('ios')}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-white text-black hover:bg-slate-200 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xl hover:scale-105 cursor-pointer"
                  >
                    <Apple className="w-4 h-4 fill-current" />
                    <span>App Store</span>
                  </button>

                  {/* Direct Google Play Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenDownload('android')}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-black hover:bg-[#16151B] text-white border border-white/20 hover:border-violet-400 font-mono text-xs uppercase tracking-wider transition-all duration-300 shadow-xl cursor-pointer hover:scale-105"
                  >
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>Google Play</span>
                  </button>

                  {/* Privacy Policy */}
                  <Link
                    to={privacyPath}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-violet-950/60 hover:bg-violet-900/70 text-violet-200 border border-violet-500/40 font-mono text-xs uppercase tracking-wider transition-all shadow-lg"
                  >
                    <ShieldCheck className="w-4 h-4 text-violet-400" />
                    <span>Privacy Policy</span>
                  </Link>
                </div>

                {/* Build & Package Details Pill */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-400">
                  <span className="text-emerald-400 font-semibold">● Official Store Releases</span>
                  <span>•</span>
                  <span>v{project?.version || '3.2.1'}</span>
                  <span>•</span>
                  <span>Package Size: {project?.size || '48.2 MB'}</span>
                  <span>•</span>
                  <span>{project?.platforms || 'iOS + Android'}</span>
                </div>
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

              {/* Main Widescreen Showcase Container */}
              <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.8)] bg-gradient-to-b from-[#13111C] to-[#0A0910] group aspect-[16/10] flex items-center justify-center">
                
                {activeMediaTab === 'video' && project?.demoVideoUrl ? (
                  /* Widescreen Video Player */
                  <div className="w-full h-full relative flex items-center justify-center bg-black">
                    <video
                      src={project.demoVideoUrl}
                      controls
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  /* Widescreen Screenshot Showcase */
                  <div className="w-full h-full relative overflow-hidden flex items-center justify-center p-3">
                    <img
                      src={
                        (project?.screenshots && project.screenshots[selectedScreenshot]) || 
                        project?.coverImage || 
                        project?.logo || 
                        'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=1200'
                      }
                      alt={`${appName} preview`}
                      className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl transition-all duration-500 group-hover:scale-[1.02]"
                    />

                    {/* Subtle Amethyst Glass Glow on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-white/90 px-3 py-2 rounded-xl bg-[#0B0A12]/80 backdrop-blur-md border border-white/10">
                      <span className="truncate flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-violet-400" />
                        <span>Interactive App Preview</span>
                      </span>
                      <span className="text-[10px] text-violet-300 font-bold uppercase tracking-wider">
                        High-Res UI
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Screenshot Selector Thumbs (Flat Widescreen Thumbnails) */}
              {project?.screenshots && project.screenshots.length > 1 && (
                <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                  {project.screenshots.slice(0, 5).map((screen, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedScreenshot(idx);
                        setActiveMediaTab('screens');
                      }}
                      className={`relative flex-shrink-0 w-16 h-12 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                        selectedScreenshot === idx && activeMediaTab === 'screens'
                          ? 'border-violet-400 ring-2 ring-violet-500/50 scale-105 shadow-lg'
                          : 'border-white/15 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={screen} 
                        alt={`Screen thumbnail ${idx + 1}`} 
                        className="w-full h-full object-cover" 
                      />
                    </button>
                  ))}
                </div>
              )}

            </div>

          </div>
        </section>

        {/* 3. WIDESCREEN SCREENSHOT GALLERY (Clean Cards - NO Phone Frames) */}
        {project?.screenshots && project.screenshots.length > 0 && (
          <section id="screenshots" className="rounded-[36px] sm:rounded-[44px] bg-[#0E0D14] border border-white/[0.08] p-6 sm:p-10 lg:p-12 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-violet-400 font-mono text-xs uppercase tracking-wider block font-bold">
                  &#125; Interface Gallery
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
                  High-Fidelity Application Views
                </h2>
              </div>
              <p className="text-xs font-mono text-slate-400 max-w-sm">
                Clean architectural UI designed for zero cognitive fatigue, responsive typography, and tactile precision.
              </p>
            </div>

            {/* Flat Widescreen Screenshot Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {project.screenshots.map((screen, idx) => (
                <div 
                  key={idx}
                  className="group relative rounded-3xl overflow-hidden bg-[#13111C] border border-white/10 hover:border-violet-500/50 shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-[16/10] overflow-hidden flex items-center justify-center p-3 bg-gradient-to-b from-[#181624] to-[#0D0B14]">
                    <img 
                      src={screen} 
                      alt={`${appName} screen ${idx + 1}`}
                      className="max-h-full max-w-full object-contain rounded-xl transition-transform duration-500 group-hover:scale-105" 
                    />
                  </div>
                  
                  <div className="p-4 border-t border-white/[0.06] bg-[#0F0E17] flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300 font-medium">Screen {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedScreenshot(idx);
                        setActiveMediaTab('screens');
                        window.scrollTo({ top: 180, behavior: 'smooth' });
                      }}
                      className="text-violet-400 hover:text-violet-300 flex items-center gap-1 cursor-pointer font-bold"
                    >
                      <span>Show in Hero</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. CORE FEATURES GRID */}
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

        {/* 5. DEDICATED STORE DOWNLOAD & INSTALLATION SECTION (#download) */}
        <section id="download" className="rounded-[36px] sm:rounded-[44px] bg-gradient-to-b from-[#100E1A] to-[#0A0910] border border-violet-500/30 p-6 sm:p-10 lg:p-14 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_35px_rgba(139,92,246,0.15)] space-y-8 relative overflow-hidden">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-violet-400 font-mono text-xs uppercase tracking-wider block font-bold flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" />
                <span>&#125; Official Store Downloads</span>
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-1">
                Get {appName} on iOS & Android
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-400 max-w-md">
              Download official, certified releases directly through the Apple App Store and Google Play Store with automated delta updates.
            </p>
          </div>

          {/* 2 Official Store Platform Cards: Apple App Store & Google Play */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            
            {/* Card 1: Apple iOS Edition */}
            <div className="rounded-[30px] bg-[#141221] border border-white/10 hover:border-violet-400/50 p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all duration-300 hover:-translate-y-1 shadow-xl group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <Apple className="w-6 h-6 fill-current" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-violet-950/80 border border-violet-500/40 text-[10px] font-mono text-violet-300 font-bold uppercase">
                    iOS / iPadOS
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-violet-200 transition-colors">
                    Apple App Store
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Native Metal acceleration & Apple Neural Engine support engineered specifically for iPhone and iPad devices.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/[0.08] text-xs font-mono text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Requirements:</span>
                    <span className="text-white font-medium">{project?.minIos || 'iOS 16.0 or later'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Store Rating:</span>
                    <span className="text-amber-400 font-medium">★ {project?.rating || 4.9} / 5.0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Package Size:</span>
                    <span className="text-violet-300 font-medium">{project?.size || '48.2 MB'}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenDownload('ios')}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-white text-black hover:bg-slate-200 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xl cursor-pointer hover:scale-[1.02]"
              >
                <Apple className="w-4 h-4 fill-current" />
                <span>Download on App Store</span>
              </button>
            </div>

            {/* Card 2: Google Play Edition */}
            <div className="rounded-[30px] bg-[#141221] border border-white/10 hover:border-emerald-500/50 p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all duration-300 hover:-translate-y-1 shadow-xl group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-black border border-white/20 text-emerald-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-bold uppercase">
                    Android & Tablets
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-emerald-200 transition-colors">
                    Google Play Store
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Optimized for 64-bit Android architecture with on-device TensorFlow Lite and adaptive background workers.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/[0.08] text-xs font-mono text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Requirements:</span>
                    <span className="text-white font-medium">{project?.minAndroid || 'Android 10.0+'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Total Installs:</span>
                    <span className="text-emerald-400 font-medium">{project?.downloads || '850K+'} active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Certification:</span>
                    <span className="text-white font-medium">Google Play Certified</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenDownload('android')}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-black hover:bg-[#1C1A24] text-white border border-white/25 hover:border-emerald-400 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-xl cursor-pointer hover:scale-[1.02]"
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Get on Google Play</span>
              </button>
            </div>

          </div>

          {/* Security & Integrity Disclosure */}
          <div className="relative z-10 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Certified 100% Clean: Zero Adware • Zero Background Location Tracking • Official App Stores Only</span>
            </div>
            <Link to={privacyPath} className="text-violet-400 hover:text-white transition-colors underline flex items-center gap-1">
              <span>Read Store Compliance Privacy Policy</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
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
              <a href="#download" className="text-violet-300 hover:text-white transition-colors flex items-center gap-1">
                <Download className="w-3 h-3" />
                <span>Download App</span>
              </a>
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

      {/* 9. STICKY FLOATING QUICK DOWNLOAD PILL */}
      <div className="fixed bottom-5 right-5 z-40 hidden sm:flex items-center gap-2 p-1.5 pl-3 rounded-full bg-[#12101C]/90 backdrop-blur-xl border border-violet-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(139,92,246,0.25)]">
        <span className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{appName}</span>
        </span>
        <button
          type="button"
          onClick={() => handleOpenDownload(project?.platforms.includes('iOS') ? 'ios' : 'android')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer hover:scale-105"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>
      </div>

      {/* 10. INTERACTIVE DOWNLOAD MODAL */}
      {downloadModalPlatform && (
        <Modal
          isOpen={!!downloadModalPlatform}
          onClose={() => setDownloadModalPlatform(null)}
          title={`Download ${appName}`}
          subtitle={`Get the official ${downloadModalPlatform === 'ios' ? 'Apple App Store' : 'Google Play Store'} release`}
          maxWidth="max-w-md"
        >
          <div className="text-center py-4 space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-violet-600/20 text-violet-300 flex items-center justify-center mx-auto border border-violet-500/30 shadow-xl">
              {downloadModalPlatform === 'ios' ? (
                <Apple className="w-8 h-8 fill-current" />
              ) : (
                <Smartphone className="w-8 h-8 text-emerald-400" />
              )}
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">
                {downloadModalPlatform === 'ios' 
                  ? 'Apple App Store Official Release' 
                  : 'Google Play Store Official Release'}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                {downloadModalPlatform === 'ios'
                  ? 'Verified on iOS & iPadOS. Includes Apple Neural Engine acceleration and automatic delta updates.'
                  : 'Certified by Google Play Protect. Full hardware camera and offline SQLite synchronization enabled.'}
              </p>
            </div>

            {/* Link Preview with Copy */}
            <div className="p-3 rounded-xl bg-black/90 font-mono text-[11px] text-violet-300 border border-white/10 flex items-center justify-between gap-2">
              <span className="truncate text-left">
                {downloadModalPlatform === 'ios' ? iosUrl : androidUrl}
              </span>
              <button
                type="button"
                onClick={() => handleCopyLink(downloadModalPlatform === 'ios' ? iosUrl : androidUrl)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex-shrink-0 cursor-pointer"
                title="Copy Store Link"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
              </button>
            </div>

            <div className="space-y-2 pt-1">
              <a
                href={downloadModalPlatform === 'ios' ? iosUrl : androidUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-xl hover:scale-[1.02]"
              >
                <Download className="w-4 h-4" />
                <span>Open in {downloadModalPlatform === 'ios' ? 'App Store' : 'Google Play'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setDownloadModalPlatform(null)}
                className="w-full py-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
