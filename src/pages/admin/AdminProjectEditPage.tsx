import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Trash2,
  Upload,
  Video,
  Image as ImageIcon,
  Loader2,
  Cloud,
  CheckCircle2,
  Film,
  Lock,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { uploadMediaToSupabase } from '../../lib/supabase';
import type { Project, Platform, ProjectCategory } from '../../types';
import { AppCard } from '../../components/common/AppCard';

export const AdminProjectEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { projects, addProject, updateProject, addNotification, isSupabaseLive, currentUser, isAdministrativeUser } = useApp();
  const isOwner = isAdministrativeUser(currentUser);
  const canAdd = isOwner || currentUser.permissions.addProjects !== false;
  const canEdit = isOwner || currentUser.permissions.editProjects !== false;
  const canUpload = isOwner || currentUser.permissions.uploadMedia !== false;
  const canPublish = isOwner || Boolean(currentUser.permissions.publishProjects || currentUser.permissions.deployProduction);

  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const screenshotInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const existingProject = isEditing ? projects.find(p => p.id === id) : null;

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    shortDescription: '',
    fullDescription: '',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80'
    ],
    demoVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-40344-large.mp4',
    features: [
      'High-throughput real-time edge processing',
      'Local-first encrypted persistent cache',
      'Haptic feedback integration'
    ],
    technologies: ['Flutter', 'Dart', 'TensorFlow Lite', 'Swift'],
    platforms: 'Android + iOS' as Platform,
    category: 'AI & Computer Vision' as ProjectCategory,
    featured: false,
    published: true,
    playStoreUrl: 'https://play.google.com/store/apps',
    appStoreUrl: 'https://apps.apple.com/app',
    websiteUrl: 'https://example.com',
    githubUrl: '',
    version: '1.0.0',
    size: '42.5 MB',
    minAndroid: 'Android 10.0+',
    minIos: 'iOS 16.0+',
    accentColor: '#38bdf8',
  });

  const [newFeature, setNewFeature] = useState('');
  const [newTech, setNewTech] = useState('');
  const [newScreenshotUrl, setNewScreenshotUrl] = useState('');

  useEffect(() => {
    if (existingProject) {
      setFormData({
        name: existingProject.name,
        tagline: existingProject.tagline,
        shortDescription: existingProject.shortDescription,
        fullDescription: existingProject.fullDescription,
        logo: existingProject.logo,
        coverImage: existingProject.coverImage,
        screenshots: existingProject.screenshots,
        demoVideoUrl: existingProject.demoVideoUrl,
        features: existingProject.features,
        technologies: existingProject.technologies,
        platforms: existingProject.platforms,
        category: existingProject.category,
        featured: existingProject.featured,
        published: existingProject.published,
        playStoreUrl: existingProject.playStoreUrl,
        appStoreUrl: existingProject.appStoreUrl,
        websiteUrl: existingProject.websiteUrl,
        githubUrl: existingProject.githubUrl || '',
        version: existingProject.version,
        size: existingProject.size,
        minAndroid: existingProject.minAndroid,
        minIos: existingProject.minIos,
        accentColor: existingProject.accentColor,
      });
    }
  }, [existingProject]);

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({ ...prev, features: [...prev.features, newFeature.trim()] }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }));
  };

  const handleAddTech = () => {
    if (newTech.trim() && !formData.technologies.includes(newTech.trim())) {
      setFormData(prev => ({ ...prev, technologies: [...prev.technologies, newTech.trim()] }));
      setNewTech('');
    }
  };

  const handleRemoveTech = (tech: string) => {
    setFormData(prev => ({ ...prev, technologies: prev.technologies.filter(t => t !== tech) }));
  };

  const handleAddScreenshot = () => {
    if (newScreenshotUrl.trim()) {
      setFormData(prev => ({ ...prev, screenshots: [...prev.screenshots, newScreenshotUrl.trim()] }));
      setNewScreenshotUrl('');
    }
  };

  const handleRemoveScreenshot = (idx: number) => {
    setFormData(prev => ({ ...prev, screenshots: prev.screenshots.filter((_, i) => i !== idx) }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'logo' | 'coverImage' | 'screenshot' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!canUpload) {
      addNotification('Access Denied: You do not have permission to upload media assets.', 'error');
      e.target.value = '';
      return;
    }

    setUploadingField(target);
    try {
      let fileUrl: string | null = null;
      if (isSupabaseLive) {
        fileUrl = await uploadMediaToSupabase(file);
      }

      // If Supabase upload returned null or not configured, fallback to Data URL for instant preview
      if (!fileUrl) {
        const reader = new FileReader();
        fileUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      if (fileUrl) {
        if (target === 'logo') {
          setFormData(prev => ({ ...prev, logo: fileUrl! }));
          addNotification('App logo updated!', 'success');
        } else if (target === 'coverImage') {
          setFormData(prev => ({ ...prev, coverImage: fileUrl! }));
          addNotification('Cover image updated!', 'success');
        } else if (target === 'screenshot') {
          setFormData(prev => ({ ...prev, screenshots: [...prev.screenshots, fileUrl!] }));
          addNotification('Screenshot added!', 'success');
        } else if (target === 'video') {
          setFormData(prev => ({ ...prev, demoVideoUrl: fileUrl! }));
          addNotification('Demo video asset linked!', 'success');
        }
      }
    } catch {
      addNotification('Could not process uploaded file.', 'error');
    } finally {
      setUploadingField(null);
      e.target.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addNotification('App name is required', 'error');
      return;
    }

    if (isEditing && !canEdit) {
      addNotification('Access Denied: You do not have permission to edit projects.', 'error');
      return;
    }

    if (!isEditing && !canAdd) {
      addNotification('Access Denied: You do not have permission to create projects.', 'error');
      return;
    }

    const payload = {
      ...formData,
      published: canPublish ? formData.published : false,
    };

    if (isEditing && id) {
      updateProject(id, payload);
      navigate('/admin/projects');
    } else {
      addProject(payload);
      navigate('/admin/projects');
    }
  };

  // Preview mock project
  const previewProject: Project = {
    id: id || 'preview-id',
    name: formData.name || 'Untitled Application',
    tagline: formData.tagline || 'Modern mobile experience',
    shortDescription: formData.shortDescription || 'Short description of this application...',
    fullDescription: formData.fullDescription || 'Full detailed description...',
    logo: formData.logo,
    coverImage: formData.coverImage,
    screenshots: formData.screenshots,
    demoVideoUrl: formData.demoVideoUrl,
    features: formData.features,
    technologies: formData.technologies,
    platforms: formData.platforms,
    category: formData.category,
    featured: formData.featured,
    published: formData.published,
    playStoreUrl: formData.playStoreUrl,
    appStoreUrl: formData.appStoreUrl,
    websiteUrl: formData.websiteUrl,
    githubUrl: formData.githubUrl,
    rating: 5.0,
    reviewsCount: 1,
    downloads: '100+',
    version: formData.version,
    size: formData.size,
    minAndroid: formData.minAndroid,
    minIos: formData.minIos,
    lastUpdated: 'Just now',
    accentColor: formData.accentColor,
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/projects"
            className="p-2.5 rounded-full bg-[#0F0E11] border border-white/10 text-white/60 hover:text-white hover:border-violet-400/50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-violet-400 mb-1">
              <span>&#125;</span>
              <span>Catalog Editor</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isEditing ? `Edit: ${formData.name || 'Project'}` : 'Create New Project'}
            </h1>
            <p className="text-xs sm:text-sm text-white/60">
              {isEditing ? 'Modify app metadata, screenshots, and release URLs' : 'Add an application to the studio portfolio'}
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black hover:bg-[#16151B] text-white border border-white/20 hover:border-violet-400/50 font-mono text-xs uppercase tracking-wider font-semibold shadow-xl transition-all cursor-pointer"
        >
          <Save className="w-4 h-4 text-violet-400" />
          <span>{isOwner ? (isEditing ? 'Save Changes' : 'Create Application') : (isEditing ? 'Submit Updates' : 'Submit for Review')}</span>
        </button>
      </div>

      {/* Non-Publishing Draft Mode Alert Banner */}
      {!canPublish && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-amber-200">
              <strong className="text-white">Draft & Review Mode:</strong> As a {currentUser.role}, this application will be saved as Draft and submitted for Studio Owner review before going live.
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase font-bold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full whitespace-nowrap border border-amber-500/30">
            Owner Approval Required
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form Column */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          
          {/* Basic Identity */}
          <div className="p-6 sm:p-8 rounded-[32px] bg-[#0F0E11] border border-white/10 space-y-5">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-2">
              <span>&#125;</span>
              <span>1. Basic Identity</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">App Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. ShoeCheck AI"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-400 transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Instant Sneaker Legit-Check"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-400 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-violet-400 transition-colors cursor-pointer"
                >
                  <option className="bg-[#0F0E11]">AI & Computer Vision</option>
                  <option className="bg-[#0F0E11]">Health & Fitness</option>
                  <option className="bg-[#0F0E11]">Finance & Crypto</option>
                  <option className="bg-[#0F0E11]">Productivity & Tools</option>
                  <option className="bg-[#0F0E11]">Travel & Navigation</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">Target Platform</label>
                <select
                  value={formData.platforms}
                  onChange={(e) => setFormData({ ...formData, platforms: e.target.value as Platform })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-violet-400 transition-colors cursor-pointer"
                >
                  <option className="bg-[#0F0E11]">Android + iOS</option>
                  <option className="bg-[#0F0E11]">iOS</option>
                  <option className="bg-[#0F0E11]">Android</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">Short Description</label>
              <textarea
                rows={2}
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="High-level 1-2 sentence elevator pitch..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-400 transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">Full Description</label>
              <textarea
                rows={4}
                value={formData.fullDescription}
                onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                placeholder="Comprehensive technical overview and architectural advantages..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-400 transition-colors resize-none"
              />
            </div>

            {/* Toggles */}
            <div className="pt-2 flex flex-wrap items-center gap-6">
              {canPublish ? (
                <>
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs font-mono uppercase tracking-wider text-white/80">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="w-4 h-4 rounded text-violet-500 focus:ring-violet-400 bg-[#16151B] border-white/20"
                    />
                    <span>Published (Visible on Public Showcase)</span>
                  </label>

                  {isOwner && (
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs font-mono uppercase tracking-wider text-white/80">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-4 h-4 rounded text-violet-500 focus:ring-violet-400 bg-[#16151B] border-white/20"
                      />
                      <span>Featured Showcase on Homepage</span>
                    </label>
                  )}
                </>
              ) : (
                <div className="p-3.5 rounded-xl bg-[#16151B] border border-white/10 flex items-center gap-3 text-xs w-full">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-white/70">
                    <strong className="text-white">Publication Status:</strong> Submissions are drafted as <span className="text-amber-300 font-mono font-bold">Draft</span>. The Studio Owner has exclusive authority to review and approve projects for live publication.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Media & Assets */}
          <div className="p-6 sm:p-8 rounded-[32px] bg-[#0F0E11] border border-white/10 space-y-5">
            {/* Hidden file inputs */}
            <input
              type="file"
              ref={logoInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'logo')}
            />
            <input
              type="file"
              ref={coverInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'coverImage')}
            />
            <input
              type="file"
              ref={screenshotInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'screenshot')}
            />
            <input
              type="file"
              ref={videoInputRef}
              accept="video/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'video')}
            />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-2">
                <span>&#125;</span>
                <span>2. Media & Visual Assets</span>
              </h3>
              {isSupabaseLive ? (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 font-mono text-[11px] font-medium w-fit">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                  <span>Supabase Cloud Storage Active</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-[11px] font-medium w-fit">
                  <Cloud className="w-3.5 h-3.5" />
                  <span>Offline / Local Storage Preview Mode</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">App Logo (Icon)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    placeholder="Image URL or upload..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs text-white focus:outline-none focus:border-violet-400 transition-colors"
                  />
                  <img src={formData.logo} alt="Logo" className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10 shrink-0" />
                </div>
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={uploadingField === 'logo'}
                  className="w-full py-2 px-3 rounded-full bg-[#16151B] hover:bg-black border border-white/10 hover:border-violet-400/50 font-mono text-[11px] uppercase tracking-wider text-white/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {uploadingField === 'logo' ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin text-violet-400" />
                      <span>Uploading Logo...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3 h-3 text-violet-400" />
                      <span>Upload Logo File</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">Cover Image / Banner</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="Image URL or upload..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs text-white focus:outline-none focus:border-violet-400 transition-colors"
                  />
                  <img src={formData.coverImage} alt="Cover" className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10 shrink-0" />
                </div>
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={uploadingField === 'coverImage'}
                  className="w-full py-2 px-3 rounded-full bg-[#16151B] hover:bg-black border border-white/10 hover:border-violet-400/50 font-mono text-[11px] uppercase tracking-wider text-white/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {uploadingField === 'coverImage' ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin text-violet-400" />
                      <span>Uploading Cover...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3 h-3 text-violet-400" />
                      <span>Upload Cover File</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Screenshots list */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">Screenshots Gallery ({formData.screenshots.length})</label>
              <div className="flex flex-wrap gap-2.5 mb-3">
                {formData.screenshots.map((shot, idx) => (
                  <div key={idx} className="relative group w-20 h-14 rounded-xl overflow-hidden border border-white/10 bg-[#16151B]">
                    <img src={shot} alt="Screenshot" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveScreenshot(idx)}
                      className="absolute inset-0 bg-rose-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newScreenshotUrl}
                  onChange={(e) => setNewScreenshotUrl(e.target.value)}
                  placeholder="Paste image URL..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs text-white focus:outline-none focus:border-violet-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={handleAddScreenshot}
                  className="px-5 py-2.5 rounded-full bg-[#16151B] hover:bg-black border border-white/10 hover:border-violet-400/50 text-white font-mono text-xs uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
                >
                  Add URL
                </button>
                <button
                  type="button"
                  onClick={() => screenshotInputRef.current?.click()}
                  disabled={uploadingField === 'screenshot'}
                  className="px-5 py-2.5 rounded-full bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/30 text-violet-300 font-mono text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                >
                  {uploadingField === 'screenshot' ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload File</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-mono text-xs uppercase tracking-wider text-white/70">App Demo Video</label>
                <span className="font-mono text-[10px] text-white/40">Supports MP4, WebM, YouTube, Vimeo or CDN link</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={formData.demoVideoUrl}
                  onChange={(e) => setFormData({ ...formData, demoVideoUrl: e.target.value })}
                  placeholder="https://... or upload MP4 / WebM"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs text-white focus:outline-none focus:border-violet-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  disabled={uploadingField === 'video'}
                  className="px-5 py-2.5 rounded-full bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 font-mono text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                >
                  {uploadingField === 'video' ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Film className="w-3.5 h-3.5" />
                      <span>Upload Video File</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Features and Technologies */}
          <div className="p-6 sm:p-8 rounded-[32px] bg-[#0F0E11] border border-white/10 space-y-5">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-2">
              <span>&#125;</span>
              <span>3. Features & Technologies Stack</span>
            </h3>

            {/* Features Editor */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">Key Features</label>
              <div className="space-y-2 mb-3">
                {formData.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#16151B] border border-white/5 text-xs text-white">
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-white/40 hover:text-rose-400 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="e.g. Sub-50ms Neural Core inference"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs text-white focus:outline-none focus:border-violet-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-5 py-2.5 rounded-full bg-[#16151B] hover:bg-black border border-white/10 hover:border-violet-400/50 text-white font-mono text-xs uppercase tracking-wider cursor-pointer"
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Tech Chips Editor */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">Technologies</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.technologies.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-violet-500/10 border border-violet-500/20 text-violet-300">
                    {t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(t)}
                      className="hover:text-rose-400 cursor-pointer ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  placeholder="e.g. Kotlin Multiplatform, SwiftUI"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs text-white focus:outline-none focus:border-violet-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="px-5 py-2.5 rounded-full bg-[#16151B] hover:bg-black border border-white/10 hover:border-violet-400/50 text-white font-mono text-xs uppercase tracking-wider cursor-pointer"
                >
                  + Add Tag
                </button>
              </div>
            </div>
          </div>

          {/* Links & Specifications */}
          <div className="p-6 sm:p-8 rounded-[32px] bg-[#0F0E11] border border-white/10 space-y-5">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-2">
              <span>&#125;</span>
              <span>4. Distribution Links & Specifications</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">Google Play Store URL</label>
                <input
                  type="text"
                  value={formData.playStoreUrl}
                  onChange={(e) => setFormData({ ...formData, playStoreUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs text-white focus:outline-none focus:border-violet-400 transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">iOS App Store URL</label>
                <input
                  type="text"
                  value={formData.appStoreUrl}
                  onChange={(e) => setFormData({ ...formData, appStoreUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs text-white focus:outline-none focus:border-violet-400 transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-mono text-xs uppercase tracking-wider text-white/70 mb-2">Product Website URL</label>
                <input
                  type="text"
                  value={formData.websiteUrl}
                  onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs text-white focus:outline-none focus:border-violet-400 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Link
              to="/admin/projects"
              className="px-6 py-3 rounded-full bg-[#16151B] hover:bg-black border border-white/10 hover:border-violet-400/50 text-white font-mono text-xs uppercase tracking-wider"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-8 py-3.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs uppercase tracking-wider font-bold shadow-xl shadow-violet-600/30 hover:shadow-violet-600/50 transition-all cursor-pointer active:scale-95 ring-1 ring-violet-400/30 flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-white" />
              <span>{isOwner ? (isEditing ? 'Save Changes' : 'Create Application') : (isEditing ? 'Submit Updates for Review' : 'Submit Application for Review')}</span>
            </button>
          </div>

        </form>

        {/* Right Live Preview Column */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-violet-400 flex items-center gap-1.5">
              <span>&#125;</span>
              <span>Live Card Preview</span>
            </span>
            <span className="font-mono text-[10px] text-white/40 uppercase">Updates as you type</span>
          </div>

          <AppCard project={previewProject} />

          <div className="p-5 rounded-[24px] bg-[#0F0E11] border border-white/10 text-xs text-white/60 space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-white block">Local Prototype Storage</span>
            <p className="text-[11px] leading-relaxed">
              Submitting this form commits your modifications directly to the browser's reactive state and local storage, ensuring the public pages reflect changes instantly.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
