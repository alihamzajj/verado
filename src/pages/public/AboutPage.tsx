import React from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Shield, Zap, Sparkles, Award, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const milestones = [
    { year: '2023', title: 'Studio Founded', desc: 'Started with 2 engineers building computer vision shoe authentication models.' },
    { year: '2024', title: '1 Million Downloads', desc: 'ShoeCheck and FoodAI hit viral milestones on the iOS App Store.' },
    { year: '2025', title: 'Cross-Platform Expansion', desc: 'Migrated architecture to Flutter and Kotlin Multiplatform for unified 120fps physics.' },
    { year: '2026', title: '5.8 Million Active Users', desc: 'Expanded to 7 applications with continuous on-device machine learning inference.' },
  ];

  return (
    <div className="space-y-8">
      
      {/* Hero Header */}
      <div className="rounded-[36px] bg-[#0F0E11] border border-white/10 p-8 sm:p-14 text-center max-w-7xl mx-auto shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-36 bg-violet-600/10 blur-[90px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-violet-500/10 text-violet-300 border border-violet-500/20">
            <span>&#125;</span>
            <span>Our Story & Philosophy</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Obsessed with Mobile Craftsmanship
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
            Verado was founded on a simple premise: mobile applications should be blazingly fast, privacy-preserving, and visually unforgettable.
          </p>
        </div>
      </div>

      {/* Core Principles Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 rounded-[32px] bg-[#0F0E11] border border-white/10 space-y-4 shadow-xl hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-full bg-black border border-white/10 text-violet-400 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-violet-300">
            <span>&#125;</span>
            <span>Performance</span>
          </div>
          <h3 className="text-xl font-bold text-white">Sub-50ms On-Device AI</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We don't ship your personal camera feeds to slow cloud servers. Our neural models execute directly on Apple Neural Engine and Qualcomm Hexagon NPUs.
          </p>
        </div>

        <div className="p-8 rounded-[32px] bg-[#0F0E11] border border-white/10 space-y-4 shadow-xl hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-full bg-black border border-white/10 text-purple-400 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-purple-300">
            <span>&#125;</span>
            <span>Security</span>
          </div>
          <h3 className="text-xl font-bold text-white">Zero-Compromise Privacy</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Biometrics and health telemetry never leave your hardware enclave. Encryption is client-side by default with zero creepy ad SDK trackers.
          </p>
        </div>

        <div className="p-8 rounded-[32px] bg-[#0F0E11] border border-white/10 space-y-4 shadow-xl hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 rounded-full bg-black border border-white/10 text-violet-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-violet-300">
            <span>&#125;</span>
            <span>Interaction</span>
          </div>
          <h3 className="text-xl font-bold text-white">Fluid 120 FPS Interfaces</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every haptic tap, transition curve, and gesture responds with instantaneous physical weight, matching high refresh rate OLED screens.
          </p>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="rounded-[36px] bg-[#0F0E11] border border-white/10 p-8 sm:p-12 shadow-2xl">
        <div className="text-center max-w-2xl mx-auto mb-10 pb-6 border-b border-white/10">
          <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest text-violet-400 mb-1 font-semibold">
            <span>&#125;</span>
            <span>Evolution</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Studio Milestones
          </h2>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          {milestones.map((m, idx) => (
            <div 
              key={idx} 
              className="p-6 rounded-[24px] bg-[#16151B] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-violet-400/40 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-purple-400 font-mono">
                  {m.year}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                <h4 className="text-base font-bold text-white">{m.title}</h4>
              </div>
              <p className="text-xs text-slate-400 max-w-md">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="rounded-[36px] hero-radial-glow border border-white/10 text-center max-w-4xl mx-auto p-10 sm:p-14 shadow-2xl text-white space-y-4">
        <div className="flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest text-violet-300 font-semibold">
          <span>&#125;</span>
          <span>Explore</span>
        </div>
        <h3 className="text-2xl sm:text-4xl font-black text-white">Explore our live applications</h3>
        <p className="text-xs sm:text-sm text-slate-200/90 max-w-md mx-auto">
          Try ShoeCheck, FoodAI, or PulseFit Pro on your phone right now.
        </p>
        <div className="pt-2">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-black hover:bg-[#16151B] text-white border border-white/20 font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            <span>View App Showcase Catalog</span>
            <ArrowRight className="w-4 h-4 text-violet-400" />
          </Link>
        </div>
      </div>

    </div>
  );
};
