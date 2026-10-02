import React, { useState } from 'react';
import { Mail, MapPin, Phone, MessageSquare, Send, CheckCircle2, ChevronDown, Loader2, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { submitContactInquiry } from '../../lib/supabase';

export const ContactPage: React.FC = () => {
  const { addNotification, addInquiry } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'App Support / Feedback',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Are your mobile apps available globally?',
      a: 'Yes! All apps released on Apple App Store and Google Play are localized and available across 150+ countries with regional currency conversions.'
    },
    {
      q: 'How does ShoeCheck AI verify authenticity?',
      a: 'ShoeCheck utilizes computer vision models trained on over 2.5 million verified sneaker pairs. It scans stitch count, box typography, UV ink markers, and RFID frequency chips.'
    },
    {
      q: 'Do your apps sell user biometrics or location telemetry?',
      a: 'Never. All biometric data and LiDAR measurements are processed directly on your device enclave and discarded after inference.'
    },
    {
      q: 'Can third-party developers integrate with your APIs?',
      a: 'We offer partner SDKs for ShoeCheck verification and FoodAI macro classification. Contact our partnerships team below for API credentials.'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addInquiry({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        category: formData.subject,
        message: formData.message,
      });
      setSubmitted(true);
      addNotification('Message transmitted! Our studio team will get back to you shortly.', 'success');
    } catch {
      addNotification('Failed to transmit message. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6 sm:py-10 px-2 sm:px-4 lg:px-6 max-w-7xl mx-auto min-h-screen space-y-8">
      
      {/* Header Container with Shining Crystalline Facets & Specular Glass Reflection */}
      <div className="rounded-[32px] sm:rounded-[40px] bg-gradient-to-b from-[#241348]/95 via-[#150B28]/95 to-[#0A0515]/98 backdrop-blur-xl border border-violet-400/40 p-8 sm:p-14 text-center shadow-[0_20px_70px_rgba(20,5,45,0.7),inset_0_1.5px_2px_rgba(255,255,255,0.35),inset_0_0_30px_rgba(168,85,247,0.18)] relative overflow-hidden group">
        
        {/* Prismatic Crystal Shards & Facet Refraction Lines */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none opacity-50 mix-blend-screen"
          viewBox="0 0 1200 400" 
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="crystalFacet1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#DDD0FF" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#935BF6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#4C1D95" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="crystalFacet2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F3E8FF" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#A855F7" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#3B0764" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Crystalline Polygon Shards */}
          <polygon points="0,0 350,0 220,180 0,140" fill="url(#crystalFacet1)" stroke="rgba(216,180,254,0.22)" strokeWidth="0.8" />
          <polygon points="350,0 720,0 600,160 220,180" fill="url(#crystalFacet2)" stroke="rgba(216,180,254,0.18)" strokeWidth="0.8" />
          <polygon points="720,0 1200,0 1020,150 600,160" fill="url(#crystalFacet1)" stroke="rgba(216,180,254,0.22)" strokeWidth="0.8" />
          <polygon points="220,180 600,160 520,380 120,320" fill="url(#crystalFacet2)" stroke="rgba(196,181,253,0.15)" strokeWidth="0.8" />
          <polygon points="600,160 1020,150 940,360 520,380" fill="url(#crystalFacet1)" stroke="rgba(196,181,253,0.18)" strokeWidth="0.8" />
          <polygon points="1020,150 1200,0 1200,320 940,360" fill="url(#crystalFacet2)" stroke="rgba(216,180,254,0.18)" strokeWidth="0.8" />

          {/* Refracted Prismatic Highlights */}
          <line x1="220" y1="180" x2="600" y2="160" stroke="rgba(245,238,255,0.45)" strokeWidth="1.2" />
          <line x1="600" y1="160" x2="1020" y2="150" stroke="rgba(245,238,255,0.4)" strokeWidth="1.2" />
        </svg>

        {/* Sweeping Crystalline Light Sheen Beam (Catching the Light) */}
        <div className="absolute -inset-y-24 -left-1/3 w-64 bg-gradient-to-r from-transparent via-violet-200/25 via-white/40 to-transparent blur-md pointer-events-none animate-crystal-shine" />

        {/* Twinkling 4-Point Crystal Diamond Stars */}
        <div className="absolute top-10 left-16 pointer-events-none animate-crystal-sparkle hidden sm:block">
          <svg className="w-5 h-5 text-violet-200 drop-shadow-[0_0_8px_#E9D5FF]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
        </div>

        <div className="absolute top-8 right-24 pointer-events-none animate-crystal-sparkle-delayed hidden sm:block">
          <svg className="w-6 h-6 text-fuchsia-200 drop-shadow-[0_0_10px_#F5EEFF]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
        </div>

        <div className="absolute bottom-10 right-1/4 pointer-events-none animate-crystal-sparkle-fast hidden sm:block">
          <svg className="w-4 h-4 text-purple-200 drop-shadow-[0_0_8px_#E9D5FF]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
        </div>

        <div className="absolute bottom-8 left-1/4 pointer-events-none animate-crystal-sparkle hidden sm:block">
          <svg className="w-4 h-4 text-violet-100 drop-shadow-[0_0_8px_#FFFFFF]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
        </div>

        {/* Soft Crystalline Light Core */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-48 bg-gradient-to-b from-violet-500/30 via-fuchsia-500/15 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-950/70 border border-violet-400/40 text-violet-200 font-mono text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(167,139,250,0.35)] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-violet-300 animate-pulse" />
            <span>Direct Channel</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
            Get in Touch with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-100 to-fuchsia-300 drop-shadow-[0_0_24px_rgba(216,180,254,0.7)] relative inline-block">
              Verado
              <span className="absolute -top-1 -right-3 text-violet-300 animate-crystal-sparkle text-sm select-none">✦</span>
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed font-normal">
            Have questions about our apps, technical architecture, or enterprise partnerships? Send us a message or reach out directly.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        
        {/* Contact Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 rounded-[32px] bg-[#0F0E11] border border-white/10 shadow-2xl relative">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5">
              <span className="text-violet-400 font-mono">&#125;</span>
              <MessageSquare className="w-5 h-5 text-violet-400" />
              <span>Send a Direct Message</span>
            </h3>
            <span className="font-mono text-[11px] uppercase tracking-wider text-white/40">Secure Transmission</span>
          </div>

          {submitted ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-violet-500/20 text-violet-300 flex items-center justify-center mx-auto border border-violet-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-white">Thank you for contacting us!</h4>
              <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto">
                Your message has been received by our mobile engineering leads. We typically reply within 24 business hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', subject: 'App Support / Feedback', message: '' });
                }}
                className="px-6 py-3 rounded-full bg-black text-white border border-white/20 font-mono text-xs uppercase tracking-wider hover:border-violet-400/50 hover:bg-[#16151B] transition-all cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Alex Rivera"
                    className="w-full px-4 py-3 rounded-xl bg-[#16151B] border border-white/10 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#16151B] border border-white/10 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">
                  Inquiry Topic
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#16151B] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-violet-400 transition-colors cursor-pointer"
                >
                  <option className="bg-[#0F0E11] text-white">App Support / Bug Report</option>
                  <option className="bg-[#0F0E11] text-white">Enterprise SDK & API Licensing</option>
                  <option className="bg-[#0F0E11] text-white">Press & Media Relations</option>
                  <option className="bg-[#0F0E11] text-white">Careers & Engineering Opportunities</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">
                  Message Details
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your inquiry..."
                  className="w-full px-4 py-3 rounded-xl bg-[#16151B] border border-white/10 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-400 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-black hover:bg-[#16151B] text-white border border-white/20 hover:border-violet-400/50 font-mono text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                    <span>Transmitting Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-violet-400" />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Studio Contacts & Locations */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 sm:p-8 rounded-[32px] bg-[#0F0E11] border border-white/10 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-violet-400 font-mono">&#125;</span>
              <span>Direct Communication</span>
            </h3>
            
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#16151B] border border-white/5">
                <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 shrink-0 border border-violet-500/20">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">Engineering Support</div>
                  <div className="text-white/60 font-mono text-xs">engineering@verado.io</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#16151B] border border-white/5">
                <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 shrink-0 border border-violet-500/20">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">Direct Studio Line</div>
                  <div className="text-white/60 font-mono text-xs">+1 (800) 555-VERADO</div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#16151B] border border-white/5">
                <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 shrink-0 border border-violet-500/20">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">Studio Headquarters</div>
                  <div className="text-white/60 text-xs">548 Market St, Suite 39201, San Francisco, CA</div>
                </div>
              </div>
            </div>
          </div>

          {/* Response SLA badge */}
          <div className="p-5 rounded-[24px] bg-[#0F0E11] border border-white/10 text-xs text-violet-300 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="font-mono">Support dispatch SLA: under 2 hours during US & EU market windows.</span>
          </div>
        </div>

      </div>

      {/* FAQ Accordion */}
      <div className="max-w-4xl mx-auto rounded-[32px] sm:rounded-[36px] bg-[#0F0E11] border border-white/10 p-6 sm:p-10">
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-violet-400">
            <span>&#125;</span>
            <span>Knowledge Base</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className={`rounded-2xl bg-[#16151B] border transition-all ${
                activeFaq === idx ? 'border-violet-500/40 bg-[#16151B]' : 'border-white/5 hover:border-white/15'
              }`}
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:text-violet-300 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${activeFaq === idx ? 'rotate-180 text-violet-400' : ''}`} />
              </button>
              {activeFaq === idx && (
                <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-white/70 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
