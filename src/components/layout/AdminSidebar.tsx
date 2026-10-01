import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Settings, 
  ExternalLink, 
  Smartphone,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminSidebar: React.FC = () => {
  const { currentUser, unreadInquiriesCount } = useApp();

  const navItems = [
    {
      name: 'Overview',
      path: '/admin',
      icon: LayoutDashboard,
      exact: true,
      allowed: true,
    },
    {
      name: 'Projects',
      path: '/admin/projects',
      icon: FolderKanban,
      exact: false,
      allowed: currentUser.permissions.viewProjects,
    },
    {
      name: 'Team & Permissions',
      path: '/admin/users',
      icon: Users,
      exact: false,
      allowed: currentUser.role === 'Owner',
    },
    {
      name: 'Messages',
      path: '/admin/messages',
      icon: MessageSquare,
      exact: false,
      allowed: currentUser.role === 'Owner',
      badge: unreadInquiriesCount > 0 ? unreadInquiriesCount : undefined,
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: Settings,
      exact: false,
      allowed: currentUser.role === 'Owner',
    },
  ];

  return (
    <aside className="w-64 bg-[#0F0E11] border-r border-white/10 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand & Studio info */}
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 ring-1 ring-white/20 group-hover:scale-105 transition-transform">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-violet-400 text-sm">&#125;</span>
                <span className="font-extrabold text-base text-white tracking-tight">Verado</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  ADMIN
                </span>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">Control Hub</span>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <div className="px-3 py-6 space-y-1.5">
          <div className="px-3 mb-2 font-mono text-[10px] font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1">
            <span>&#125;</span>
            <span>Workspace</span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            if (!item.allowed) return null;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-violet-500/15 text-violet-300 font-bold border border-violet-500/30'
                      : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-violet-400" />
                  <span>{item.name}</span>
                </div>
                {item.badge ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-violet-600 text-white shadow-sm shadow-violet-600/50 animate-pulse">
                    {item.badge}
                  </span>
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Bottom User Persona info & Back to site */}
      <div className="p-4 border-t border-white/10 space-y-3">
        {/* Active persona pill */}
        <div className="p-3 rounded-2xl bg-[#16151B] border border-white/10 flex items-center gap-3">
          <img 
            src={currentUser.avatar} 
            alt={currentUser.name} 
            className="w-9 h-9 rounded-xl object-cover ring-1 ring-white/10" 
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white truncate">{currentUser.name}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-violet-500/20 text-violet-300">
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>

        <Link
          to="/"
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-full bg-black hover:bg-[#16151B] border border-white/20 hover:border-violet-400/50 font-mono text-xs uppercase tracking-wider text-white transition-all shadow-md"
        >
          <ExternalLink className="w-3.5 h-3.5 text-violet-400" />
          <span>View Public Showcase</span>
        </Link>
      </div>
    </aside>
  );
};
