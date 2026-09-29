import React, { useState } from 'react';
import { X, ArrowRight, CheckCircle2, Film, Sparkles } from 'lucide-react';
import { SERVICES } from '../../data/studioData';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, onClose, preselectedService }) => {
  const [selectedService, setSelectedService] = useState<string>(preselectedService || 'Product films');
  const [budget, setBudget] = useState<string>('$30k - $60k');
  const [brand, setBrand] = useState('');
  const [email, setEmail] = useState('');
  const [brief, setBrief] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      // Auto close after 3 seconds
      // onClose();
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* Background click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Box: Sharp corners, hairline border, deep charcoal */}
      <div className="relative z-10 w-full max-w-2xl bg-[#090810] border border-white/10 shadow-[0_0_70px_-15px_rgba(139,92,246,0.35)] overflow-hidden">
        
        {/* Top Header */}
        <div className="h-14 px-6 bg-black/60 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-violet-500 rounded-none" />
            <span className="font-heading font-bold text-sm tracking-wider uppercase text-white">
              COMMISSION A PRODUCTION
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#aba4be] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-10 sm:p-14 text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-violet-600/10 border border-violet-500/40 flex items-center justify-center text-violet-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-heading font-extrabold text-2xl text-white uppercase tracking-tight">
                PRODUCTION BRIEF RECEIVED
              </h3>
              <p className="text-xs sm:text-sm text-[#aba4be] max-w-md mx-auto leading-relaxed">
                Our directorial studio will review your project brief and respond with a preliminary treatment deck and scheduling options within 24 hours.
              </p>
            </div>

            <div className="pt-4 font-mono text-xs text-[#766e85]">
              TRANSMISSION ID: #VRD-2026-{Math.floor(1000 + Math.random() * 9000)}
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-6 py-3 text-xs font-bold tracking-widest uppercase bg-violet-600 hover:bg-violet-500 text-white rounded-none cursor-pointer"
            >
              RETURN TO STUDIO
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            
            {/* Service Selection */}
            <div>
              <label className="block text-[11px] font-mono tracking-widest text-[#766e85] uppercase mb-2">
                01 // SELECT DIRECTORIAL DISCIPLINE
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SERVICES.map((s) => (
                  <button
                    key={s.title}
                    type="button"
                    onClick={() => setSelectedService(s.title)}
                    className={`py-2.5 px-3 text-left text-xs font-mono font-medium transition-all rounded-none border cursor-pointer ${
                      selectedService === s.title
                        ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                        : 'bg-white/[0.02] border-white/[0.08] text-[#aba4be] hover:bg-white/[0.05]'
                    }`}
                  >
                    <span className="text-[10px] text-violet-400 block mb-0.5">{s.number}</span>
                    {s.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Bracket */}
            <div>
              <label className="block text-[11px] font-mono tracking-widest text-[#766e85] uppercase mb-2">
                02 // ESTIMATED PRODUCTION BRACKET (USD)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {['$15k - $30k', '$30k - $60k', '$60k - $120k', '$120k+'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBudget(b)}
                    className={`py-2 px-2 text-center text-xs font-mono font-medium transition-all rounded-none border cursor-pointer ${
                      budget === b
                        ? 'bg-violet-600 text-white border-violet-500'
                        : 'bg-white/[0.02] border-white/[0.08] text-[#aba4be] hover:bg-white/[0.05]'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Name & Email Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-mono tracking-widest text-[#766e85] uppercase mb-1.5">
                  03 // BRAND / AGENCY NAME
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aura Motorcars"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/[0.08] focus:border-violet-500 text-xs text-white placeholder:text-[#585168] rounded-none outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono tracking-widest text-[#766e85] uppercase mb-1.5">
                  04 // DIRECT CONTACT EMAIL
                </label>
                <input
                  type="email"
                  required
                  placeholder="director@brand.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/[0.08] focus:border-violet-500 text-xs text-white placeholder:text-[#585168] rounded-none outline-none font-mono"
                />
              </div>
            </div>

            {/* Project brief */}
            <div>
              <label className="block text-[11px] font-mono tracking-widest text-[#766e85] uppercase mb-1.5">
                05 // PROJECT SCOPE & CREATIVE ASPIRATION
              </label>
              <textarea
                rows={3}
                required
                placeholder="Describe your campaign objectives, reference aesthetics, key deliverables, and target launch date..."
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-black/60 border border-white/[0.08] focus:border-violet-500 text-xs text-white placeholder:text-[#585168] rounded-none outline-none font-mono resize-none"
              />
            </div>

            {/* Action Button */}
            <div className="pt-2 flex items-center justify-between border-t border-white/[0.08]">
              <span className="text-[10px] font-mono text-[#766e85]">
                ● STRICT NDA ENFORCED
              </span>

              <button
                type="submit"
                className="inline-flex items-center gap-3 px-7 py-3 text-xs font-bold tracking-widest uppercase bg-violet-600 hover:bg-violet-500 text-white rounded-none shadow-[0_0_20px_-3px_rgba(139,92,246,0.5)] transition-all cursor-pointer group"
              >
                <span>TRANSMIT BRIEF</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
