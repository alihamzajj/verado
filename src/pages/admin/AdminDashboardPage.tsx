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
  MessageSquare,
  Mail,
  Send,
  Trash2,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';
import { ContactInquiry } from '../../types';
import { getInitialsAvatar } from '../../lib/avatar';

export const AdminDashboardPage: React.FC = () => {
  const { 
    projects, 
    users, 
    activities, 
    currentUser, 
    isAdministrativeUser,
    inquiries,
    unreadInquiriesCount,
    markInquiryAsRead,
    deleteInquiry
  } = useApp();
  const isOwner = isAdministrativeUser(currentUser);
  const [activeInquiryModal, setActiveInquiryModal] = useState<ContactInquiry | null>(null);

  const handleOpenInquiry = (inquiry: ContactInquiry) => {
    setActiveInquiryModal(inquiry);
    if (!inquiry.isRead) {
      markInquiryAsRead(inquiry.id);
    }
  };

  const totalActive = projects.filter(p => !p.isArchived).length;
  const publishedProjects = projects.filter(p => p.published && !p.isArchived).length;
  const draftsCount = projects.filter(p => !p.published && !p.isArchived).length;
  const archivedCount = projects.filter(p => p.isArchived).length;
  const totalDevelopers = users.filter(u => u.role === 'Developer' || u.role === 'Owner' || u.role === 'Admin').length;

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
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
              &#125; Studio Authority: Studio Owner
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30">
              Full Administrative Control
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

      {/* Unread Customer Inquiries Notification Banner - Stays until opened */}
      {unreadInquiriesCount > 0 && (
        <div className="p-5 rounded-[28px] bg-gradient-to-r from-violet-600/25 via-purple-600/15 to-transparent border border-violet-500/35 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-violet-600/30 text-violet-300 border border-violet-500/40 shrink-0">
              <MessageSquare className="w-5 h-5 text-violet-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase font-bold text-violet-300 tracking-wider">
                  New Customer Inquiry
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-violet-500/30 text-white shadow-sm shadow-violet-500/40">
                  {unreadInquiriesCount} New
                </span>
              </div>
              <p className="text-xs text-white/80 mt-0.5">
                You have {unreadInquiriesCount} unread message{unreadInquiriesCount > 1 ? 's' : ''} submitted through your website contact page. This notification stays until opened and reviewed.
              </p>
            </div>
          </div>
          <Link
            to="/admin/messages"
            className="px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs uppercase font-bold tracking-wider transition-colors shrink-0 shadow-lg shadow-violet-600/30 self-start sm:self-auto cursor-pointer flex items-center gap-2"
          >
            <span>Open Messages Inbox</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

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

      {/* Customer Messages & Inquiries (Appears on dashboard, shows unread notification until opened) */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-[#0F0E11] border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-violet-400 mb-1">
              <span>&#125;</span>
              <MessageSquare className="w-4 h-4 text-violet-400" />
              <span>Customer Inquiries & Messages</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2.5">
              <span>Recent Client Messages</span>
              {unreadInquiriesCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-violet-600 text-white shadow-sm shadow-violet-600/50 animate-pulse">
                  {unreadInquiriesCount} Unread
                </span>
              )}
            </h3>
            <p className="text-xs text-white/50">
              Messages submitted on the contact page. Click to open and read. Notifications stay until you open them.
            </p>
          </div>

          <Link
            to="/admin/messages"
            className="px-4 py-2 rounded-full bg-[#16151B] hover:bg-black border border-white/10 hover:border-violet-400/50 text-white font-mono text-xs uppercase tracking-wider transition-colors self-start sm:self-auto"
          >
            All Messages ({inquiries.length}) →
          </Link>
        </div>

        {inquiries.length === 0 ? (
          <div className="py-8 text-center text-white/40 text-xs font-mono">
            No incoming customer messages yet. Messages from the contact page will appear here.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {inquiries.slice(0, 4).map((inquiry) => (
              <div
                key={inquiry.id}
                onClick={() => handleOpenInquiry(inquiry)}
                className={`py-3.5 px-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors cursor-pointer hover:bg-white/5 ${
                  !inquiry.isRead ? 'bg-violet-500/[0.08]' : ''
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <img
                    src={getInitialsAvatar(inquiry.name)}
                    alt={inquiry.name}
                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                  />
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white truncate">{inquiry.name}</span>
                      {!inquiry.isRead && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30 shrink-0 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                          <span>New</span>
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-white/40 truncate">&lt;{inquiry.email}&gt;</span>
                    </div>
                    <p className="text-xs text-white/70 truncate">
                      <strong className="text-white/90">{inquiry.subject || 'Inquiry'}:</strong> {inquiry.message}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <span className="text-[11px] font-mono text-white/40">
                    {new Date(inquiry.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="text-xs text-violet-400 font-mono hover:text-violet-300 flex items-center gap-1">
                    <span>Read</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Reader Modal on Dashboard */}
      {activeInquiryModal && (
        <Modal
          isOpen={Boolean(activeInquiryModal)}
          onClose={() => setActiveInquiryModal(null)}
          title={activeInquiryModal.subject || 'Customer Message'}
          subtitle={`From ${activeInquiryModal.name} • ${new Date(activeInquiryModal.createdAt).toLocaleString()}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-5 pt-2">
            
            {/* Sender Info Card */}
            <div className="p-4 rounded-2xl bg-[#16151B] border border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={getInitialsAvatar(activeInquiryModal.name)}
                  alt={activeInquiryModal.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-violet-500/40 shrink-0"
                />
                <div>
                  <span className="text-sm font-bold text-white block">{activeInquiryModal.name}</span>
                  <a 
                    href={`mailto:${activeInquiryModal.email}`}
                    className="text-xs text-violet-400 hover:text-violet-300 font-mono transition-colors"
                  >
                    {activeInquiryModal.email}
                  </a>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-violet-500/10 text-violet-300 border border-violet-500/20">
                {activeInquiryModal.category || 'Direct Message'}
              </span>
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-white/50">
                Message Text
              </label>
              <div className="p-4 rounded-2xl bg-[#0F0E11] border border-white/10 text-xs sm:text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
                {activeInquiryModal.message}
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  deleteInquiry(activeInquiryModal.id);
                  setActiveInquiryModal(null);
                }}
                className="px-4 py-2 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveInquiryModal(null)}
                  className="px-5 py-2.5 rounded-full bg-[#16151B] hover:bg-black border border-white/10 text-white/80 hover:text-white text-xs font-mono uppercase tracking-wider cursor-pointer"
                >
                  Close
                </button>
                <a
                  href={`mailto:${activeInquiryModal.email}?subject=Re: ${encodeURIComponent(activeInquiryModal.subject || 'Your Inquiry to Verado')}`}
                  className="px-6 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs uppercase tracking-wider font-bold shadow-xl shadow-violet-600/30 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>

          </div>
        </Modal>
      )}

    </div>
  );
};
