import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { getAppPrivacyPolicy } from '../../data/privacyPolicies';
import { detectAppSubdomain, KNOWN_SUBDOMAINS } from '../../utils/subdomain';
import { ShieldCheck, ArrowLeft, Mail, Lock, CheckCircle2, FileText, Smartphone, ExternalLink, Printer } from 'lucide-react';

interface AppPrivacyPolicyPageProps {
  appIdOverride?: string;
  isSubdomainMode?: boolean;
}

export const AppPrivacyPolicyPage: React.FC<AppPrivacyPolicyPageProps> = ({ 
  appIdOverride,
  isSubdomainMode = false,
}) => {
  const { id } = useParams<{ id: string }>();
  const { projects } = useApp();
  const location = useLocation();

  // Resolve active app ID: from prop, from url param, or from subdomain detection
  const detectedSubdomain = detectAppSubdomain();
  const targetId = appIdOverride || id || (detectedSubdomain ? detectedSubdomain.projectId : 'shoecheck');
  
  // Find project in catalog
  const project = projects.find(
    p => p.id.toLowerCase() === targetId.toLowerCase() ||
         p.id.toLowerCase().includes(targetId.toLowerCase())
  );

  const policy = getAppPrivacyPolicy(project?.id || targetId, project?.name);
  const appName = project?.name || policy.appName;
  const subdomain = detectedSubdomain?.subdomain || (KNOWN_SUBDOMAINS[targetId]?.subdomain) || targetId;

  // Root back path: in subdomain mode it's '/' on the same domain, in standard mode it's '/apps/:id'
  const backPath = isSubdomainMode ? '/' : `/apps/${project?.id || targetId}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0A090E] text-slate-100 flex flex-col font-sans selection:bg-violet-600/30">
      
      {/* 1. TOP APP-BRANDED NAVBAR */}
      <header className="sticky top-0 z-50 bg-[#0E0D14]/90 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to={backPath}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {appName}</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2 border-l border-white/10 pl-3">
            {project?.logo ? (
              <img src={project.logo} alt={appName} className="w-6 h-6 rounded-md object-cover" />
            ) : (
              <div className="w-6 h-6 rounded-md bg-violet-600 flex items-center justify-center text-xs font-bold">
                {appName.charAt(0)}
              </div>
            )}
            <span className="font-bold text-sm text-white">{appName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-[11px] font-mono text-violet-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Subdomain: {subdomain}.verado.dev</span>
          </div>

          <button
            onClick={handlePrint}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-xs font-mono text-slate-300 hover:text-white transition-colors"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print PDF</span>
          </button>

          <a
            href="/"
            className="text-xs font-mono text-slate-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Verado Studio</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </header>

      {/* 2. HERO / METADATA HEADER */}
      <section className="relative px-4 sm:px-8 py-10 sm:py-14 max-w-4xl mx-auto w-full">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 font-mono text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
            <span>App Store & Google Play Legal Compliance</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Privacy Policy
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Official privacy disclosures, data safety guarantees, and permission telemetry for{' '}
            <strong className="text-white">{appName}</strong>.
          </p>

          {/* Quick Details Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 font-mono text-xs">
            <div className="p-3 rounded-xl bg-[#12111A] border border-white/[0.08]">
              <span className="text-slate-500 block text-[10px] uppercase">Publisher</span>
              <span className="text-white font-medium">Verado Studios Inc.</span>
            </div>
            <div className="p-3 rounded-xl bg-[#12111A] border border-white/[0.08]">
              <span className="text-slate-500 block text-[10px] uppercase">Effective Date</span>
              <span className="text-violet-300 font-medium">{policy.effectiveDate}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#12111A] border border-white/[0.08]">
              <span className="text-slate-500 block text-[10px] uppercase">Architecture</span>
              <span className="text-emerald-400 font-medium">Local-First AI</span>
            </div>
            <div className="p-3 rounded-xl bg-[#12111A] border border-white/[0.08]">
              <span className="text-slate-500 block text-[10px] uppercase">Data Sale</span>
              <span className="text-white font-medium">Strictly Zero (0%)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. POLICY CONTENT BODY */}
      <main className="px-4 sm:px-8 pb-16 max-w-4xl mx-auto w-full space-y-10">
        
        {/* Core Summary Callout */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-violet-950/40 via-[#151320] to-[#12111A] border border-violet-500/30 space-y-2">
          <div className="flex items-center gap-2 text-violet-300 font-mono text-xs uppercase tracking-wider font-bold">
            <Lock className="w-4 h-4 text-violet-400" />
            <span>Executive Privacy Summary</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed">
            {policy.summary}
          </p>
        </div>

        {/* Data Types & Purpose Matrix */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-violet-400" />
            <span>Data Collection and Usage Matrix</span>
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#0E0D14]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#14121F] text-slate-400 font-mono text-[10px] uppercase border-b border-white/[0.08]">
                <tr>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Collected Items</th>
                  <th className="p-3.5">Explicit Purpose</th>
                  <th className="p-3.5">Storage Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-slate-300">
                {policy.dataTypesCollected.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="p-3.5 font-medium text-white">{item.category}</td>
                    <td className="p-3.5">
                      <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                        {item.items.map((i, iIdx) => (
                          <li key={iIdx}>{i}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-3.5 text-slate-300">{item.purpose}</td>
                    <td className="p-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono ${
                        item.storedLocally 
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-violet-950/60 text-violet-300 border border-violet-500/30'
                      }`}>
                        {item.storedLocally ? 'On-Device Only' : 'Encrypted Telemetry'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Detailed Sections */}
        <section className="space-y-8">
          {policy.sections.map((section, idx) => (
            <div key={idx} className="space-y-3 p-6 rounded-2xl bg-[#0E0D14] border border-white/[0.08]">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-violet-400 flex-shrink-0" />
                <span>{section.title}</span>
              </h3>
              <div className="space-y-2.5 text-xs sm:text-sm text-slate-300/90 leading-relaxed font-normal">
                {section.content.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Contact and Request Form Card */}
        <section className="p-6 sm:p-8 rounded-3xl bg-[#12111A] border border-violet-500/20 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Data Protection Officer & Privacy Inquiries</h4>
              <p className="text-xs text-slate-400">Verado Mobile Studios Inc. • Privacy Compliance Unit</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            If you have questions regarding this Privacy Policy, wish to exercise your rights under GDPR or CCPA, or request permanent deletion of any profile data associated with <strong className="text-white">{appName}</strong>, contact our dedicated privacy officer:
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="mailto:privacy@verado.dev"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs uppercase tracking-wider transition-all font-bold shadow-lg"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email privacy@verado.dev</span>
            </a>
            <Link
              to={backPath}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-200 text-xs font-mono uppercase tracking-wider transition-all"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Return to {appName}</span>
            </Link>
          </div>
        </section>

      </main>

      {/* 4. FOOTER */}
      <footer className="border-t border-white/[0.08] bg-[#0A090E] px-4 sm:px-8 py-6 text-center text-xs text-slate-500 font-mono">
        <p>© 2026 Verado Mobile Studios Inc. All rights reserved. • Subdomain: {subdomain}.verado.dev</p>
      </footer>

    </div>
  );
};
