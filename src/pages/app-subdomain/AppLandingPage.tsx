import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { detectAppSubdomain, KNOWN_SUBDOMAINS, getAppSubdomainUrl } from '../../utils/subdomain';
import { 
  ShieldCheck, 
  Download, 
  Star, 
  CheckCircle2, 
  Layers, 
  ExternalLink, 
  Smartphone, 
  Lock, 
  ArrowRight,
  Cpu,
  Sparkles,
  Share2
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

  // Determine active app
  const detectedSubdomain = detectAppSubdomain();
  const targetId = appIdOverride || id || (detectedSubdomain ? detectedSubdomain.projectId : 'shoecheck');

  const project = projects.find(
    p => p.id.toLowerCase() === targetId.toLowerCase() ||
         p.id.toLowerCase().includes(targetId.toLowerCase())
  );

  // Fallback defaults if project is loading or custom
  const appName = project?.name || 'ShoeCheck AI';
  const tagline = project?.tagline || 'Instant Sneaker Legit-Check & Condition Analyzer';
  const description = project?.fullDescription || project?.shortDescription || '';
  const subdomain = detectedSubdomain?.subdomain || (KNOWN_SUBDOMAINS[targetId]?.subdomain) || targetId;

  // Path to this app's privacy policy
  const privacyPath = isSubdomainMode ? '/privacy' : `/apps/${project?.id || targetId}/privacy`;

  return (
    <div className="min-h-screen bg-[#09080E] text-slate-100 flex flex-col font-sans selection:bg-violet-600/30 overflow-x-hidden">
      
      {/* 1. APP SUBDOMAIN NAVIGATION */}
      <header className="sticky top-0 z-50 bg-[#0D0C14]/90 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left: App Identity */}
          <div className="flex items-center gap-3">
            {project?.logo ? (
              <img 
                src={project.logo} 
                alt={appName} 
                className="w-8 h-8 sm:w-9 sm:auto rounded-xl object-cover shadow-lg border border-white/10" 
              />
            ) : (
              <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center font-bold text-white shadow-lg">
                {appName.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                  {appName}
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-950/70 text-violet-300 border border-violet-500/30">
                  {project?.category || 'Flagship Mobile'}
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-400">
                Official App Portal • {subdomain}.verado.dev
              </p>
            </div>
          </div>

          {/* Center / Right Links */}
          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="hidden md:flex items-center gap-5 text-xs font-mono uppercase tracking-wider text-slate-300">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#screenshots" className="hover:text-white transition-colors">Screens</a>
              <a href="#specs" className="hover:text-white transition-colors">Specs</a>
              <Link 
                to={privacyPath}
                className="text-violet-300 hover:text-white flex items-center gap-1 transition-colors font-bold"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                <span>Privacy Policy</span>
              </Link>
            </nav>

            <Link
              to={privacyPath}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/40 text-violet-300 text-xs font-mono font-medium transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
              <span>Privacy</span>
            </Link>

            <a
              href="/"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-slate-300 hover:text-white transition-colors"
            >
              <span>Verado Studio</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>

        </div>
      </header>

      {/* 2. PRODUCT HERO */}
      <section className="relative px-4 sm:px-8 pt-10 sm:pt-16 pb-12 sm:pb-20 max-w-7xl mx-auto w-full">
        {/* Glow backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[450px] bg-violet-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
          
          {/* Left Column: Details & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 font-mono text-xs">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Subdomain Live • {subdomain}.verado.dev</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
              {appName}
            </h1>

            <p className="text-lg sm:text-xl font-medium text-violet-200/90 leading-snug">
              {tagline}
            </p>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              {description}
            </p>

            {/* Metrics Bar */}
            <div className="flex flex-wrap items-center gap-5 sm:gap-8 py-3 border-y border-white/[0.08] font-mono text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Rating</span>
                <span className="text-white font-bold flex items-center gap-1 text-sm">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{project?.rating || 4.9}</span>
                  <span className="text-slate-400 text-xs font-normal">({project?.reviewsCount ? `${(project.reviewsCount / 1000).toFixed(1)}k` : '14k'})</span>
                </span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Downloads</span>
                <span className="text-white font-bold text-sm">{project?.downloads || '850K+'}</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Platform</span>
                <span className="text-white font-bold text-sm">{project?.platforms || 'iOS + Android'}</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Build Version</span>
                <span className="text-violet-300 font-bold text-sm">v{project?.version || '3.2.1'}</span>
              </div>
            </div>

            {/* App Store & Google Play CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {project?.appStoreUrl ? (
                <a
                  href={project.appStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white text-black hover:bg-slate-200 transition-all font-mono text-xs font-bold uppercase tracking-wider shadow-xl hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  <span>Download on App Store</span>
                </a>
              ) : (
                <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 text-white font-mono text-xs uppercase tracking-wider border border-white/20">
                  <Download className="w-4 h-4" />
                  <span>iOS App Store (Coming Soon)</span>
                </div>
              )}

              {project?.playStoreUrl && (
                <a
                  href={project.playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#16151F] hover:bg-[#1E1C2B] text-white border border-white/20 hover:border-violet-400 font-mono text-xs uppercase tracking-wider transition-all shadow-xl"
                >
                  <Download className="w-4 h-4" />
                  <span>Get on Google Play</span>
                </a>
              )}

              <Link
                to={privacyPath}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-violet-950/60 hover:bg-violet-900/70 text-violet-200 border border-violet-500/40 font-mono text-xs uppercase tracking-wider transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-violet-400" />
                <span>Privacy Disclosures</span>
              </Link>
            </div>

            {/* Compliance Guarantee badge */}
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono pt-1">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Apple App Store & Google Play privacy verified • Zero personal data selling</span>
            </div>

          </div>

          {/* Right Column: Hero Visual / Phone Mockup */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <div className="relative group max-w-[320px] sm:max-w-[360px] w-full">
              {/* Amethyst glow aura */}
              <div className="absolute -inset-4 bg-gradient-to-r from-violet-600/30 via-purple-600/20 to-pink-600/30 rounded-[48px] blur-2xl opacity-75 group-hover:opacity-100 transition duration-500" />
              
              {/* Modern Phone Shell */}
              <div className="relative rounded-[40px] border-[6px] border-[#22202E] bg-black shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden">
                {/* Dynamic Island / Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-20 border border-white/10" />

                {/* Screenshot Display */}
                <div className="aspect-[9/19.5] w-full relative overflow-hidden bg-[#100E17]">
                  {project?.screenshots && project.screenshots.length > 0 ? (
                    <img 
                      src={project.screenshots[selectedScreenshot] || project.screenshots[0]} 
                      alt={`${appName} preview`}
                      className="w-full h-full object-cover transition-opacity duration-300"
                    />
                  ) : project?.coverImage ? (
                    <img 
                      src={project.coverImage} 
                      alt={appName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                      <Smartphone className="w-16 h-16 text-violet-500/40 mb-3" />
                      <p className="text-sm font-bold text-white">{appName}</p>
                      <p className="text-xs text-slate-400 mt-1">{tagline}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. APP SCREENSHOTS GALLERY */}
      {project?.screenshots && project.screenshots.length > 1 && (
        <section id="screenshots" className="px-4 sm:px-8 py-12 border-t border-white/[0.08] bg-[#0C0B12]">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-violet-400 font-mono text-xs uppercase tracking-wider block">Gallery</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">Application Interface</h2>
              </div>
              <p className="text-xs font-mono text-slate-400 hidden sm:block">Click any thumbnail to preview</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {project.screenshots.map((shot, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedScreenshot(idx)}
                  className={`group relative rounded-2xl overflow-hidden border transition-all text-left aspect-[9/16] ${
                    selectedScreenshot === idx 
                      ? 'border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] ring-2 ring-violet-500/50' 
                      : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={shot} alt={`Screen ${idx + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black via-black/70 to-transparent">
                    <span className="text-[10px] font-mono text-white font-bold block">
                      Screen 0{idx + 1}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. KEY APP FEATURES */}
      <section id="features" className="px-4 sm:px-8 py-16 max-w-7xl mx-auto w-full space-y-8">
        <div>
          <span className="text-violet-400 font-mono text-xs uppercase tracking-wider block">Core Capabilities</span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">Engineered for Precision</h2>
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
              className="p-6 rounded-2xl bg-[#0E0D14] border border-white/[0.08] hover:border-violet-500/40 transition-all duration-300 space-y-3 group"
            >
              <div className="w-9 h-9 rounded-xl bg-violet-600/10 border border-violet-500/30 flex items-center justify-center text-violet-300 group-hover:bg-violet-600/20 transition-colors">
                <CheckCircle2 className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-violet-200 transition-colors">
                {feat}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Optimized for native 120 FPS frame rate and zero latency execution across flagship devices.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TECH SPECS & ARCHITECTURE */}
      <section id="specs" className="px-4 sm:px-8 py-14 border-t border-white/[0.08] bg-[#0B0A10]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <span className="text-violet-400 font-mono text-xs uppercase tracking-wider block">Stack & Engineering</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Technical Architecture</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
            {(project?.technologies || ['Flutter', 'CoreML', 'TensorFlow Lite', 'FastAPI', 'SQLite', 'Metal']).map((tech, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-[#12111A] border border-white/[0.08] text-center space-y-1">
                <Cpu className="w-4 h-4 text-violet-400 mx-auto" />
                <span className="text-white font-medium block">{tech}</span>
                <span className="text-[10px] text-slate-500 uppercase">Engine</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PRIVACY PROMISE BANNER */}
      <section className="px-4 sm:px-8 py-16 max-w-7xl mx-auto w-full">
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 bg-gradient-to-r from-violet-950/60 via-[#13111F] to-[#0E0D16] border border-violet-500/40 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Apple & Google Play Certified Privacy Architecture</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Privacy by Design. Zero Data Monetization.
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              We never sell your camera frames, biometric health metrics, or academic notes to advertising networks. Read our formal legal policy crafted for App Store compliance.
            </p>

            <div className="pt-2">
              <Link
                to={privacyPath}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-xl hover:scale-105"
              >
                <span>Read Full Privacy Policy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. APP SUBDOMAIN FOOTER */}
      <footer className="border-t border-white/[0.08] bg-[#07060A] px-4 sm:px-8 py-10 text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-violet-400 font-bold">&#125;</span>
            <span className="text-white font-bold">{appName}</span>
            <span className="text-slate-600">•</span>
            <span>subdomain: {subdomain}.verado.dev</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to={privacyPath} className="text-violet-300 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <a href="mailto:support@verado.dev" className="hover:text-white transition-colors">
              App Support
            </a>
            <a href="/" className="hover:text-white transition-colors">
              Verado Studio
            </a>
          </div>

          <p className="text-slate-600 text-[11px]">
            © 2026 Verado Mobile Studios Inc.
          </p>
        </div>
      </footer>

    </div>
  );
};
