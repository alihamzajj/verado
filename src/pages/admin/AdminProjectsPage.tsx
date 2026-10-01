import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  Smartphone, 
  Apple, 
  Star, 
  ExternalLink,
  Layers,
  Sparkles,
  LayoutGrid,
  Table as TableIcon,
  Lock,
  Archive,
  RotateCcw,
  CheckCheck,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';

export const AdminProjectsPage: React.FC = () => {
  const { 
    projects, 
    deleteProject, 
    archiveProject, 
    restoreProject, 
    approveAndPublishProject, 
    toggleProjectPublish, 
    toggleProjectFeatured, 
    currentUser, 
    addNotification,
    isAdministrativeUser
  } = useApp();

  const isOwner = isAdministrativeUser(currentUser);
  const canAdd = isOwner || currentUser.permissions.addProjects !== false;
  const canEdit = isOwner || currentUser.permissions.editProjects !== false;
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [tabFilter, setTabFilter] = useState<'all' | 'published' | 'drafts' | 'archived'>('all');
  const [projectToManage, setProjectToManage] = useState<string | null>(null);

  // Tab counts
  const allActiveCount = projects.filter(p => !p.isArchived).length;
  const publishedCount = projects.filter(p => p.published && !p.isArchived).length;
  const draftsCount = projects.filter(p => !p.published && !p.isArchived).length;
  const archivedCount = projects.filter(p => p.isArchived).length;

  const filteredProjects = projects.filter(p => {
    // Tab filter
    if (tabFilter === 'published' && (!p.published || p.isArchived)) return false;
    if (tabFilter === 'drafts' && (p.published || p.isArchived)) return false;
    if (tabFilter === 'archived' && !p.isArchived) return false;
    if (tabFilter === 'all' && p.isArchived) return false;

    // Search query
    const query = search.toLowerCase().trim();
    if (!query) return true;
    return (
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.technologies.some(t => t.toLowerCase().includes(query))
    );
  });

  const selectedTargetProject = projects.find(p => p.id === projectToManage);

  const handleArchiveConfirm = () => {
    if (!isOwner) {
      addNotification('Access Denied: Only the Studio Owner can archive projects.', 'error');
      setProjectToManage(null);
      return;
    }
    if (projectToManage) {
      archiveProject(projectToManage);
      setProjectToManage(null);
    }
  };

  const handleDeletePermanentConfirm = () => {
    if (!isOwner) {
      addNotification('Access Denied: Only the Studio Owner can permanently delete projects.', 'error');
      setProjectToManage(null);
      return;
    }
    if (projectToManage) {
      deleteProject(projectToManage);
      setProjectToManage(null);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-violet-400 mb-1">
            <span>&#125;</span>
            <span>Catalog Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Project Management</h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Publish, edit, review drafts, and orchestrate releases for all applications in the studio portfolio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center p-1 rounded-full bg-[#0F0E11] border border-white/10">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-full text-xs transition-colors cursor-pointer ${viewMode === 'table' ? 'bg-[#16151B] text-violet-300 border border-white/10' : 'text-white/40 hover:text-white'}`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-full text-xs transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-[#16151B] text-violet-300 border border-white/10' : 'text-white/40 hover:text-white'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {canAdd && (
            <Link
              to="/admin/projects/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black hover:bg-[#16151B] text-white border border-white/20 hover:border-violet-400/50 font-mono text-xs uppercase tracking-wider font-semibold shadow-xl transition-all"
            >
              <Plus className="w-4 h-4 text-violet-400" />
              <span>+ Add Project</span>
            </Link>
          )}
        </div>
      </div>

      {/* Workflow Tabs & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#0F0E11] border border-white/10 w-fit">
          <button
            onClick={() => setTabFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              tabFilter === 'all'
                ? 'bg-[#16151B] text-white font-bold border border-white/10 shadow-sm'
                : 'text-white/50 hover:text-white'
            }`}
          >
            All Active ({allActiveCount})
          </button>

          <button
            onClick={() => setTabFilter('published')}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              tabFilter === 'published'
                ? 'bg-violet-500/15 text-violet-300 font-bold border border-violet-500/30 shadow-sm'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            <span>Published ({publishedCount})</span>
          </button>

          <button
            onClick={() => setTabFilter('drafts')}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              tabFilter === 'drafts'
                ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 shadow-sm'
                : 'text-white/50 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Drafts / In Review ({draftsCount})</span>
          </button>

          <button
            onClick={() => setTabFilter('archived')}
            className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              tabFilter === 'archived'
                ? 'bg-white/10 text-white font-bold border border-white/20 shadow-sm'
                : 'text-white/40 hover:text-white'
            }`}
          >
            <Archive className="w-3.5 h-3.5 text-white/60" />
            <span>Archived ({archivedCount})</span>
          </button>
        </div>

        {/* Persona Status Pill */}
        <div className="flex items-center gap-2 text-xs font-mono text-white/50">
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          <span>Role: <strong className="text-white">{currentUser.role}</strong></span>
          {!isOwner && <span className="text-amber-400 text-[11px]">(Publish & Delete locked to Owner)</span>}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-[24px] bg-[#0F0E11] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by name, category, or stack..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-400 transition-colors"
          />
        </div>

        <div className="font-mono text-xs text-white/50">
          Showing <span className="text-white font-bold">{filteredProjects.length}</span> projects
        </div>
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="p-12 text-center rounded-[32px] bg-[#0F0E11] border border-white/10 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/40">
            {tabFilter === 'archived' ? <Archive className="w-6 h-6" /> : <Layers className="w-6 h-6" />}
          </div>
          <h3 className="text-base font-bold text-white">No projects found in this view</h3>
          <p className="text-xs text-white/50 max-w-sm mx-auto">
            {tabFilter === 'archived' 
              ? 'No projects are currently in the archive. Any archived project will appear here safely preserved.'
              : tabFilter === 'drafts'
              ? 'No pending drafts. All projects submitted by the team have been reviewed and published.'
              : 'Try adjusting your search criteria or switch to another tab filter.'}
          </p>
        </div>
      )}

      {/* View: Table Mode */}
      {filteredProjects.length > 0 && viewMode === 'table' && (
        <div className="rounded-[32px] bg-[#0F0E11] border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#16151B] text-white/50 font-mono font-bold uppercase tracking-wider text-[10px] border-b border-white/10">
                <tr>
                  <th className="py-4 px-6">App Name & Details</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Platforms</th>
                  <th className="py-4 px-4">Status & Approval</th>
                  <th className="py-4 px-4">Featured</th>
                  <th className="py-4 px-4">Last Updated</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {filteredProjects.map((project) => {
                  const isArchived = Boolean(project.isArchived);
                  const isDraft = !project.published && !isArchived;

                  return (
                    <tr key={project.id} className="hover:bg-white/5 transition-colors">
                      
                      {/* App Logo & Name */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img 
                            src={project.logo} 
                            alt={project.name} 
                            className={`w-10 h-10 rounded-xl object-cover ring-1 ring-white/10 shrink-0 ${isArchived ? 'opacity-40 grayscale' : ''}`} 
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-white text-xs hover:text-violet-300 transition-colors flex items-center gap-2">
                              <span>{project.name}</span>
                              {project.submittedBy && (
                                <span className="text-[10px] font-mono text-white/40 font-normal">
                                  by {project.submittedBy}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-white/50 truncate max-w-xs">
                              {project.tagline}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 text-white font-mono text-[11px]">
                        {project.category}
                      </td>

                      {/* Platforms */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 font-mono text-[11px]">
                          {project.platforms.includes('iOS') && (
                            <span className="p-1 rounded bg-[#16151B] border border-white/10 text-white" title="iOS">
                              <Apple className="w-3.5 h-3.5" />
                            </span>
                          )}
                          {project.platforms.includes('Android') && (
                            <span className="p-1 rounded bg-[#16151B] border border-white/10 text-emerald-400" title="Android">
                              <Smartphone className="w-3.5 h-3.5" />
                            </span>
                          )}
                          <span className="text-[11px] text-white/50">{project.platforms}</span>
                        </div>
                      </td>

                      {/* Status & Review Pill */}
                      <td className="py-4 px-4">
                        {isArchived ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-semibold bg-white/10 text-white/60 border border-white/20 inline-flex items-center gap-1">
                            <Archive className="w-3 h-3" />
                            <span>Archived</span>
                          </span>
                        ) : isOwner ? (
                          <button
                            onClick={() => toggleProjectPublish(project.id)}
                            className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase font-semibold transition-all cursor-pointer ${
                              project.published
                                ? 'bg-violet-500/15 text-violet-300 border border-violet-500/30 hover:bg-violet-500/25'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                            }`}
                            title="Click to toggle publish status"
                          >
                            {project.published ? 'Published' : 'Draft • Click to Publish'}
                          </button>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-semibold ${
                            project.published
                              ? 'bg-violet-500/15 text-violet-300 border border-violet-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {project.published ? 'Published' : 'Draft (Review Pending)'}
                          </span>
                        )}
                      </td>

                      {/* Featured Toggle */}
                      <td className="py-4 px-4">
                        <button
                          disabled={!isOwner || isArchived}
                          onClick={() => toggleProjectFeatured(project.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            !isOwner || isArchived ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                          } ${
                            project.featured
                              ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                              : 'text-white/30 hover:text-white/60'
                          }`}
                          title={!isOwner ? 'Featured control restricted to Owner' : 'Toggle Featured on Homepage'}
                        >
                          <Star className={`w-4 h-4 ${project.featured ? 'fill-current' : ''}`} />
                        </button>
                      </td>

                      {/* Last Updated */}
                      <td className="py-4 px-4 text-white/40 font-mono text-[11px]">
                        {project.lastUpdated}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* Owner 1-Click Approve & Publish for Drafts */}
                          {isOwner && isDraft && (
                            <button
                              onClick={() => approveAndPublishProject(project.id)}
                              className="px-3 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono uppercase font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                              title="1-Click Owner Approval: Publish to Live Marketplace"
                            >
                              <CheckCheck className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}

                          {/* Restore action for Archived projects */}
                          {isArchived && isOwner && (
                            <button
                              onClick={() => restoreProject(project.id)}
                              className="px-3 py-1.5 rounded-full bg-violet-500/15 hover:bg-violet-500/25 text-violet-300 border border-violet-500/30 text-[10px] font-mono uppercase font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Restore project from archive"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Restore</span>
                            </button>
                          )}

                          {/* Live preview */}
                          {!isArchived && (
                            <Link
                              to={`/projects/${project.id}`}
                              target="_blank"
                              className="p-2 rounded-full bg-[#16151B] hover:bg-black text-white/70 hover:text-white border border-white/10 hover:border-violet-400/50 transition-colors"
                              title="View Live Public Details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                          )}

                          {/* Edit */}
                          {canEdit && (
                            <Link
                              to={`/admin/projects/${project.id}/edit`}
                              className="p-2 rounded-full bg-[#16151B] hover:bg-black text-white/70 hover:text-violet-300 border border-white/10 hover:border-violet-400/50 transition-colors"
                              title="Edit Project Details"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Link>
                          )}

                          {/* Owner Manage (Archive or Delete) - Strictly Owner Only */}
                          {isOwner && (
                            <button
                              onClick={() => setProjectToManage(project.id)}
                              className="p-2 rounded-full bg-[#16151B] hover:bg-rose-500/20 text-white/70 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-colors cursor-pointer"
                              title={isArchived ? "Permanently Purge Project" : "Archive or Delete Project (Owner Only)"}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View: Grid Mode */}
      {filteredProjects.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const isArchived = Boolean(project.isArchived);
            const isDraft = !project.published && !isArchived;

            return (
              <div 
                key={project.id} 
                className={`p-6 rounded-[28px] bg-[#0F0E11] border border-white/10 flex flex-col justify-between space-y-4 hover:border-violet-400/40 transition-all shadow-md ${
                  isArchived ? 'opacity-60' : ''
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <img src={project.logo} alt={project.name} className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10" />
                    <div className="flex items-center gap-2">
                      {isArchived ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold bg-white/10 text-white/60 border border-white/20">
                          Archived
                        </span>
                      ) : (
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${
                          project.published 
                            ? 'bg-violet-500/15 text-violet-300 border border-violet-500/30' 
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {project.published ? 'Published' : 'Draft'}
                        </span>
                      )}

                      <button
                        disabled={!isOwner || isArchived}
                        onClick={() => toggleProjectFeatured(project.id)}
                        className={project.featured ? 'text-amber-400 cursor-pointer' : 'text-white/30 hover:text-white/60 cursor-pointer'}
                      >
                        <Star className={`w-4 h-4 ${project.featured ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white flex items-center justify-between">
                    <span>{project.name}</span>
                    {project.submittedBy && (
                      <span className="text-[10px] font-mono text-white/40 font-normal">
                        by {project.submittedBy}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs font-mono text-violet-400 mb-1">{project.category}</p>
                  <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">{project.shortDescription}</p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-white/50">{project.platforms}</span>
                  <div className="flex items-center gap-2">
                    
                    {/* Owner 1-click approve */}
                    {isOwner && isDraft && (
                      <button
                        onClick={() => approveAndPublishProject(project.id)}
                        className="px-3 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono uppercase font-bold flex items-center gap-1 cursor-pointer"
                        title="Approve & Publish to live showcase"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}

                    {/* Restore */}
                    {isArchived && isOwner && (
                      <button
                        onClick={() => restoreProject(project.id)}
                        className="px-3 py-1.5 rounded-full bg-violet-500/15 hover:bg-violet-500/25 text-violet-300 border border-violet-500/30 text-[10px] font-mono uppercase font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restore</span>
                      </button>
                    )}

                    {canEdit && (
                      <Link
                        to={`/admin/projects/${project.id}/edit`}
                        className="px-4 py-1.5 rounded-full bg-[#16151B] hover:bg-black text-white border border-white/10 hover:border-violet-400/50 font-mono text-xs uppercase tracking-wider"
                      >
                        Edit
                      </Link>
                    )}

                    {isOwner && (
                      <button
                        onClick={() => setProjectToManage(project.id)}
                        className="p-2 rounded-full bg-[#16151B] hover:bg-rose-500/20 text-white/60 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 cursor-pointer"
                        title="Manage Archive / Delete (Owner Only)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Owner Safe Management Modal (Archive vs Hard Delete) */}
      {projectToManage && selectedTargetProject && (
        <Modal
          isOpen={!!projectToManage}
          onClose={() => setProjectToManage(null)}
          title={selectedTargetProject.isArchived ? "Permanently Delete Project?" : "Manage Project Removal"}
          subtitle={`Selected: ${selectedTargetProject.name}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-5 pt-2">
            
            {/* If project is already archived, offer permanent delete or cancel */}
            {selectedTargetProject.isArchived ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 leading-relaxed">
                  <strong>Warning:</strong> This will permanently erase <strong>"{selectedTargetProject.name}"</strong> from your Supabase cloud database. This action cannot be reversed.
                </div>
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    onClick={() => setProjectToManage(null)}
                    className="px-5 py-2.5 rounded-full bg-[#16151B] text-white/80 hover:text-white border border-white/10 text-xs font-mono uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeletePermanentConfirm}
                    className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono uppercase tracking-wider font-bold shadow-lg shadow-rose-600/20 cursor-pointer"
                  >
                    Permanently Purge
                  </button>
                </div>
              </div>
            ) : (
              /* If project is active, offer Safe Archive (Recommended) OR Permanent Delete */
              <div className="space-y-4">
                
                {/* Option 1: Archive (Recommended) */}
                <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/30 space-y-2">
                  <div className="flex items-center gap-2">
                    <Archive className="w-4 h-4 text-violet-400" />
                    <span className="font-bold text-white text-xs">Option 1: Safe Archive (Recommended)</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono uppercase font-bold bg-violet-500/20 text-violet-300">Safe</span>
                  </div>
                  <p className="text-[11px] text-white/70 leading-relaxed">
                    Instantly removes the project from the public showcase and website, but preserves all description, assets, screenshots, and metadata in your studio archive. You can restore it with 1 click at any time.
                  </p>
                  <button
                    onClick={handleArchiveConfirm}
                    className="w-full mt-2 py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs uppercase tracking-wider font-bold shadow-lg shadow-violet-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Archive className="w-4 h-4" />
                    <span>Archive Project (Preserve Data)</span>
                  </button>
                </div>

                {/* Option 2: Hard Delete */}
                <div className="p-4 rounded-2xl bg-[#16151B] border border-white/10 space-y-2">
                  <div className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-rose-400" />
                    <span className="font-bold text-white/90 text-xs">Option 2: Permanent Deletion</span>
                  </div>
                  <p className="text-[11px] text-white/50 leading-relaxed">
                    Completely and irreversibly deletes this project record from Supabase cloud database.
                  </p>
                  <button
                    onClick={handleDeletePermanentConfirm}
                    className="w-full mt-2 py-2.5 px-4 rounded-xl bg-transparent hover:bg-rose-500/15 text-rose-400 hover:text-rose-300 border border-rose-500/30 font-mono text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Permanently Purge from Database</span>
                  </button>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setProjectToManage(null)}
                    className="px-5 py-2 rounded-full bg-[#16151B] text-white/60 hover:text-white border border-white/10 text-xs font-mono uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

              </div>
            )}

          </div>
        </Modal>
      )}

    </div>
  );
};
