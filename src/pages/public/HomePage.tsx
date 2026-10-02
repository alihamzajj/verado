import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Star, 
  Download, 
  Smartphone, 
  CheckCircle, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Zap, 
  Apple, 
  ExternalLink 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppCard } from '../../components/common/AppCard';
import { DeviceMockup } from '../../components/common/DeviceMockup';

export const HomePage: React.FC = () => {
  const { projects } = useApp();
  const featuredProjects = projects.filter(p => p.featured && p.published && !p.isArchived);
  const latestProjects = projects.filter(p => p.published && !p.isArchived).slice(0, 6);

  const [activeHeroApp, setActiveHeroApp] = useState<'brainwave' | 'lenz' | 'shoecheck'>('brainwave');

  const heroAppDetails = {
    brainwave: {
      name: 'BrainWave AI Studio',
      category: 'Neural App Suite',
      tagline: 'Hardware-accelerated AI models & fluid 120 FPS interface',
      stats: '1.8M+ Downloads • 4.9 ★',
      img: '/phone-screen.jpg',
      accent: '#A78BFA',
      id: 'brainwave-ai',
      hideStatusBar: false,
    },
    lenz: {
      name: 'Lenz AI Authenticator',
      category: 'AI Computer Vision',
      tagline: 'Instant item verification & multi-category AI legitimacy scanner',
      stats: '1.2M+ Scans • 4.9 ★',
      img: '/lenz-screen-cropped.png',
      accent: '#10B981',
      id: 'shoecheck',
      hideStatusBar: false,
      darkStatusBar: true,
    },
    shoecheck: {
      name: 'ShoeCheck AI',
      category: 'Computer Vision',
      tagline: 'Instant Sneaker Legit-Check & Condition Analyzer',
      stats: '850K+ Downloads • 4.9 ★',
      img: '/phone-sneaker.svg',
      accent: '#8B5CF6',
      id: 'shoecheck',
      hideStatusBar: false,
    },
  };

  const techStack = [
    { name: 'Flutter & Dart', category: 'Cross-Platform Framework', desc: 'Single-codebase native performance across iOS and Android with 120 FPS rendering.' },
    { name: 'Swift & SwiftUI', category: 'Apple Native', desc: 'Hardware-accelerated Metal pipelines, CoreML neural models, and Live Activities.' },
    { name: 'Kotlin Multiplatform', category: 'Android & Shared Logic', desc: 'Jetpack Compose and modern reactive architecture with coroutines.' },
    { name: 'TensorFlow Lite & CoreML', category: 'On-Device AI', desc: 'Sub-50ms offline inference models for object detection, segmentation, and OCR.' },
    { name: 'FastAPI & Python', category: 'Microservices', desc: 'Asynchronous cloud pipelines for batch model retraining and telemetry sync.' },
    { name: 'Supabase & SQLite', category: 'Data & Sync', desc: 'Local-first encrypted SQLite storage with real-time distributed sync.' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* 1. HERO CONTAINER (NixtNode Inspired Radial Glow + Curved Orbits + Front Phone Showcase) */}
      <section className="relative rounded-[36px] sm:rounded-[44px] overflow-hidden hero-radial-glow border border-black/80 shadow-[inset_0_0_35px_rgba(0,0,0,0.85),0_20px_50px_rgba(0,0,0,0.6)] p-6 sm:p-10 lg:p-14 text-white flex flex-col justify-center">
        
        {/* Curved Line Arcs & Orbits (1px stroke thin curves from reference) */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none stroke-white/20 fill-none" 
          viewBox="0 0 1200 700" 
          preserveAspectRatio="none"
        >
          <path d="M -100,180 C 350,20 600,550 1300,120" strokeWidth="1" />
          <path d="M -50,550 C 400,150 820,120 1250,480" strokeWidth="1" />
          <path d="M 400,50 C 700,120 950,420 1020,700" strokeWidth="1" strokeDasharray="3 3" opacity="0.35" />
          <ellipse cx="780" cy="280" rx="380" ry="340" transform="rotate(-28 780 280)" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
        </svg>

        {/* Unified Hero Grid: Left Content + Right Front Cellphone Mockup */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column: Heading, Description, CTAs, and Interactive Switcher */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-violet-400 font-mono text-3xl sm:text-5xl font-bold select-none leading-none">
                  &#125;
                </span>
                <span className="font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight">
                  Verado
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05] max-w-2xl">
                Building M
                <span className="relative inline-flex items-center justify-center mx-0.5">
                  o
                  {/* NixtNode Orbital Atom Ring around letter 'o' as seen in reference */}
                  <span className="absolute -inset-1 sm:-inset-1.5 rounded-full border border-violet-400/80 animate-[spin_8s_linear_infinite]" />
                  <span className="absolute -top-1 -right-0.5 w-1.5 h-1.5 rounded-full bg-violet-300 shadow-[0_0_6px_#C4B5FD]" />
                </span>
                bile Apps That Makes Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-200 to-purple-200">
                  Life Easy
                </span>
              </h1>
            </div>

            <div className="flex items-start gap-2.5 max-w-xl">
              <span className="text-violet-400 font-mono text-lg font-bold select-none leading-none pt-0.5">
                &#125;
              </span>
              <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed font-normal">
                Renowned for engineering top-ranked iOS and Android applications combining reactive state architectures, on-device intelligence, and responsive haptic interactions.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-black hover:bg-[#16151B] text-white border border-white/20 hover:border-violet-400 font-mono text-xs uppercase tracking-widest transition-all duration-300 shadow-xl hover:scale-105 cursor-pointer"
              >
                GET IN TOUCH
              </Link>
              <a
                href="#featured"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-black/60 hover:bg-black text-slate-300 hover:text-white border border-white/15 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer backdrop-blur-md"
              >
                EXPLORE APPS
              </a>
            </div>

            {/* Interactive Hero Tab Selector */}
            <div className="pt-2 space-y-2.5">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-violet-300/80">
                <span>&#125;</span>
                <span>SWITCH LIVE PREVIEW</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-full bg-[#0D0B14]/80 border border-white/10 w-fit shadow-xl backdrop-blur-md">
                <button
                  onClick={() => setActiveHeroApp('brainwave')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    activeHeroApp === 'brainwave' 
                      ? 'bg-white/15 text-white border border-white/20 font-bold shadow-md' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Neural Studio
                </button>
                <button
                  onClick={() => setActiveHeroApp('lenz')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    activeHeroApp === 'lenz' 
                      ? 'bg-white/15 text-white border border-white/20 font-bold shadow-md' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  Lenz
                </button>
                <button
                  onClick={() => setActiveHeroApp('shoecheck')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                    activeHeroApp === 'shoecheck' 
                      ? 'bg-white/15 text-white border border-white/20 font-bold shadow-md' 
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  ShoeCheck AI
                </button>
              </div>

              <div>
                <Link
                  to={`/projects/${heroAppDetails[activeHeroApp].id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-violet-300 hover:text-white transition-colors"
                >
                  <span>Inspect {heroAppDetails[activeHeroApp].name} specifications</span>
                  <ArrowRight className="w-3.5 h-3.5 text-violet-400" />
                </Link>
              </div>
            </div>

          </div>

          {/* Right Column: Front Cellphone with Deployment-Safe Animation & Ambient Glow (Shifted slightly left from right) */}
          <div className="lg:col-span-5 flex justify-center items-center relative pt-4 lg:pt-0 lg:-translate-x-12 xl:-translate-x-16">
            {/* Ambient Purple Radial Glow behind phone */}
            <div className="absolute w-72 h-72 bg-violet-600/35 rounded-full blur-3xl pointer-events-none animate-phone-glow" />

            {/* Floating Phone with Deployment-Safe Pure CSS Animation */}
            <div className="relative z-10 animate-phone-float transition-all duration-300">
              <DeviceMockup
                appName={heroAppDetails[activeHeroApp].name}
                tagline={heroAppDetails[activeHeroApp].tagline}
                category={heroAppDetails[activeHeroApp].category}
                imageSrc={heroAppDetails[activeHeroApp].img}
                accentColor={heroAppDetails[activeHeroApp].accent}
                hideStatusBar={Boolean((heroAppDetails[activeHeroApp] as any).hideStatusBar)}
                darkStatusBar={Boolean((heroAppDetails[activeHeroApp] as any).darkStatusBar)}
              />
            </div>
          </div>

        </div>

      </section>

      {/* 2. STATS SECTION (Signature NixtNode Blackish Cards with Technical Divider Nodes) */}
      <section className="relative px-2 sm:px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
          
          {/* Stat Card 1 */}
          <div className="relative rounded-[32px] bg-[#0E0D14] border border-white/[0.08] p-6 sm:p-8 shadow-2xl flex flex-col justify-between h-full min-h-[220px] transition-transform duration-300 hover:-translate-y-1.5 group backdrop-blur-xl shadow-[0_12px_36px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <span className="text-violet-400 font-bold">&#125;</span>
                <span>METRIC 01</span>
              </span>
              <div className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_#A78BFA]" />
            </div>

            <div>
              <div className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-200 via-purple-300 to-violet-400 tracking-tight">
                5.8M+
              </div>
              
              {/* Technical Node Divider Line from Reference */}
              <div className="flex items-center justify-between w-full my-3 opacity-60">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_6px_#A78BFA]" />
                <div className="flex-1 h-px bg-white/20 mx-2" />
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_6px_#A78BFA]" />
              </div>

              <div className="flex items-baseline justify-between">
                <p className="text-xs sm:text-sm text-slate-200 font-medium">
                  App Store & Google Play Downloads
                </p>
                <span className="text-[10px] font-mono text-violet-300/80 shrink-0 ml-2">150+ Countries</span>
              </div>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="relative rounded-[32px] bg-[#0E0D14] border border-white/[0.08] p-6 sm:p-8 shadow-2xl flex flex-col justify-between h-full min-h-[220px] transition-transform duration-300 hover:-translate-y-1.5 group backdrop-blur-xl relative overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)]">
            {/* Subtle corner glow */}
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-purple-600/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <span className="text-purple-400 font-bold">&#125;</span>
                <span>METRIC 02</span>
              </span>
              <div className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#C4B5FD]" />
            </div>

            <div>
              <div className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-violet-300 to-purple-400 tracking-tight">
                4.86★
              </div>

              {/* Technical Node Divider Line from Reference */}
              <div className="flex items-center justify-between w-full my-3 opacity-70">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_#C4B5FD]" />
                <div className="flex-1 h-px bg-white/25 mx-2" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_#C4B5FD]" />
              </div>

              <div className="flex items-baseline justify-between">
                <p className="text-xs sm:text-sm text-slate-200 font-medium">
                  Average Store Customer Rating
                </p>
                <span className="text-[10px] font-mono text-purple-300/80 shrink-0 ml-2">45k+ Reviews</span>
              </div>
            </div>
          </div>

          {/* Stat Card 3 */}
          <div className="relative rounded-[32px] bg-[#0E0D14] border border-white/[0.08] p-6 sm:p-8 shadow-2xl flex flex-col justify-between h-full min-h-[220px] transition-transform duration-300 hover:-translate-y-1.5 group backdrop-blur-xl shadow-[0_12px_36px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="flex items-center justify-between text-slate-400 font-mono text-[10px] uppercase tracking-wider mb-2">
              <span className="flex items-center gap-1.5">
                <span className="text-violet-400 font-bold">&#125;</span>
                <span>METRIC 03</span>
              </span>
              <div className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_#A78BFA]" />
            </div>

            <div>
              <div className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-200 via-purple-300 to-violet-400 tracking-tight">
                7+
              </div>

              {/* Technical Node Divider Line from Reference */}
              <div className="flex items-center justify-between w-full my-3 opacity-60">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_6px_#A78BFA]" />
                <div className="flex-1 h-px bg-white/20 mx-2" />
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_6px_#A78BFA]" />
              </div>

              <div className="flex items-baseline justify-between">
                <p className="text-xs sm:text-sm text-slate-200 font-medium">
                  Shipped Flagship Applications
                </p>
                <span className="text-[10px] font-mono text-violet-300/80 shrink-0 ml-2">Zero Fluff</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. FEATURED APPS SECTION */}
      <section id="featured" className="rounded-[36px] sm:rounded-[44px] bg-[#0E0D14] border border-white/[0.08] p-6 sm:p-10 lg:p-12 shadow-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-violet-400 mb-2 font-semibold">
              <span>&#125;</span>
              <span>Flagship Productions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Featured Mobile Applications
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              High-impact solutions with custom ML pipelines and responsive cross-platform architectures.
            </p>
          </div>
          <Link
            to="/projects"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black hover:bg-[#16151E] text-white border border-white/20 hover:border-violet-400 font-mono text-xs uppercase tracking-wider transition-all"
          >
            <span>View All Apps ({projects.length})</span>
            <ArrowRight className="w-3.5 h-3.5 text-violet-400" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <AppCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* 4. LATEST PROJECTS / PORTFOLIO CATALOG SECTION */}
      <section className="rounded-[36px] sm:rounded-[44px] bg-[#0E0D14] border border-white/[0.08] p-6 sm:p-10 lg:p-12 shadow-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="text-center max-w-2xl mx-auto mb-10 pb-6 border-b border-white/[0.08]">
          <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest text-violet-400 mb-1 font-semibold">
            <span>&#125;</span>
            <span>Portfolio Catalog</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Explore All Studio Releases
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Every application built to Google Material You and Apple Human Interface Guidelines standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestProjects.map((project) => (
            <AppCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* 5. TECHNOLOGIES & ARCHITECTURE SECTION */}
      <section id="technologies" className="rounded-[36px] sm:rounded-[44px] bg-[#0E0D14] border border-white/[0.08] p-6 sm:p-10 lg:p-12 shadow-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)]">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-violet-500/10 text-violet-300 border border-violet-500/20 mb-3">
            <Cpu className="w-3.5 h-3.5 text-violet-400" />
            <span>Modern Technology Foundation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built with World-Class Mobile Technologies
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            We reject bloated hybrid shells. Every project is built using native platform APIs or optimized Flutter/KMP pipelines with on-device tensor cores.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((tech) => (
            <div 
              key={tech.name} 
              className="p-6 rounded-[28px] bg-[#14131C] border border-white/[0.06] hover:border-violet-400/40 transition-all hover:-translate-y-1 shadow-md group shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
            >
              <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center mb-4 text-violet-400 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet-300">
                {tech.category}
              </span>
              <h3 className="text-lg font-bold text-white mt-1 mb-2">
                {tech.name}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {tech.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section className="relative rounded-[36px] sm:rounded-[44px] overflow-hidden cta-radial-glow border border-violet-500/20 p-10 sm:p-16 text-center shadow-2xl shadow-purple-950/40 text-white">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest text-violet-300 font-semibold">
            <span>&#125;</span>
            <span>Get Started</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to Experience Our Apps?
          </h2>
          <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed max-w-xl mx-auto font-normal">
            Explore our mobile catalog directly, test live builds on Apple App Store & Google Play Store, or partner with us on custom software engineering.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/projects"
              className="px-8 py-3.5 rounded-full bg-black hover:bg-[#16151E] text-white border border-white/20 hover:border-violet-400 font-mono text-xs uppercase tracking-widest shadow-xl transition-all hover:scale-105"
            >
              BROWSE CATALOG
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3.5 rounded-full bg-black/60 hover:bg-black text-slate-200 hover:text-white border border-white/15 font-mono text-xs uppercase tracking-wider transition-all backdrop-blur-md"
            >
              SEND INQUIRY
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
