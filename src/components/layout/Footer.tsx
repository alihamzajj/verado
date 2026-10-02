import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Sparkles } from 'lucide-react';
import { InstagramIcon, TwitterIcon, LinkedinIcon } from '../common/Icons';

export const Footer: React.FC = () => {
  return (
    <footer className="rounded-[36px] bg-[#0F0E11] border border-white/10 text-slate-400 p-8 sm:p-12 lg:p-14 shadow-2xl relative overflow-hidden">
      {/* Subtle background violet glow */}
      <div className="absolute bottom-0 right-1/4 w-96 h-48 bg-violet-600/10 blur-[100px] pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-5 gap-10 relative z-10">
        
        {/* Brand Info */}
        <div className="md:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-violet-400 font-mono text-2xl font-bold select-none leading-none">
              &#125;
            </span>
            <span className="font-extrabold text-2xl text-white tracking-tight group-hover:text-violet-200 transition-colors">
              Verado
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-normal">
            Category-defining Android and iOS mobile applications combining reactive state architectures, on-device intelligence, and responsive haptic interactions.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-black hover:bg-[#16151B] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              title="Instagram"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-black hover:bg-[#16151B] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <TwitterIcon className="w-3.5 h-3.5" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-black hover:bg-[#16151B] border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Apps Column */}
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
            <span className="text-violet-400">&#125;</span>
            <span>Featured Apps</span>
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link to="/projects/shoecheck" className="hover:text-white transition-colors flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-violet-400" />
                ShoeCheck AI
              </Link>
            </li>
            <li>
              <Link to="/projects/foodai" className="hover:text-white transition-colors flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-purple-400" />
                FoodAI Nutritionist
              </Link>
            </li>
            <li>
              <Link to="/projects/pulsefit-tracker" className="hover:text-white transition-colors flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-violet-300" />
                PulseFit Pro
              </Link>
            </li>
            <li>
              <Link to="/projects/brainwave-ai" className="hover:text-white transition-colors flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-violet-500" />
                BrainWave Study
              </Link>
            </li>
            <li>
              <Link to="/projects" className="text-violet-300 hover:text-white font-mono text-[11px] uppercase tracking-wider pt-1 inline-block">
                All Applications →
              </Link>
            </li>
          </ul>
        </div>

        {/* Navigation Column */}
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
            <span className="text-violet-400">&#125;</span>
            <span>Company</span>
          </h4>
          <ul className="space-y-2.5 text-xs font-mono uppercase text-slate-400">
            <li><Link to="/about" className="hover:text-white transition-colors">About Studio</Link></li>
            <li><Link to="/projects" className="hover:text-white transition-colors">App Portfolio</Link></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact & Support</Link></li>
            <li>
              <a href="#technologies" className="hover:text-white transition-colors">
                Technology Stack
              </a>
            </li>
          </ul>
        </div>

        {/* Contact / Inquiries Box */}
        <div>
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-1.5">
            <span className="text-violet-400">&#125;</span>
            <span>Connect</span>
          </h4>
          <div className="p-5 rounded-[24px] bg-[#16151B] border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Partner with Verado</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Interested in publishing collaborations, licensing, or custom app engineering?
            </p>
            <Link
              to="/contact"
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-black hover:bg-[#1d1b24] text-white border border-white/20 hover:border-violet-400 text-xs font-mono uppercase tracking-wider transition-all shadow-sm"
            >
              <span>SEND INQUIRY</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
        <p>© 2026 Verado Inc. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            Vite 8 • React 19 • Tailwind CSS
          </span>
        </div>
      </div>
    </footer>
  );
};
