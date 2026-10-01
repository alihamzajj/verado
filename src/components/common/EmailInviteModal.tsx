import React, { useState } from 'react';
import { Mail, Check, Copy, ExternalLink, ShieldCheck, Sparkles, ArrowRight, UserCheck } from 'lucide-react';
import { User } from '../../types';
import { Modal } from './Modal';

interface EmailInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onAcceptAndLaunch: (user: User) => void;
}

export const EmailInviteModal: React.FC<EmailInviteModalProps> = ({
  isOpen,
  onClose,
  user,
  onAcceptAndLaunch,
}) => {
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const simulatedInviteUrl = `${window.location.origin}/submit-project?invite=${user.invitationToken || user.id}&email=${encodeURIComponent(user.email)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(simulatedInviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Email Invitation Notification" maxWidth="max-w-2xl">
      <div className="space-y-6">
        
        {/* Email Client Header Preview */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#16151B] border border-white/10 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-violet-400 font-bold">
              <Mail className="w-4 h-4" />
              <span>INCOMING STUDIO INVITATION EMAIL</span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Dispatched & Ready
            </span>
          </div>

          <div className="space-y-1.5 text-white/70 text-[11px]">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="text-white/40 uppercase w-20">From:</span>
              <span className="text-white font-medium">Verado Studio Security &lt;invitations@verado.io&gt;</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="text-white/40 uppercase w-20">To:</span>
              <span className="text-violet-300 font-bold">{user.name} &lt;{user.email}&gt;</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="text-white/40 uppercase w-20">Subject:</span>
              <span className="text-white font-semibold">You're invited to Verado Application Showcase as {user.role}</span>
            </div>
          </div>
        </div>

        {/* Email Body Letter */}
        <div className="p-6 rounded-[28px] bg-gradient-to-b from-[#16151B] to-[#0F0E11] border border-white/10 space-y-5 shadow-2xl">
          
          {/* Studio Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center font-black text-sm text-violet-300">
                V
              </div>
              <span className="font-bold text-white tracking-wide">VERADO STUDIO</span>
            </div>
            <span className="font-mono text-[10px] text-white/40 uppercase">Role-Based Access Gateway</span>
          </div>

          {/* Invitation Letter Body */}
          <div className="space-y-3">
            <h4 className="text-lg font-bold text-white">
              Hello {user.name},
            </h4>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              The Studio Owner has authorized your employee account and invited you to collaborate on the <strong className="text-white">Verado Showcase & Application Portfolio</strong>.
            </p>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              Your assigned role is <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30">{user.role}</span>.
              You now have full authority to add and draft new applications for the showcase.
            </p>
          </div>

          {/* User Permission Pills */}
          <div className="p-4 rounded-2xl bg-[#0F0E11] border border-white/5 space-y-2">
            <span className="font-mono text-[11px] font-bold text-white/60 uppercase block">
              Granted Authorization Scopes:
            </span>
            <div className="flex flex-wrap gap-2 text-[11px] font-mono">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5">
                <Check className="w-3 h-3" /> Add Applications
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1.5">
                <Check className="w-3 h-3" /> Edit Submissions
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-300 border border-violet-500/20 flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3" /> Code Access: {user.codeAccess || 'Read Only'}
              </span>
            </div>
          </div>

          {/* Primary Action Button to Land Directly on Project Add Portal */}
          <div className="pt-2 text-center space-y-3">
            <a
              href={simulatedInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-mono text-xs sm:text-sm uppercase tracking-wider font-extrabold shadow-2xl shadow-violet-600/30 inline-flex items-center justify-center gap-2.5 mx-auto transition-all cursor-pointer transform hover:scale-[1.02]"
            >
              <span>Add Your Project to Verado →</span>
            </a>
            <p className="text-[11px] text-white/40 font-mono">
              Clicking lands directly on the Project Add screen for <strong className="text-white">{user.name}</strong> (no admin access).
            </p>
          </div>
        </div>

        {/* Copy Direct Contributor Link */}
        <div className="p-4 rounded-2xl bg-[#16151B] border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-mono text-[11px] uppercase tracking-wider text-white/60 font-bold">
              Direct Contributor Access Link
            </label>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-violet-400 hover:text-violet-300 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Contributor Link</span>
                </>
              )}
            </button>
          </div>
          <input
            type="text"
            readOnly
            value={simulatedInviteUrl}
            className="w-full px-3.5 py-2 rounded-xl bg-[#0F0E11] border border-white/10 text-xs font-mono text-white/70 select-all focus:outline-none"
          />
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-[#16151B] hover:bg-black border border-white/10 text-white/80 hover:text-white font-mono text-xs uppercase tracking-wider cursor-pointer"
          >
            Close
          </button>
          <a
            href={simulatedInviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs uppercase tracking-wider font-bold shadow-xl shadow-violet-600/30 transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Open Project Portal As {user.name.split(' ')[0]} →</span>
          </a>
        </div>

      </div>
    </Modal>
  );
};
