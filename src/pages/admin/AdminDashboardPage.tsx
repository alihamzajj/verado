import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderKanban, 
  CheckCircle, 
  Smartphone, 
  Apple, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  Plus, 
  Activity, 
  ShieldCheck, 
  ExternalLink,
  Layers,
  Star,
  Clock,
  Archive,
  Bell,
  Trash2,
  Mail,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { EmailInviteModal } from '../../components/common/EmailInviteModal';
import { User } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const { 
    projects, 
    users, 
    activities, 
    currentUser, 
    deleteUser, 
    toggleUserStatus, 
    loginAsUser 
  } = useApp();
  const isOwner = currentUser.role === 'Owner';
  const [employeeToDelete, setEmployeeToDelete] = useState<User | null>(null);
  const [dashboardInviteUser, setDashboardInviteUser] = useState<User | null>(null);

  const totalActive = projects.filter(p => !p.isArchived).length;
  const publishedProjects = projects.filter(p => p.published && !p.isArchived).length;
  const draftsCount = projects.filter(p => !p.published && !p.isArchived).length;
  const archivedCount = projects.filter(p => p.isArchived).length;
  const totalDevelopers = users.filter(u => u.role === 'Developer' || u.role === 'Owner').length;

  const stats = [
    { label: 'Active Projects', value: totalActive, icon: FolderKanban, color: 'text-sky-400', bg: 'bg-sky-500/10' },
    { label: 'Live Published', value: publishedProjects, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Drafts / In Review', value: draftsCount, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Safe Archive', value: archivedCount, icon: Archive, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Studio Team', value: totalDevelopers, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-8 p-4 sm:p-8 max-w-7xl mx-auto">
      
      {/* Welcome Banner */}
      <div className="p-8 sm:p-10 rounded-[32px] sm:rounded-[40px] bg-[#0F0E11] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-violet-400">
              &#125; Active Session: {currentUser.role}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
              Live Mock
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-white/60 max-w-xl">
            You are managing Verado's application catalog and product releases.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black hover:bg-[#16151B] text-white border border-white/20 hover:border-violet-400/50 font-mono text-xs uppercase tracking-wider font-semibold shadow-xl transition-all"
          >
            <Plus className="w-4 h-4 text-violet-400" />
            <span>+ Add Project</span>
          </Link>
        </div>
      </div>

      {/* Owner Pending Review Callout Banner */}
      {isOwner && draftsCount > 0 && (
        <div className="p-5 rounded-[28px] bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase font-bold text-amber-300 tracking-wider">
                  Owner Approval Queue
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-400/20 text-amber-300">
                  {draftsCount} Pending Review
                </span>
              </div>
              <p className="text-xs text-amber-100/90 mt-0.5">
                New application submissions or edits by team members are waiting for your approval before going live on the showcase.
              </p>
            </div>
          </div>
          <Link
            to="/admin/projects"
            className="px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-mono text-xs uppercase font-bold tracking-wider transition-colors shrink-0 shadow-lg shadow-amber-500/20 self-start sm:self-auto cursor-pointer"
          >
            Review & Publish →
          </Link>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="p-5 rounded-[24px] bg-[#0F0E11] border border-white/10 shadow-sm flex flex-col justify-between space-y-4 hover:border-violet-500/30 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-white/50">{s.label}</span>
                <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-white">{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Simulated Analytics & Platform Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Chart: Monthly Downloads Trend */}
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-[32px] bg-[#0F0E11] border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-violet-400 mb-1">
                <span>&#125;</span>
                <span>Telemetry Trends</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Monthly Downloads Growth (2026)
              </h3>
              <p className="text-xs text-white/50 mt-0.5">Aggregated App Store & Google Play Telemetry</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-violet-500/10 text-violet-300 border border-violet-500/20">
              <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
              <span>+34.2% MoM</span>
            </div>
          </div>

          {/* SVG Bar Chart with glowing heights */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-white/10">
            {[
              { month: 'Apr', val: 42, count: '320k' },
              { month: 'May', val: 56, count: '450k' },
              { month: 'Jun', val: 68, count: '540k' },
              { month: 'Jul', val: 80, count: '690k' },
              { month: 'Aug', val: 92, count: '810k' },
              { month: 'Sep', val: 100, count: '940k' },
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] text-violet-300 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  {bar.count}
                </span>
                <div 
                  className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-violet-600 to-violet-400 group-hover:from-violet-500 group-hover:to-purple-300 transition-all duration-300 shadow-lg shadow-violet-500/20"
                  style={{ height: `${bar.val * 1.6}px` }}
                />
                <span className="font-mono text-xs text-white/50">{bar.month}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-white/50 pt-1 font-mono">
            <span>Peak Month: September (ShoeCheck v3.2.1 Launch)</span>
            <span className="font-bold text-white">Total: 5.8M+ Downloads</span>
          </div>
        </div>

        {/* Right Chart: Platform Distribution */}
        <div className="lg:col-span-4 p-6 sm:p-8 rounded-[32px] bg-[#0F0E11] border border-white/10 space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-violet-400 mb-1">
              <span>&#125;</span>
              <span>Ecosystem</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">Platform Breakdown</h3>
            <p className="text-xs text-white/50 mt-0.5">Device Operating System Split</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="flex items-center gap-1.5 text-white/90">
                  <Apple className="w-3.5 h-3.5 text-violet-400" /> iOS (Apple App Store)
                </span>
                <span className="font-mono font-bold text-violet-400">58%</span>
              </div>
              <div className="h-2 rounded-full bg-[#16151B] border border-white/5 overflow-hidden">
                <div className="h-full bg-violet-500 rounded-full w-[58%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5 font-medium">
                <span className="flex items-center gap-1.5 text-white/90">
                  <Smartphone className="w-3.5 h-3.5 text-violet-400" /> Android (Google Play)
                </span>
                <span className="font-mono font-bold text-violet-400">42%</span>
              </div>
              <div className="h-2 rounded-full bg-[#16151B] border border-white/5 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full w-[42%]" />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#16151B] border border-white/10 text-xs space-y-1">
            <span className="font-mono text-xs uppercase tracking-wider text-white block">Engine Consistency</span>
            <p className="text-white/60 text-[11px] leading-relaxed">
              Cross-platform code reuse between iOS and Android currently averages 89.4% with native platform shims.
            </p>
          </div>
        </div>

      </div>

      {/* Bottom Grid: Recent Projects & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Projects Table */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-[32px] bg-[#0F0E11] border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-violet-400 font-mono">&#125;</span>
              <span>Recent Projects</span>
            </h3>
            <Link to="/admin/projects" className="font-mono text-xs uppercase tracking-wider text-violet-400 hover:text-violet-300 font-semibold">
              Manage All ({projects.length}) →
            </Link>
          </div>

          <div className="divide-y divide-white/5 overflow-x-auto">
            {projects.slice(0, 5).map((project) => (
              <div key={project.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={project.logo} alt={project.name} className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-white truncate hover:text-violet-300 transition-colors">
                      {project.name}
                    </div>
                    <div className="text-[11px] text-white/50 flex items-center gap-2">
                      <span className="font-mono">{project.category}</span>
                      <span>•</span>
                      <span className="font-mono">{project.platforms}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${
                    project.published 
                      ? 'bg-violet-500/15 text-violet-300 border border-violet-500/30' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {project.published ? 'Published' : 'Draft'}
                  </span>
                  
                  <Link
                    to={`/admin/projects/${project.id}/edit`}
                    className="px-3 py-1.5 rounded-full bg-[#16151B] hover:bg-black text-white/80 hover:text-white border border-white/10 hover:border-violet-400/50 transition-colors font-mono text-xs uppercase"
                    title="Edit project"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-[32px] bg-[#0F0E11] border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-violet-400 font-mono">&#125;</span>
              <Activity className="w-4 h-4 text-violet-400" />
              <span>Recent Activity Feed</span>
            </h3>
            <span className="text-[10px] text-white/40 font-mono uppercase">Real-Time Mock</span>
          </div>

          <div className="space-y-3">
            {activities.slice(0, 8).map((act) => {
              const typeColor = 
                act.type === 'deploy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                act.type === 'user' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                act.type === 'code' ? 'bg-sky-500/10 text-sky-400 border-sky-500/20' :
                'bg-violet-500/10 text-violet-400 border-violet-500/20';

              return (
                <div key={act.id} className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#16151B] border border-white/5 hover:border-white/10 transition-colors">
                  <img src={act.avatar} alt={act.user} className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/10 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0 text-xs">
                    <div className="text-white/80 flex items-center justify-between gap-2">
                      <span className="truncate">
                        <strong className="text-white font-semibold">{act.user}</strong> {act.action}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold border shrink-0 ${typeColor}`}>
                        {act.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-violet-300 font-mono font-medium truncate mt-1">
                      {act.target}
                    </div>
                    <div className="text-[10px] text-white/40 font-mono mt-0.5">{act.timestamp}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Studio Team & Direct Access (Owner direct remove, green active button, invite email & member login) */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-[#0F0E11] border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-violet-400 mb-1">
              <span>&#125;</span>
              <Users className="w-4 h-4 text-violet-400" />
              <span>Studio Team & Authorization Gateway</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Studio Members & Access Control
            </h3>
            <p className="text-xs text-white/50">
              {isOwner 
                ? 'Owner authority: Remove employees directly from dashboard, toggle green active status, inspect invitations, and log in directly.' 
                : 'Active collaborative team members in the studio.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/admin/users"
              className="px-4 py-2 rounded-full bg-[#16151B] hover:bg-black border border-white/10 hover:border-violet-400/50 text-white font-mono text-xs uppercase tracking-wider transition-colors"
            >
              Full Permissions Matrix →
            </Link>
          </div>
        </div>

        {/* Members List */}
        <div className="divide-y divide-white/5 overflow-x-auto">
          {users.map((member) => {
            const isCurrent = member.id === currentUser.id;
            return (
              <div key={member.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-2xl object-cover ring-2 ring-white/10 shrink-0"
                  />
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white truncate">{member.name}</span>
                      {isCurrent && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30">
                          You
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold ${
                        member.role === 'Owner'
                          ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                          : member.role === 'Developer'
                          ? 'bg-violet-500/15 text-violet-300 border border-violet-500/30'
                          : member.role === 'Editor'
                          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                          : member.role === 'Content Manager'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-violet-500/10 text-violet-200 border border-violet-500/30'
                      }`}>
                        {member.role}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-white/50 flex items-center gap-2">
                      <span>{member.email}</span>
                      {member.permissions?.customScope && (
                        <>
                          <span>•</span>
                          <span className="text-violet-300/80 truncate max-w-[200px]" title={member.permissions.customScope}>
                            ↳ {member.permissions.customScope}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto font-mono">
                  {/* Green Active Button */}
                  {member.status === 'Active' ? (
                    <button
                      type="button"
                      onClick={() => isOwner && !isCurrent && toggleUserStatus(member.id)}
                      disabled={!isOwner || isCurrent}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold transition-all shadow-sm ${
                        isOwner && !isCurrent ? 'cursor-pointer hover:opacity-90 active:scale-95' : 'cursor-default'
                      } bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-emerald-500/10`}
                      title={isOwner && !isCurrent ? 'Allowed & Active. Click to Suspend.' : 'Allowed & Active'}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
                      <span>Active</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => isOwner && toggleUserStatus(member.id)}
                      disabled={!isOwner}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold transition-all shadow-sm ${
                        isOwner ? 'cursor-pointer hover:opacity-90 active:scale-95' : 'cursor-default'
                      } bg-amber-500/15 text-amber-300 border border-amber-500/30`}
                      title={isOwner ? 'Suspended. Click to Allow and activate green Active status.' : 'Suspended'}
                    >
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>Suspended</span>
                    </button>
                  )}

                  {/* Log in as Member button */}
                  {isCurrent ? (
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      <span>You (Active)</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => loginAsUser(member.id)}
                      className="px-3.5 py-1.5 rounded-full bg-black hover:bg-[#16151B] text-white border border-white/20 hover:border-violet-400/50 text-[11px] font-mono uppercase font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                      title={`Log in to dashboard as ${member.name}`}
                    >
                      <UserCheck className="w-3.5 h-3.5 text-violet-400" />
                      <span>Log in as Member</span>
                    </button>
                  )}

                  {/* Email Invite Button */}
                  <button
                    type="button"
                    onClick={() => setDashboardInviteUser(member)}
                    className="p-1.5 rounded-full bg-[#16151B] hover:bg-black text-white/70 hover:text-violet-300 border border-white/10 hover:border-violet-400/50 transition-colors cursor-pointer"
                    title={`View email invitation & dashboard access link for ${member.name}`}
                  >
                    <Mail className="w-3.5 h-3.5 text-violet-400" />
                  </button>

                  {/* Owner Remove Employee Button directly from Dashboard */}
                  {isOwner && !isCurrent && (
                    <button
                      type="button"
                      onClick={() => setEmployeeToDelete(member)}
                      className="p-1.5 rounded-full bg-[#16151B] hover:bg-rose-500/20 text-white/60 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-colors cursor-pointer"
                      title={`Remove employee "${member.name}" directly from dashboard`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Remove Employee Confirmation Modal (Dashboard) */}
      {employeeToDelete && (
        <Modal
          isOpen={Boolean(employeeToDelete)}
          onClose={() => setEmployeeToDelete(null)}
          title="Remove Team Member"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
              <p>
                Are you sure you want to remove <strong className="text-white">{employeeToDelete.name}</strong> ({employeeToDelete.email}) from the studio team?
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEmployeeToDelete(null)}
                className="px-4 py-2 rounded-full bg-[#16151B] hover:bg-black border border-white/10 text-white/80 hover:text-white text-xs font-mono uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteUser(employeeToDelete.id);
                  setEmployeeToDelete(null);
                }}
                className="px-5 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono uppercase tracking-wider font-bold shadow-xl transition-all cursor-pointer"
              >
                Confirm Remove
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Email Invite Modal (Dashboard) */}
      <EmailInviteModal
        isOpen={Boolean(dashboardInviteUser)}
        onClose={() => setDashboardInviteUser(null)}
        user={dashboardInviteUser}
        onAcceptAndLaunch={(user) => {
          loginAsUser(user.id);
          setDashboardInviteUser(null);
        }}
      />

    </div>
  );
};
