import React, { useState, useEffect } from 'react';
import { Settings, Key, Shield, Smartphone, Save, Eye, EyeOff, Check, RefreshCw, Lock, Mail, UserCheck, Loader2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fetchStudioSettings, updateStudioSettings } from '../../lib/supabase';

export const AdminSettingsPage: React.FC = () => {
  const { addNotification, isSupabaseLive } = useApp();

  const [studioName, setStudioName] = useState('Verado Studios Inc.');
  const [supportEmail, setSupportEmail] = useState('engineering@verado.io');
  const [ownerEmail, setOwnerEmail] = useState(() => localStorage.getItem('verado_admin_email') || 'owner@verado.io');
  const [currentPassword, setCurrentPassword] = useState(() => localStorage.getItem('verado_admin_password') || 'verado2026!');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load latest settings from Supabase if connected
  useEffect(() => {
    fetchStudioSettings().then((remote) => {
      if (remote) {
        if (remote.studioName) setStudioName(remote.studioName);
        if (remote.supportEmail) setSupportEmail(remote.supportEmail);
        if (remote.ownerEmail) {
          setOwnerEmail(remote.ownerEmail);
          localStorage.setItem('verado_admin_email', remote.ownerEmail);
        }
        if (remote.ownerPassword) {
          setCurrentPassword(remote.ownerPassword);
          localStorage.setItem('verado_admin_password', remote.ownerPassword);
        }
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updatedPass = newPassword.trim() || currentPassword;

    // Save locally
    localStorage.setItem('verado_admin_email', ownerEmail.trim());
    localStorage.setItem('verado_admin_password', updatedPass);
    setCurrentPassword(updatedPass);
    setNewPassword('');

    // Save to Supabase Cloud
    await updateStudioSettings({
      studioName,
      supportEmail,
      ownerEmail: ownerEmail.trim(),
      ownerPassword: updatedPass,
    });

    setIsSaving(false);
    addNotification('Client credentials and studio settings saved! You can sign in with this email and password on any device.', 'success');
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-violet-400 mb-1">
            <span>&#125;</span>
            <span>Studio Preferences</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Studio & Client Settings</h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Manage owner login credentials, client email/password handover, and studio branding.
          </p>
        </div>
        {isSupabaseLive ? (
          <div className="px-3.5 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 font-mono text-xs font-semibold w-fit flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Cloud Sync Active</span>
          </div>
        ) : (
          <div className="px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-xs font-semibold w-fit">
            Local Storage Mode
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Client / Owner Login Credentials (Self-Service) */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-[#0F0E11] border border-white/10 space-y-5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-violet-400">&#125;</span>
            <Lock className="w-4 h-4 text-violet-400" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-violet-400">
              Client & Owner Login Credentials
            </h3>
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            Your client can change their login email and password here anytime without needing developer help.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">
                Owner Login Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="owner@clientcompany.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">
                New Password (Leave blank to keep active)
              </label>
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Type new password..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-400 transition-colors"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs bg-[#16151B] p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-white/50 font-mono">Currently Active Password:</span>
              <span className="font-mono text-violet-300 font-bold">
                {showPassword ? currentPassword : '••••••••••••'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="font-mono text-xs uppercase tracking-wider text-violet-400 hover:text-violet-300 font-semibold cursor-pointer"
            >
              {showPassword ? 'Hide' : 'Reveal'}
            </button>
          </div>
        </div>

        {/* Studio Profile */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-[#0F0E11] border border-white/10 space-y-5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-violet-400">&#125;</span>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-violet-400">
              Studio Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">Company / Studio Entity</label>
              <input
                type="text"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-violet-400 transition-colors"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">Public Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-violet-400 transition-colors"
              />
            </div>
          </div>
        </div>



        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-7 py-3 rounded-full bg-black hover:bg-[#16151B] disabled:opacity-60 text-white border border-white/20 hover:border-violet-400/50 font-mono text-xs uppercase tracking-wider font-bold shadow-xl flex items-center gap-2 cursor-pointer transition-all"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" />
                <span>Saving Credentials...</span>
              </>
            ) : (
              <span>Save & Update All Settings</span>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
