import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Bell, 
  ChevronDown, 
  ShieldCheck, 
  LogOut, 
  Users, 
  Sparkles,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getInitialsAvatar } from '../../lib/avatar';

export const AdminHeader: React.FC = () => {
  const { currentUser, users, setCurrentUser, addNotification } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname === '/admin') return 'Studio Overview';
    if (location.pathname.startsWith('/admin/projects/new')) return 'Add New Application';
    if (location.pathname.includes('/edit')) return 'Edit Application Details';
    if (location.pathname.startsWith('/admin/projects')) return 'Project Portfolio Manager';
    if (location.pathname.startsWith('/admin/users')) return 'Developer Permissions & Roles';
    if (location.pathname.startsWith('/admin/settings')) return 'Studio Settings & Credentials';
    return 'Admin Console';
  };

  const handleSignOut = () => {
    localStorage.removeItem('verado_admin_auth');
    addNotification('Logged out from Admin Console', 'info');
    navigate('/admin/login');
  };

  return (
    <header className="h-16 px-6 bg-[#0F0E11]/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between z-30 shrink-0">
      {/* Breadcrumb / Title */}
      <div className="flex items-center gap-2.5">
        <span className="font-mono text-violet-400 text-sm">&#125;</span>
        <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
          {getPageTitle()}
        </h2>
      </div>

      {/* Right Tools & Fast Persona Switcher */}
      <div className="flex items-center gap-3">
        
        {/* STUDIO OWNER PROFILE - Admin is always Admin (No persona switching) */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#16151B] border border-white/10 hover:border-violet-400/50 text-white text-xs font-medium transition-all shadow-sm cursor-pointer"
          >
            <div className="relative">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = getInitialsAvatar(currentUser.name);
                }}
                className="w-6 h-6 rounded-full object-cover" 
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-left hidden sm:block">
              <span className="font-semibold block text-white text-xs">{currentUser.name}</span>
              <span className={`font-mono text-[9px] uppercase tracking-wider font-bold ${
                currentUser.role === 'Owner' ? 'text-amber-400' : 'text-violet-400'
              }`}>
                {currentUser.role === 'Owner' ? '👑 Studio Owner' : `💻 ${currentUser.role}`}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-white/50" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#0F0E11] border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2.5 border-b border-white/10">
                <div className="font-bold text-white text-xs">{currentUser.name}</div>
                <div className="text-[11px] font-mono text-white/50">{currentUser.email}</div>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-violet-500/10 text-violet-300 border border-violet-500/20">
                  <span>{currentUser.role === 'Owner' ? '👑 Studio Owner & Administrator' : `💻 ${currentUser.role}`}</span>
                </div>
              </div>

              {currentUser.role === 'Owner' && (
                <div className="py-1 space-y-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/admin/settings');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs text-white/80 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                    <span>Studio Profile & Settings</span>
                  </button>
                </div>
              )}

              <div className="pt-2 border-t border-white/10 mt-1">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors font-medium cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-full bg-[#16151B] border border-white/10 text-white/70 hover:text-white hover:border-violet-400/50 transition-colors relative cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-400" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0F0E11] border border-white/10 shadow-2xl p-4 z-50 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                <span className="font-bold text-white">System Events</span>
                <span className="font-mono text-[10px] text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">Live Mock</span>
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-[#16151B] border border-white/5">
                  <p className="font-medium text-white">Production Build Passed</p>
                  <p className="text-[11px] text-white/60">ShoeCheck v3.2.1 passed iOS App Store verification.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#16151B] border border-white/5">
                  <p className="font-medium text-white">Role Policy Updated</p>
                  <p className="text-[11px] text-white/60">Owner updated production release permissions for Developer team.</p>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
