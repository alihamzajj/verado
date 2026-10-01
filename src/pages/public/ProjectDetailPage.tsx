import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Download, 
  Smartphone, 
  Apple, 
  Globe, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Share2, 
  Info,
  Maximize2
} from 'lucide-react';
import { GithubIcon } from '../../components/common/Icons';
import { useApp } from '../../context/AppContext';
import { AppCard } from '../../components/common/AppCard';
import { Modal } from '../../components/common/Modal';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { projects, addNotification } = useApp();

  const project = projects.find((p) => p.id === id);

  const [activeScreenshot, setActiveScreenshot] = useState<number>(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  
  // Demo video player simulation states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [downloadModal, setDownloadModal] = useState<'ios' | 'android' | null>(null);

  // Automatically scroll to the top of the project detail page
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
  }, [id]);

  if (!project) {
    return (
      <div className="py-24 rounded-[36px] bg-[#0F0E11] border border-white/10 max-w-xl mx-auto text-center px-6 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-black text-slate-400 flex items-center justify-center mx-auto mb-4 border border-white/10">
          <Info className="w-8 h-8 text-violet-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
        <p className="text-xs font-mono text-slate-400 mb-6">
          The requested application ID does not exist or has been unpublished from the catalog.
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-black hover:bg-[#16151B] text-white border border-white/20 font-mono text-xs uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-violet-400" />
          <span>Back to All Projects</span>
        </Link>
      </div>
    );
  }

  const relatedProjects = projects
    .filter((p) => p.id !== project.id && p.published && (p.category === project.category || p.platforms === project.platforms))
    .slice(0, 3);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addNotification('Project URL copied to clipboard!', 'info');
  };

  const handleOpenDownload = (platform: 'ios' | 'android') => {
    setDownloadModal(platform);
    addNotification(`Opening ${platform === 'ios' ? 'Apple App Store' : 'Google Play Store'}...`, 'info');
  };

  return (
    <div className="space-y-8">
      
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between p-4 rounded-full bg-[#0F0E11] border border-white/10 shadow-xl">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white transition-colors pl-3"
        >
          <ArrowLeft className="w-4 h-4 text-violet-400" />
          <span>Back to Catalog</span>
        </Link>

        <div className="flex items-center gap-3 pr-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-black border border-white/10 hover:border-violet-400 text-slate-300 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-violet-400" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Hero Showcase Section */}
      <div className="rounded-[36px] bg-[#0F0E11] border border-white/10 p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: App Identity & Main Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-start gap-5">
              <img 
                src={project.logo} 
                alt={project.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-1 ring-white/10 shadow-2xl" 
              />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1">
                    <span>&#125;</span>
                    <span>{project.category}</span>
                  </span>
                  {project.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-violet-400 text-black">
                      {project.badge}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {project.name}
                </h1>
                <p className="text-xs sm:text-sm font-medium text-slate-300">
                  {project.tagline}
                </p>

                {/* Ratings and Stats */}
                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current text-violet-400" />
                    <span>{project.rating.toFixed(1)}</span>
                    <span className="text-[10px] text-violet-300/70">({project.reviewsCount.toLocaleString()})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Download className="w-3.5 h-3.5 text-violet-400" />
                    <span className="font-semibold">{project.downloads}</span>
                  </div>
                  <div className="text-slate-400">
                    v{project.version} • {project.size}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed font-normal">
              {project.fullDescription}
            </p>

            {/* Action Download Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {project.platforms.includes('iOS') && (
                <button
                  onClick={() => handleOpenDownload('ios')}
                  className="flex items-center gap-3 px-6 py-3 rounded-full bg-black hover:bg-[#16151B] text-white border border-white/20 hover:border-violet-400 font-mono text-xs uppercase tracking-wider transition-all duration-200 shadow-lg cursor-pointer"
                >
                  <Apple className="w-5 h-5 fill-current" />
                  <div className="text-left">
                    <div className="text-[8px] uppercase tracking-wider leading-none text-slate-400">Download on</div>
                    <div className="text-xs font-bold leading-tight">Apple App Store</div>
                  </div>
                </button>
              )}

              {project.platforms.includes('Android') && (
                <button
                  onClick={() => handleOpenDownload('android')}
                  className="flex items-center gap-3 px-6 py-3 rounded-full bg-black hover:bg-[#16151B] text-white border border-white/20 hover:border-violet-400 font-mono text-xs uppercase tracking-wider transition-all duration-200 shadow-lg cursor-pointer"
                >
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                  <div className="text-left">
                    <div className="text-[8px] uppercase tracking-wider leading-none text-slate-400">Get it on</div>
                    <div className="text-xs font-bold leading-tight">Google Play</div>
                  </div>
                </button>
              )}

              {project.websiteUrl && (
                <a
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-full bg-black hover:bg-[#16151B] text-slate-300 hover:text-white border border-white/20 hover:border-violet-400 transition-colors"
                  title="Product Landing Page"
                >
                  <Globe className="w-4 h-4 text-violet-400" />
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-full bg-black hover:bg-[#16151B] text-slate-300 hover:text-white border border-white/20 hover:border-violet-400 transition-colors"
                  title="GitHub Core Repository"
                >
                  <GithubIcon className="w-4 h-4 text-violet-400" />
                </a>
              )}
            </div>

            {/* Quick Specifications Metadata Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-[24px] bg-[#16151B] border border-white/5 text-xs font-mono">
              <div>
                <div className="text-slate-500 uppercase tracking-wider text-[10px]">Platforms</div>
                <div className="font-semibold text-white mt-1">{project.platforms}</div>
              </div>
              <div>
                <div className="text-slate-500 uppercase tracking-wider text-[10px]">OS Minimum</div>
                <div className="font-semibold text-white mt-1">{project.minIos || project.minAndroid || 'Modern OS'}</div>
              </div>
              <div>
                <div className="text-slate-500 uppercase tracking-wider text-[10px]">Package Size</div>
                <div className="font-semibold text-white mt-1">{project.size}</div>
              </div>
              <div>
                <div className="text-slate-500 uppercase tracking-wider text-[10px]">Release</div>
                <div className="font-semibold text-white mt-1">{project.lastUpdated}</div>
              </div>
            </div>

          </div>

          {/* Right Column: Large Interactive Preview Hero */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full relative rounded-[28px] overflow-hidden bg-black border border-white/10 shadow-2xl group">
              <img 
                src={project.coverImage} 
                alt={project.name}
                className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              
              <div className="absolute bottom-6 inset-x-6 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-violet-400">Official Production Build</span>
                  <h4 className="text-lg font-bold text-white">{project.name}</h4>
                </div>
                <button
                  onClick={() => setLightboxImage(project.coverImage)}
                  className="p-2.5 rounded-full bg-black/80 backdrop-blur-md text-white border border-white/20 hover:border-violet-400 transition-colors cursor-pointer"
                  title="View Fullscreen Preview"
                >
                  <Maximize2 className="w-4 h-4 text-violet-400" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Demo Video Simulation & Screenshots Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Interactive Simulated Video Player */}
        <div className="lg:col-span-6 rounded-[36px] bg-[#0F0E11] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Play className="w-4 h-4 text-violet-400" />
              <span>Interactive App Demo</span>
            </h3>
            <span className="text-xs font-mono uppercase text-slate-400">4K Preview</span>
          </div>

          <div className="relative rounded-[24px] overflow-hidden bg-black border border-white/10 aspect-video shadow-2xl flex items-center justify-center group">
            <img 
              src={project.screenshots[0] || project.coverImage} 
              alt="Demo video frame"
              className={`w-full h-full object-cover opacity-60 transition-opacity ${isPlaying ? 'scale-105' : ''}`} 
            />

            {/* Simulated Live Scan Overlay if playing */}
            {isPlaying && (
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                <div className="w-48 h-48 border-2 border-dashed border-violet-400 rounded-2xl animate-pulse flex items-center justify-center">
                  <span className="text-[10px] font-mono font-bold bg-violet-400 text-black px-2 py-0.5 rounded">
                    ANALYZING SAMPLE...
                  </span>
                </div>
                <div className="mt-4 text-xs font-mono text-emerald-400 bg-black/80 px-3 py-1 rounded-full border border-emerald-500/30">
                  Confidence Score: 99.4% Valid
                </div>
              </div>
            )}

            {/* Big Play/Pause Button */}
            <button
              onClick={() => {
                const next = !isPlaying;
                setIsPlaying(next);
                addNotification(next ? 'Simulated demo video playing...' : 'Demo video paused', 'info');
              }}
              className="relative z-10 w-16 h-16 rounded-full bg-black hover:bg-[#16151B] text-white border border-white/20 hover:border-violet-400 flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current text-violet-400" /> : <Play className="w-6 h-6 fill-current text-violet-400 ml-1" />}
            </button>

            {/* Video Controls Bar */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-between text-xs text-white z-20">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:text-violet-400 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="hover:text-violet-400 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="text-[11px] text-slate-400 font-mono">0:45 / 1:30</span>
              </div>

              {/* Progress bar */}
              <div className="flex-1 mx-4 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full bg-violet-400 rounded-full transition-all ${isPlaying ? 'w-2/3' : 'w-1/3'}`} />
              </div>

              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-violet-300 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
                FEATURE SHOWCASE
              </span>
            </div>
          </div>
        </div>

        {/* Right: Screenshot Gallery */}
        <div className="lg:col-span-6 rounded-[36px] bg-[#0F0E11] border border-white/10 p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-violet-400 font-mono">&#125;</span>
              <span>Application Gallery</span>
            </h3>
            <span className="text-xs font-mono uppercase text-slate-400">Click to Inspect</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {project.screenshots.map((shot, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxImage(shot)}
                className="group relative rounded-[20px] overflow-hidden bg-black border border-white/10 aspect-[4/3] cursor-pointer hover:border-violet-400 transition-all shadow-md"
              >
                <img 
                  src={shot} 
                  alt={`${project.name} screenshot ${idx + 1}`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <div className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5 text-violet-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Features & Technologies Grid */}
      <div className="rounded-[36px] bg-[#0F0E11] border border-white/10 p-6 sm:p-10 lg:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Key Features */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-violet-400 font-semibold">
            <span>&#125;</span>
            <span>Architecture & Specifications</span>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Key Engineering Highlights
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.features.map((feature, idx) => (
              <div 
                key={idx} 
                className="p-4 rounded-[20px] bg-[#16151B] border border-white/5 flex items-start gap-3 hover:border-violet-400/40 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-200 font-medium leading-relaxed">
                  {feature}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack Chips & Platform Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-violet-400 font-semibold">
            <span>&#125;</span>
            <span>Technology Stack</span>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Frameworks & Tools
          </h3>

          <div className="p-6 rounded-[24px] bg-[#16151B] border border-white/5 space-y-4">
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span 
                  key={tech} 
                  className="px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider bg-black text-violet-300 border border-white/10 shadow-sm"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2 text-xs font-mono text-slate-400">
              <div className="flex justify-between">
                <span>Compilation Target:</span>
                <span className="font-semibold text-slate-200">Native Arm64 / x86_64</span>
              </div>
              <div className="flex justify-between">
                <span>Inference Runtime:</span>
                <span className="font-semibold text-slate-200">Neural Engine / GPU</span>
              </div>
              <div className="flex justify-between">
                <span>Data Layer:</span>
                <span className="font-semibold text-slate-200">Encrypted Cloud Sync</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <div className="rounded-[36px] bg-[#0F0E11] border border-white/10 p-6 sm:p-10 lg:p-12 shadow-2xl">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-violet-400 mb-1 font-semibold">
                <span>&#125;</span>
                <span>Recommended</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Related Applications
              </h3>
            </div>
            <Link 
              to="/projects" 
              className="text-xs font-mono uppercase tracking-wider text-violet-300 hover:text-white"
            >
              View All Catalog →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProjects.map((p) => (
              <AppCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <Modal
          isOpen={!!lightboxImage}
          onClose={() => setLightboxImage(null)}
          title={project.name}
          subtitle="High-Resolution Production Screenshot"
          maxWidth="max-w-4xl"
        >
          <div className="rounded-2xl overflow-hidden bg-black flex items-center justify-center max-h-[75vh]">
            <img 
              src={lightboxImage} 
              alt="Fullscreen preview" 
              className="max-h-[75vh] w-auto object-contain" 
            />
          </div>
        </Modal>
      )}

      {/* Mock Download Modal */}
      {downloadModal && (
        <Modal
          isOpen={!!downloadModal}
          onClose={() => setDownloadModal(null)}
          title={`Download ${project.name}`}
          subtitle={`Redirecting to ${downloadModal === 'ios' ? 'Apple App Store' : 'Google Play'}`}
          maxWidth="max-w-md"
        >
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center mx-auto border border-violet-500/20">
              {downloadModal === 'ios' ? <Apple className="w-8 h-8" /> : <Smartphone className="w-8 h-8 text-emerald-400" />}
            </div>
            <h4 className="text-base font-bold text-white">
              Official Store Link
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-normal">
              In production, this button connects directly to the published app bundle:
            </p>
            <div className="p-3 rounded-xl bg-black font-mono text-[11px] text-violet-300 break-all border border-white/10">
              {downloadModal === 'ios' ? project.appStoreUrl : project.playStoreUrl}
            </div>
            <button
              onClick={() => setDownloadModal(null)}
              className="w-full py-2.5 rounded-full bg-black hover:bg-[#16151B] text-white border border-white/20 font-mono text-xs uppercase tracking-wider cursor-pointer"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
};
