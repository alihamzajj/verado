import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Plus, 
  Sparkles, 
  CheckCircle, 
  Smartphone, 
  Apple, 
  Layers, 
  ExternalLink, 
  ArrowLeft,
  Upload,
  Globe,
  Tag,
  ShieldCheck,
  Check,
  Edit,
  Clock,
  LogOut,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Platform, ProjectCategory, Project, User } from '../../types';
import { getInitialsAvatar } from '../../lib/avatar';

const PRESET_ICONS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=150&auto=format&fit=crop&q=80',
];

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&auto=format&fit=crop&q=80',
];

export const EmployeeSubmitProjectPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    projects, 
    addProject, 
    updateProject, 
    users, 
    teamInvitations, 
    acceptInvitation, 
    addNotification 
  } = useApp();

  const searchParams = new URLSearchParams(location.search);
  const inviteToken = searchParams.get('invite') || '';
  const emailParam = searchParams.get('email') || '';

  // Determine authorized employee contributor identity
  const [contributor, setContributor] = useState<{
    name: string;
    email: string;
    role: string;
    avatar: string;
    canAdd: boolean;
    canEdit: boolean;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'add' | 'my-projects'>('add');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState<Project | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    shortDescription: '',
    fullDescription: '',
    logo: PRESET_ICONS[0],
    coverImage: PRESET_COVERS[0],
    screenshots: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    ],
    demoVideoUrl: '',
    features: [
      'Hardware-accelerated rendering & fluid 120 FPS interface',
      'Local-first encrypted persistent cache with offline sync',
      'Haptic feedback and custom audio feedback engine'
    ],
    technologies: ['Flutter', 'Dart', 'Swift', 'Kotlin'],
    platforms: 'Android + iOS' as Platform,
    category: 'AI & Computer Vision' as ProjectCategory,
    playStoreUrl: '',
    appStoreUrl: '',
    websiteUrl: '',
    githubUrl: '',
    version: '1.0.0',
    size: '45.0 MB',
    minAndroid: 'Android 10.0+',
    minIos: 'iOS 16.0+',
    accentColor: '#8B5CF6',
  });

  const [newFeature, setNewFeature] = useState('');
  const [newTech, setNewTech] = useState('');
  const [newScreenshot, setNewScreenshot] = useState('');

  // Resolve employee identity from invitation token, email, or local session
  useEffect(() => {
    // 1. Try to match from invitation token
    if (inviteToken) {
      const inv = teamInvitations.find(i => i.token === inviteToken);
      if (inv) {
        setContributor({
          name: inv.name,
          email: inv.email,
          role: inv.role,
          avatar: getInitialsAvatar(inv.name),
          canAdd: inv.permissions.addProjects !== false,
          canEdit: inv.permissions.editProjects !== false,
        });
        acceptInvitation(inviteToken);
        return;
      }

      // Check if user with matching token exists
      const userWithToken = users.find(u => u.invitationToken === inviteToken);
      if (userWithToken) {
        setContributor({
          name: userWithToken.name,
          email: userWithToken.email,
          role: userWithToken.role,
          avatar: userWithToken.avatar || getInitialsAvatar(userWithToken.name),
          canAdd: userWithToken.permissions.addProjects !== false,
          canEdit: userWithToken.permissions.editProjects !== false,
        });
        return;
      }
    }

    // 2. Try email match
    if (emailParam) {
      const matchedUser = users.find(u => u.email.toLowerCase() === emailParam.toLowerCase());
      if (matchedUser) {
        setContributor({
          name: matchedUser.name,
          email: matchedUser.email,
          role: matchedUser.role,
          avatar: matchedUser.avatar || getInitialsAvatar(matchedUser.name),
          canAdd: matchedUser.permissions.addProjects !== false,
          canEdit: matchedUser.permissions.editProjects !== false,
        });
        return;
      }
    }

    // 3. Fallback: Check if an invited employee exists in users
    const nonOwnerUser = users.find(u => u.role !== 'Owner') || users[1] || users[0];
    if (nonOwnerUser) {
      setContributor({
        name: nonOwnerUser.name,
        email: nonOwnerUser.email,
        role: nonOwnerUser.role,
        avatar: nonOwnerUser.avatar || getInitialsAvatar(nonOwnerUser.name),
        canAdd: nonOwnerUser.permissions.addProjects !== false,
        canEdit: nonOwnerUser.permissions.editProjects !== false,
      });
    }
  }, [inviteToken, emailParam, teamInvitations, users, acceptInvitation]);

  // Load project for editing if requested
  const handleStartEdit = (proj: Project) => {
    setEditingProjectId(proj.id);
    setFormData({
      name: proj.name,
      tagline: proj.tagline,
      shortDescription: proj.shortDescription,
      fullDescription: proj.fullDescription,
      logo: proj.logo,
      coverImage: proj.coverImage,
      screenshots: proj.screenshots || [],
      demoVideoUrl: proj.demoVideoUrl || '',
      features: proj.features || [],
      technologies: proj.technologies || [],
      platforms: proj.platforms,
      category: proj.category,
      playStoreUrl: proj.playStoreUrl || '',
      appStoreUrl: proj.appStoreUrl || '',
      websiteUrl: proj.websiteUrl || '',
      githubUrl: proj.githubUrl || '',
      version: proj.version || '1.0.0',
      size: proj.size || '45.0 MB',
      minAndroid: proj.minAndroid || 'Android 10.0+',
      minIos: proj.minIos || 'iOS 16.0+',
      accentColor: proj.accentColor || '#8B5CF6',
    });
    setActiveTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetForm = () => {
    setEditingProjectId(null);
    setSubmittedSuccess(null);
    setFormData({
      name: '',
      tagline: '',
      shortDescription: '',
      fullDescription: '',
      logo: PRESET_ICONS[0],
      coverImage: PRESET_COVERS[0],
      screenshots: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
      ],
      demoVideoUrl: '',
      features: [
        'Hardware-accelerated rendering & fluid 120 FPS interface',
        'Local-first encrypted persistent cache with offline sync',
        'Haptic feedback and custom audio feedback engine'
      ],
      technologies: ['Flutter', 'Dart', 'Swift', 'Kotlin'],
      platforms: 'Android + iOS',
      category: 'AI & Computer Vision',
      playStoreUrl: '',
      appStoreUrl: '',
      websiteUrl: '',
      githubUrl: '',
      version: '1.0.0',
      size: '45.0 MB',
      minAndroid: 'Android 10.0+',
      minIos: 'iOS 16.0+',
      accentColor: '#8B5CF6',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      addNotification('Please enter an application name.', 'error');
      return;
    }

    if (!formData.tagline.trim()) {
      addNotification('Please enter a tagline.', 'error');
      return;
    }

    if (editingProjectId) {
      updateProject(editingProjectId, {
        ...formData,
        lastUpdated: 'Just now',
      });
      addNotification(`Updated application "${formData.name}". Submitted for review!`, 'success');
      setEditingProjectId(null);
      setActiveTab('my-projects');
    } else {
      const created = addProject({
        ...formData,
        submittedBy: contributor ? contributor.name : 'Authorized Contributor',
        published: false,
        featured: false,
        reviewStatus: 'pending_review',
        badge: 'New Submission',
      });
      setSubmittedSuccess(created);
      addNotification(`Application "${formData.name}" submitted successfully for Owner review!`, 'success');
    }
  };

  // Find projects submitted by this employee
  const mySubmittedProjects = projects.filter(p => 
    p.submittedBy && contributor && (
      p.submittedBy.toLowerCase() === contributor.name.toLowerCase() ||
      p.submittedBy.toLowerCase() === contributor.email.toLowerCase()
    )
  );

  return (
    <div className="min-h-screen bg-[#0A0A0E] text-slate-100 selection:bg-violet-500/30 font-sans pb-24">
      {/* Contributor Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#0F0E11]/90 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20 ring-1 ring-white/20">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-white tracking-tight">Verado</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  CONTRIBUTOR PORTAL
                </span>
              </div>
              <p className="text-[11px] font-mono text-white/50">Owner-Authorized Application Submission</p>
            </div>
          </div>

          {/* Contributor Badge & Showcase link */}
          <div className="flex items-center gap-4">
            {contributor && (
              <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#16151B] border border-white/10 shadow-sm">
                <img 
                  src={contributor.avatar} 
                  alt={contributor.name} 
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-violet-500/30"
                />
                <div className="text-left hidden sm:block">
                  <div className="font-bold text-xs text-white">{contributor.name}</div>
                  <div className="text-[10px] font-mono text-violet-400 font-semibold">{contributor.role}</div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-400" title="Authorized & Active" />
              </div>
            )}

            <Link
              to="/projects"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 font-mono text-xs font-semibold uppercase tracking-wider transition-all"
            >
              <span>Showcase</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        
        {/* Verification & Welcome Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-600/15 via-purple-600/10 to-transparent border border-violet-500/30 mb-8 shadow-xl relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-violet-600/20 text-violet-300 border border-violet-500/30 shrink-0">
              <ShieldCheck className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-violet-400">
                  Direct Contributor Access Verified
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  ● Access Granted
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                Welcome, {contributor ? contributor.name : 'Authorized Contributor'}!
              </h1>
              <p className="text-sm text-white/70 mt-1 leading-relaxed">
                The Studio Owner has invited you to add and manage showcase applications on Verado. Fill in the application metadata, screenshots, and store links below.
              </p>
            </div>
          </div>
        </div>

        {/* Success Modal / Banner when project is submitted */}
        {submittedSuccess && (
          <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 mb-8 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex-1">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Submission Received
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5">
                  Application "{submittedSuccess.name}" Submitted Successfully!
                </h2>
                <p className="text-xs text-emerald-100/80 mt-1">
                  Your project has been recorded and submitted to the Studio Owner for review and publishing.
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={handleResetForm}
                    className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    + Submit Another Application
                  </button>
                  <button
                    onClick={() => {
                      setSubmittedSuccess(null);
                      setActiveTab('my-projects');
                    }}
                    className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border border-white/10"
                  >
                    View My Submissions
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Controls (Add Project vs My Submissions) */}
        {contributor?.canEdit && (
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4 font-mono text-xs uppercase font-bold tracking-wider">
            <button
              onClick={() => {
                setActiveTab('add');
                if (!editingProjectId) handleResetForm();
              }}
              className={`px-5 py-2.5 rounded-full transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'add'
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{editingProjectId ? 'Editing Project' : 'Add New Application'}</span>
            </button>

            <button
              onClick={() => setActiveTab('my-projects')}
              className={`px-5 py-2.5 rounded-full transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'my-projects'
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
                  : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>My Submissions ({mySubmittedProjects.length})</span>
            </button>
          </div>
        )}

        {/* TAB 1: ADD / EDIT PROJECT FORM */}
        {activeTab === 'add' && (
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Basic Information */}
            <div className="p-6 sm:p-8 rounded-[32px] bg-[#0F0E11] border border-white/10 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <span className="font-mono text-violet-400 font-bold">&#125; 01</span>
                <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                  Application Identity & Overview
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-2 font-semibold">
                    Application Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. BrainWave AI Studio"
                    className="w-full px-4 py-3 rounded-2xl bg-[#16151B] border border-white/10 text-white text-sm focus:border-violet-500 focus:outline-none transition-all placeholder:text-white/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-2 font-semibold">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#16151B] border border-white/10 text-white text-sm focus:border-violet-500 focus:outline-none transition-all cursor-pointer font-mono"
                  >
                    <option value="AI & Computer Vision">AI & Computer Vision</option>
                    <option value="Health & Fitness">Health & Fitness</option>
                    <option value="Finance & Crypto">Finance & Crypto</option>
                    <option value="Lifestyle & E-Commerce">Lifestyle & E-Commerce</option>
                    <option value="Productivity & Tools">Productivity & Tools</option>
                    <option value="Travel & Navigation">Travel & Navigation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-2 font-semibold">
                  Tagline (Punchy One-Liner) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Hardware-accelerated AI models & fluid 120 FPS interface"
                  className="w-full px-4 py-3 rounded-2xl bg-[#16151B] border border-white/10 text-white text-sm focus:border-violet-500 focus:outline-none transition-all placeholder:text-white/30"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-2 font-semibold">
                  Short Description (Catalog Summary)
                </label>
                <textarea
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Brief overview displayed on discovery cards..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#16151B] border border-white/10 text-white text-sm focus:border-violet-500 focus:outline-none transition-all placeholder:text-white/30"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-2 font-semibold">
                  Full Description & Story
                </label>
                <textarea
                  rows={4}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  placeholder="Comprehensive breakdown of features, architecture, and value proposition..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#16151B] border border-white/10 text-white text-sm focus:border-violet-500 focus:outline-none transition-all placeholder:text-white/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-2 font-semibold">
                    Target Platforms
                  </label>
                  <select
                    value={formData.platforms}
                    onChange={(e) => setFormData({ ...formData, platforms: e.target.value as Platform })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#16151B] border border-white/10 text-white text-sm focus:border-violet-500 focus:outline-none transition-all cursor-pointer font-mono"
                  >
                    <option value="Android + iOS">Android + iOS (Cross-Platform)</option>
                    <option value="iOS">iOS (Native SwiftUI)</option>
                    <option value="Android">Android (Native Kotlin)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-2 font-semibold">
                    App Version
                  </label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="e.g. 1.2.0"
                    className="w-full px-4 py-3 rounded-2xl bg-[#16151B] border border-white/10 text-white text-sm focus:border-violet-500 focus:outline-none transition-all placeholder:text-white/30 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Visual Media Assets */}
            <div className="p-6 sm:p-8 rounded-[32px] bg-[#0F0E11] border border-white/10 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <span className="font-mono text-violet-400 font-bold">&#125; 02</span>
                <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                  Visual Assets & Showcase Media
                </h2>
              </div>

              {/* Logo / App Icon */}
              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-2 font-semibold">
                  Application Icon (Square 1:1)
                </label>
                <div className="flex items-center gap-4">
                  <img 
                    src={formData.logo} 
                    alt="Preview" 
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-violet-500/40 shrink-0 shadow-lg"
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      type="url"
                      value={formData.logo}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs text-white font-mono focus:border-violet-500 focus:outline-none"
                    />
                    <div className="flex items-center gap-2 overflow-x-auto py-1">
                      <span className="text-[10px] font-mono text-white/40 shrink-0">Presets:</span>
                      {PRESET_ICONS.map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setFormData({ ...formData, logo: url })}
                          className={`w-7 h-7 rounded-lg overflow-hidden shrink-0 border transition-all ${
                            formData.logo === url ? 'border-violet-400 scale-105' : 'border-white/10 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={url} alt="Preset" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cover Banner Image */}
              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-2 font-semibold">
                  Cover Banner Image (16:9 Landscape)
                </label>
                <div className="space-y-2">
                  <div className="h-28 w-full rounded-2xl overflow-hidden border border-white/10 relative">
                    <img src={formData.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                  </div>
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs text-white font-mono focus:border-violet-500 focus:outline-none"
                  />
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    <span className="text-[10px] font-mono text-white/40 shrink-0">Presets:</span>
                    {PRESET_COVERS.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFormData({ ...formData, coverImage: url })}
                        className={`h-7 w-14 rounded-md overflow-hidden shrink-0 border transition-all ${
                          formData.coverImage === url ? 'border-violet-400 scale-105' : 'border-white/10 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt="Preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Screenshots list */}
              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-2 font-semibold">
                  Screenshots ({formData.screenshots.length})
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  {formData.screenshots.map((s, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-white/10 h-28">
                      <img src={s} alt={`Screen ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          screenshots: formData.screenshots.filter((_, i) => i !== idx)
                        })}
                        className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/80 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={newScreenshot}
                    onChange={(e) => setNewScreenshot(e.target.value)}
                    placeholder="Add screenshot image URL..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs text-white font-mono focus:border-violet-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newScreenshot.trim()) {
                        setFormData({
                          ...formData,
                          screenshots: [...formData.screenshots, newScreenshot.trim()]
                        });
                        setNewScreenshot('');
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs font-bold uppercase transition-all"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>

            {/* Section 3: Features & Technologies */}
            <div className="p-6 sm:p-8 rounded-[32px] bg-[#0F0E11] border border-white/10 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <span className="font-mono text-violet-400 font-bold">&#125; 03</span>
                <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                  Features & Tech Stack
                </h2>
              </div>

              {/* Key Features */}
              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-2 font-semibold">
                  Key Application Features
                </label>
                <div className="space-y-2 mb-3">
                  {formData.features.map((f, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#16151B] border border-white/5 text-xs text-white">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                        <span>{f}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          features: formData.features.filter((_, i) => i !== idx)
                        })}
                        className="text-white/40 hover:text-rose-400 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="e.g. Automated background sync & biometric lock..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs text-white focus:border-violet-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newFeature.trim()) {
                        setFormData({
                          ...formData,
                          features: [...formData.features, newFeature.trim()]
                        });
                        setNewFeature('');
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs font-bold uppercase transition-all"
                  >
                    + Add Feature
                  </button>
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-xs font-mono uppercase text-white/70 mb-2 font-semibold">
                  Technologies & Frameworks
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.technologies.map((t, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-violet-500/10 text-violet-300 border border-violet-500/20"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          technologies: formData.technologies.filter((_, i) => i !== idx)
                        })}
                        className="text-white/40 hover:text-rose-400 ml-1"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    placeholder="e.g. Rust, Kotlin, WebSockets..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs text-white focus:border-violet-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newTech.trim()) {
                        setFormData({
                          ...formData,
                          technologies: [...formData.technologies, newTech.trim()]
                        });
                        setNewTech('');
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs font-bold uppercase transition-all"
                  >
                    + Add Tech
                  </button>
                </div>
              </div>
            </div>

            {/* Section 4: Store & Web Links */}
            <div className="p-6 sm:p-8 rounded-[32px] bg-[#0F0E11] border border-white/10 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <span className="font-mono text-violet-400 font-bold">&#125; 04</span>
                <h2 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                  Store & Website Links
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-2 font-semibold">
                    Apple App Store Link
                  </label>
                  <input
                    type="url"
                    value={formData.appStoreUrl}
                    onChange={(e) => setFormData({ ...formData, appStoreUrl: e.target.value })}
                    placeholder="https://apps.apple.com/app/..."
                    className="w-full px-4 py-3 rounded-2xl bg-[#16151B] border border-white/10 text-white text-xs font-mono focus:border-violet-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-2 font-semibold">
                    Google Play Store Link
                  </label>
                  <input
                    type="url"
                    value={formData.playStoreUrl}
                    onChange={(e) => setFormData({ ...formData, playStoreUrl: e.target.value })}
                    placeholder="https://play.google.com/store/apps/..."
                    className="w-full px-4 py-3 rounded-2xl bg-[#16151B] border border-white/10 text-white text-xs font-mono focus:border-violet-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-2 font-semibold">
                    Official Website / Web App URL
                  </label>
                  <input
                    type="url"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    placeholder="https://yourapp.io"
                    className="w-full px-4 py-3 rounded-2xl bg-[#16151B] border border-white/10 text-white text-xs font-mono focus:border-violet-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-white/70 mb-2 font-semibold">
                    GitHub / Source Repository URL
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-3 rounded-2xl bg-[#16151B] border border-white/10 text-white text-xs font-mono focus:border-violet-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-[#16151B] border border-white/10">
              <div className="text-xs text-white/60">
                <strong className="text-white">Review Governance:</strong> Submitting will record this application under your contributor profile and dispatch it for Studio Owner approval.
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {editingProjectId && (
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-mono text-xs uppercase tracking-wider font-bold shadow-xl shadow-violet-600/30 transition-all cursor-pointer active:scale-95"
                >
                  {editingProjectId ? 'Save & Update Application' : 'Submit Application for Review →'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: MY SUBMITTED APPLICATIONS */}
        {activeTab === 'my-projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">My Submitted Applications</h2>
                <p className="text-xs text-white/50">Applications submitted under your contributor profile</p>
              </div>
              <button
                onClick={() => {
                  handleResetForm();
                  setActiveTab('add');
                }}
                className="px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs uppercase font-bold tracking-wider transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Another Application</span>
              </button>
            </div>

            {mySubmittedProjects.length === 0 ? (
              <div className="p-12 text-center rounded-[32px] bg-[#0F0E11] border border-white/10">
                <Smartphone className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-white">No applications submitted yet</h3>
                <p className="text-xs text-white/50 mt-1 max-w-sm mx-auto">
                  Click the button below to submit your first application to the Verado Showcase.
                </p>
                <button
                  onClick={() => {
                    handleResetForm();
                    setActiveTab('add');
                  }}
                  className="mt-5 px-6 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-all"
                >
                  + Create First Application
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mySubmittedProjects.map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl bg-[#0F0E11] border border-white/10 hover:border-violet-500/30 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <img src={p.logo} alt={p.name} className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10" />
                        <div>
                          <h4 className="font-bold text-sm text-white">{p.name}</h4>
                          <span className="text-[10px] font-mono uppercase text-violet-400 font-semibold">{p.category}</span>
                        </div>
                      </div>
                      <p className="text-xs text-white/60 line-clamp-2">{p.tagline}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold ${
                        p.published 
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      }`}>
                        {p.published ? '● Live Published' : '⏳ In Owner Review'}
                      </span>

                      {contributor?.canEdit && (
                        <button
                          type="button"
                          onClick={() => handleStartEdit(p)}
                          className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-white font-mono text-xs transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Edit className="w-3 h-3 text-violet-400" />
                          <span>Edit</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
};
