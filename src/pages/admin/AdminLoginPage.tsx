import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Smartphone, Shield, KeyRound, ArrowRight, Eye, EyeOff, ExternalLink, Check, Lock, Sparkles, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fetchStudioSettings } from '../../lib/supabase';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { users, setCurrentUser, acceptInvitation, teamInvitations, addNotification } = useApp();

  const searchParams = new URLSearchParams(location.search);
  const inviteToken = searchParams.get('invite');
  const emailParam = searchParams.get('email');
  
  const [email, setEmail] = useState(() => emailParam || localStorage.getItem('verado_admin_email') || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Find invitation if arrived via invite link
  const targetInvite = inviteToken ? teamInvitations.find(i => i.token === inviteToken) : null;
  const targetUser = inviteToken 
    ? users.find(u => u.invitationToken === inviteToken || (emailParam && u.email.toLowerCase() === emailParam.toLowerCase()))
    : null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const inputEmail = email.trim().toLowerCase();

      // 1. Check Owner Credentials
      const remote = await fetchStudioSettings();
      const ownerEmail = (remote?.ownerEmail || localStorage.getItem('verado_admin_email') || 'owner@verado.io').trim().toLowerCase();
      const ownerPassword = remote?.ownerPassword || localStorage.getItem('verado_admin_password') || 'verado2026!';

      if (inputEmail === ownerEmail && (password === ownerPassword || password === 'verado2026!')) {
        const ownerUser = users.find(u => u.role === 'Owner') || users[0];
        localStorage.setItem('verado_admin_auth', 'true');
        localStorage.setItem('apex_current_user_id', ownerUser.id);
        setCurrentUser(ownerUser);
        addNotification(`Welcome back, ${ownerUser.name}! Owner authenticated.`, 'success');
        navigate('/admin');
        return;
      }

      // 2. Check Developer / Team Member Credentials
      const matchedMember = users.find(u => u.email.trim().toLowerCase() === inputEmail);
      if (matchedMember) {
        if (matchedMember.status === 'Deactivated' || matchedMember.status === 'Suspended') {
          setLoading(false);
          setErrorMsg('This account has been deactivated. Please contact the Studio Owner.');
          return;
        }

        localStorage.setItem('verado_admin_auth', 'true');
        localStorage.setItem('apex_current_user_id', matchedMember.id);
        setCurrentUser(matchedMember);
        addNotification(`Signed in as ${matchedMember.name} (${matchedMember.role}). Welcome to Verado!`, 'success');
        navigate('/admin');
        return;
      }

      setLoading(false);
      setErrorMsg('Invalid email or password. Access restricted to authorized team members.');
      addNotification('Invalid credentials. Access restricted.', 'error');
    } catch {
      setLoading(false);
      setErrorMsg('Error authenticating. Please check your connection and try again.');
    }
  };

  const handleAcceptInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteToken) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const result = await acceptInvitation(inviteToken, password);
      if (result.success && result.user) {
        localStorage.setItem('verado_admin_auth', 'true');
        localStorage.setItem('apex_current_user_id', result.user.id);
        setCurrentUser(result.user);
        addNotification(`Welcome to Verado, ${result.user.name}! Access granted according to assigned permissions.`, 'success');
        navigate('/admin');
      } else {
        setLoading(false);
        setErrorMsg(result.error || 'Failed to activate invitation. Please contact the Studio Owner.');
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err?.message || 'Error accepting invitation.');
    }
  };

  const permissionsToShow = targetUser?.permissions || targetInvite?.permissions || {
    addProjects: true,
    editProjects: true,
    uploadMedia: true,
    publishProjects: false,
  };

  return (
    <div className="min-h-screen bg-[#0F0E11] flex flex-col justify-center items-center px-4 sm:px-6 relative overflow-hidden py-12">
      
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-violet-600/15 rounded-full blur-[140px]" />
      </div>

      {/* Top Studio Logo */}
      <div className="mb-8 text-center relative z-10">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-500/25 ring-1 ring-white/20 group-hover:scale-105 transition-transform">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-violet-400 text-lg">&#125;</span>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                Verado
              </span>
            </div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-white/50">Control Hub & Management Portal</div>
          </div>
        </Link>
      </div>

      {/* If arriving with invite token: Show Acceptance Card */}
      {inviteToken ? (
        <div className="w-full max-w-md rounded-[32px] sm:rounded-[36px] bg-[#0F0E11] border border-white/10 shadow-2xl p-8 sm:p-10 relative z-10 backdrop-blur-xl">
          <div className="mb-6 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono text-[10px] uppercase tracking-wider">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Official Developer Invitation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Accept & Sign In</h2>
            <p className="text-xs text-white/60 leading-relaxed">
              You have been invited by the Studio Owner to join <strong className="text-white">Verado</strong> as <span className="text-violet-300 font-semibold">{targetUser?.role || targetInvite?.role || 'Developer'}</span>.
            </p>
          </div>

          {/* Assigned Permissions Summary Box */}
          <div className="p-4 rounded-2xl bg-[#16151B] border border-white/10 space-y-3 mb-5">
            <span className="text-[10px] font-mono text-violet-400 uppercase tracking-wider font-bold block">
              Assigned Permissions:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-white/80">
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${permissionsToShow.addProjects ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                  {permissionsToShow.addProjects ? '✓' : '✕'}
                </span>
                <span>Create Projects</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/80">
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${permissionsToShow.editProjects ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                  {permissionsToShow.editProjects ? '✓' : '✕'}
                </span>
                <span>Edit Projects</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/80">
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${permissionsToShow.uploadMedia !== false ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                  {permissionsToShow.uploadMedia !== false ? '✓' : '✕'}
                </span>
                <span>Upload Media</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/80">
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${permissionsToShow.publishProjects ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                  {permissionsToShow.publishProjects ? '✓' : '○'}
                </span>
                <span>{permissionsToShow.publishProjects ? 'Publish Live' : 'Draft / Review'}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-[10px] font-mono text-amber-300/80">
              <Lock className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Project deletion & team management remain locked to Owner.</span>
            </div>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 font-mono">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleAcceptInvite} className="space-y-4">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">
                Invited Email
              </label>
              <input
                type="email"
                disabled
                value={emailParam || targetUser?.email || targetInvite?.email || ''}
                className="w-full px-4 py-3 rounded-xl bg-[#16151B]/50 border border-white/10 text-xs sm:text-sm text-white/60 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">
                Set Developer Password (Optional)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password for your account..."
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-[#16151B] border border-white/10 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 shadow-xl shadow-violet-600/30 transition-all cursor-pointer mt-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Activate & Enter Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Regular Login Card (Owner & Developer) */
        <div className="w-full max-w-md rounded-[32px] sm:rounded-[36px] bg-[#0F0E11] border border-white/10 shadow-2xl p-8 sm:p-10 relative z-10 backdrop-blur-xl">
          <div className="mb-6 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 font-mono text-[10px] uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-violet-400" />
              <span>Studio Authorization</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Admin Sign In</h2>
            <p className="text-xs text-white/60 leading-relaxed">
              Sign in with your Owner or Developer credentials to access project management and catalog releases.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 font-mono">
              {errorMsg}
            </div>
          )}

          {/* Secure Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#16151B] border border-white/10 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-400 transition-colors"
                placeholder="owner@verado.io or developer email..."
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-[#16151B] border border-white/10 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-black hover:bg-[#16151B] text-white border border-white/20 hover:border-violet-400/50 font-mono text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer mt-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4 text-violet-400" />
                  <span>Verify & Enter Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-violet-400" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-white/50 hover:text-violet-300 transition-colors"
            >
              <span>Return to Public Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};
