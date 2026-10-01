import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Key, 
  Shield, 
  Smartphone, 
  Save, 
  Eye, 
  EyeOff, 
  Check, 
  RefreshCw, 
  Lock, 
  Mail, 
  UserCheck, 
  Loader2,
  User as UserIcon,
  Palette,
  Camera
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fetchStudioSettings, updateStudioSettings } from '../../lib/supabase';
import { getInitialsAvatar, AVATAR_GRADIENTS } from '../../lib/avatar';

export const AdminSettingsPage: React.FC = () => {
  const { currentUser, updateUserProfile, addNotification, isSupabaseLive } = useApp();

  const [studioName, setStudioName] = useState('Verado Studios Inc.');
  const [supportEmail, setSupportEmail] = useState('engineering@verado.io');
  
  // Owner Profile & Credentials State
  const [ownerName, setOwnerName] = useState(() => localStorage.getItem('verado_owner_name') || currentUser.name || 'Ali Hamza');
  const [ownerEmail, setOwnerEmail] = useState(() => localStorage.getItem('verado_admin_email') || currentUser.email || 'owner@verado.io');
  const [currentPassword, setCurrentPassword] = useState(() => localStorage.getItem('verado_admin_password') || 'verado2026!');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Avatar customization
  const [selectedGradient, setSelectedGradient] = useState<string>('amethyst');
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>(() => {
    return (currentUser.avatar && !currentUser.avatar.startsWith('data:image/svg')) ? currentUser.avatar : '';
  });
  const [showCustomPhotoInput, setShowCustomPhotoInput] = useState<boolean>(false);

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
    const finalAvatar = customPhotoUrl.trim() || getInitialsAvatar(ownerName, selectedGradient);

    // Save locally
    localStorage.setItem('verado_admin_email', ownerEmail.trim());
    localStorage.setItem('verado_admin_password', updatedPass);
    localStorage.setItem('verado_owner_name', ownerName.trim());
    localStorage.setItem('verado_owner_avatar', finalAvatar);
    setCurrentPassword(updatedPass);
    setNewPassword('');

    // Update Profile in reactive Context and users roster
    updateUserProfile(currentUser.id, {
      name: ownerName.trim(),
      email: ownerEmail.trim(),
      avatar: finalAvatar,
    });

    // Save to Supabase Cloud
    await updateStudioSettings({
      studioName,
      supportEmail,
      ownerEmail: ownerEmail.trim(),
      ownerPassword: updatedPass,
    });

    setIsSaving(false);
    addNotification('Owner profile, credentials, and studio settings updated successfully!', 'success');
  };

  const previewAvatarSrc = customPhotoUrl.trim() || getInitialsAvatar(ownerName || 'Owner', selectedGradient);

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-violet-400 mb-1">
            <span>&#125;</span>
            <span>Studio Preferences</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Owner Profile & Settings</h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Update your profile name, email, avatar monogram/photo, login password, and studio branding.
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
        
        {/* 1. Owner Profile Identity & Avatar (Name, Email, Pic) */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-[#0F0E11] border border-white/10 space-y-5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-violet-400">&#125;</span>
            <UserCheck className="w-4 h-4 text-violet-400" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-violet-400">
              Owner Profile & Picture
            </h3>
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            Customize how your name and avatar appear across the admin console, top header, and project author tags.
          </p>

          {/* Live Monogram Badge / Picture Preview */}
          <div className="p-5 rounded-2xl bg-[#16151B] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <img 
                src={previewAvatarSrc} 
                alt={ownerName} 
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-violet-500/40 shadow-xl shrink-0" 
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{ownerName || 'Studio Owner'}</span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Owner
                  </span>
                </div>
                <span className="font-mono text-xs text-white/50 block">{ownerEmail}</span>
                <span className="text-[11px] text-violet-300 font-mono">
                  {customPhotoUrl ? 'Custom Photo Link Active' : 'Monogram Badge (No photo required)'}
                </span>
              </div>
            </div>

            {/* Gradient Theme Selector for Monogram */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-white/40 uppercase block">Badge Theme:</span>
              <div className="flex items-center gap-2">
                {AVATAR_GRADIENTS.map((grad) => (
                  <button
                    key={grad.id}
                    type="button"
                    onClick={() => {
                      setSelectedGradient(grad.id);
                      setCustomPhotoUrl('');
                    }}
                    style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}
                    className={`w-7 h-7 rounded-xl transition-all cursor-pointer ${
                      selectedGradient === grad.id && !customPhotoUrl
                        ? 'ring-2 ring-white scale-110 shadow-lg shadow-violet-500/40'
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                    title={grad.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Optional Custom Photo URL Toggle */}
          <div className="pt-1">
            {!showCustomPhotoInput && !customPhotoUrl ? (
              <button
                type="button"
                onClick={() => setShowCustomPhotoInput(true)}
                className="text-xs font-mono text-violet-400 hover:text-violet-300 flex items-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>+ Upload or Enter Custom Photo URL (Optional)</span>
              </button>
            ) : (
              <div className="p-4 rounded-xl bg-[#16151B] border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs text-white/70">Custom Profile Picture URL (Optional)</label>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomPhotoUrl('');
                      setShowCustomPhotoInput(false);
                    }}
                    className="text-xs text-white/40 hover:text-white"
                  >
                    Reset to Monogram Badge
                  </button>
                </div>
                <input
                  type="url"
                  value={customPhotoUrl}
                  onChange={(e) => setCustomPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-... or your image URL"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0F0E11] border border-white/10 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-400 transition-colors"
                />
              </div>
            )}
          </div>

          {/* Name & Email Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">
                Owner Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="e.g. Ali Hamza"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">
                Owner Email (Also Used to Sign In)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  required
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="owner@yourcompany.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-400 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Login Password Management */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-[#0F0E11] border border-white/10 space-y-5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-violet-400">&#125;</span>
            <Lock className="w-4 h-4 text-violet-400" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-violet-400">
              Admin Password & Credentials
            </h3>
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            Change your admin portal login password. Saved to local storage and synced to cloud settings.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">
                Currently Active Password
              </label>
              <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs sm:text-sm">
                <span className="font-mono text-violet-300 font-bold">
                  {showPassword ? currentPassword : '••••••••••••'}
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="font-mono text-[11px] uppercase tracking-wider text-violet-400 hover:text-violet-300 font-semibold cursor-pointer"
                >
                  {showPassword ? 'Hide' : 'Reveal'}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">
                New Password (Optional)
              </label>
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep current password..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-400 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* 3. Studio Profile */}
        <div className="p-6 sm:p-8 rounded-[32px] bg-[#0F0E11] border border-white/10 space-y-5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-violet-400">&#125;</span>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-violet-400">
              Studio Entity & Public Support
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

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 rounded-full bg-black hover:bg-[#16151B] disabled:opacity-60 text-white border border-white/20 hover:border-violet-400/50 font-mono text-xs uppercase tracking-wider font-bold shadow-xl flex items-center gap-2 cursor-pointer transition-all"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-violet-400" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <span>Save & Update Profile</span>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
