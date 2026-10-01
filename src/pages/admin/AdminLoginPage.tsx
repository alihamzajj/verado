import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Smartphone, Shield, KeyRound, ArrowRight, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fetchStudioSettings } from '../../lib/supabase';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { users, setCurrentUser, addNotification } = useApp();
  
  const [email, setEmail] = useState(() => localStorage.getItem('verado_admin_email') || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      // Check cloud settings first
      const remote = await fetchStudioSettings();
      const validEmail = remote?.ownerEmail || localStorage.getItem('verado_admin_email') || 'owner@verado.io';
      const validPassword = remote?.ownerPassword || localStorage.getItem('verado_admin_password') || 'verado2026!';

      const emailMatches = email.trim().toLowerCase() === validEmail.trim().toLowerCase();
      const passwordMatches = password === validPassword;

      if (emailMatches && passwordMatches) {
        localStorage.setItem('verado_admin_auth', 'true');
        setCurrentUser(users[0]);
        addNotification('Owner authenticated successfully. Welcome to Verado Control Hub.', 'success');
        navigate('/admin');
      } else {
        setLoading(false);
        setErrorMsg('Invalid email or password. Access restricted to verified studio owner.');
        addNotification('Invalid credentials. Access restricted.', 'error');
      }
    } catch {
      const validEmail = localStorage.getItem('verado_admin_email') || 'owner@verado.io';
      const savedPassword = localStorage.getItem('verado_admin_password') || 'verado2026!';
      if (email.trim().toLowerCase() === validEmail.trim().toLowerCase() && password === savedPassword) {
        localStorage.setItem('verado_admin_auth', 'true');
        setCurrentUser(users[0]);
        navigate('/admin');
      } else {
        setLoading(false);
        setErrorMsg('Invalid credentials.');
      }
    }
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
            <div className="font-mono text-[11px] uppercase tracking-wider text-white/50">Owner & Studio Admin Portal</div>
          </div>
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md rounded-[32px] sm:rounded-[36px] bg-[#0F0E11] border border-white/10 shadow-2xl p-8 sm:p-10 relative z-10 backdrop-blur-xl">
        <div className="mb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 font-mono text-[10px] uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-violet-400" />
            <span>Owner Authorization</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Admin Sign In</h2>
          <p className="text-xs text-white/60 leading-relaxed">
            Private management console for catalog releases, asset uploads, and database control.
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
              Owner Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#16151B] border border-white/10 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-400 transition-colors"
              placeholder="Enter owner email..."
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

    </div>
  );
};
