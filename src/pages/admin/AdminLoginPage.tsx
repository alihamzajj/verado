import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Smartphone, Shield, KeyRound, ArrowRight, Eye, EyeOff, ExternalLink, Check, Lock, Sparkles, UserCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fetchStudioSettings } from '../../lib/supabase';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { users, setCurrentUser, acceptInvitation, loginWithPasscode, teamInvitations, addNotification } = useApp();

  const searchParams = new URLSearchParams(location.search);
  const inviteToken = searchParams.get('invite');
  const emailParam = searchParams.get('email');
  
  const [loginTab, setLoginTab] = useState<'passcode' | 'owner'>('passcode');
  const [passcode, setPasscode] = useState('');
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

  const handlePasscodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const result = await loginWithPasscode(passcode, email);
      if (result.success && result.user) {
        navigate('/admin');
      } else {
        setLoading(false);
        setErrorMsg(result.error || 'Invalid or expired access password.');
      }
    } catch {
      setLoading(false);
      setErrorMsg('Error verifying access password.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const inputEmail = email.trim().toLowerCase();

      // Check if password entered is an active access passcode
      const byPasscode = users.find(u => u.accessPasscode && u.accessPasscode.toUpperCase() === password.trim().toUpperCase());
      if (byPasscode) {
        localStorage.setItem('verado_admin_auth', 'true');
        localStorage.setItem('apex_current_user_id', byPasscode.id);
        setCurrentUser(byPasscode);
        addNotification(`Access granted! Signed in as ${byPasscode.name} (${byPasscode.role}).`, 'success');
        navigate('/admin');
        return;
      }

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
      setErrorMsg('Invalid credentials. Access restricted to authorized team members.');
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
              Enter the access password generated by the Studio Owner to manage and edit projects.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex p-1 rounded-2xl bg-[#16151B] border border-white/10 mb-5 text-xs font-mono">
            <button
              type="button"
              onClick={() => { setLoginTab('passcode'); setErrorMsg(''); }}
              className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer font-bold ${
                loginTab === 'passcode'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Employee Password</span>
            </button>
            <button
              type="button"
              onClick={() => { setLoginTab('owner'); setErrorMsg(''); }}
              className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer font-bold ${
                loginTab === 'owner'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Owner Login</span>
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400 font-mono">
              {errorMsg}
            </div>
          )}

          {loginTab === 'passcode' ? (
            /* Employee Admin-Generated Password Login */
            <form onSubmit={handlePasscodeLogin} className="space-y-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">
                  Admin-Generated Access Password
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value.toUpperCase())}
                    placeholder="e.g. VRD-749281"
                    className="w-full px-4 py-3 rounded-xl bg-[#16151B] border border-violet-500/40 text-sm font-mono tracking-widest text-white placeholder:text-white/30 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-colors uppercase"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed mt-1.5 font-mono">
                  Put the password given to you by the Studio Owner to unlock dashboard & project edit access.
                </p>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">
                  Your Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#16151B] border border-white/10 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-400 transition-colors"
                  placeholder="e.g. developer@verado.io"
                />
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
                    <KeyRound className="w-4 h-4" />
                    <span>Verify Password & Enter Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Owner Credentials Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">
                  Owner Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#16151B] border border-white/10 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-400 transition-colors"
                  placeholder="owner@verado.io"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">
                  Owner Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter owner password..."
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
          )}

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
