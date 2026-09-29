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
  Table as TableIcon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../../components/common/Modal';

export const AdminProjectsPage: React.FC = () => {
  const { projects, deleteProject, toggleProjectPublish, toggleProjectFeatured } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase()) ||
    p.technologies.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete);
      setProjectToDelete(null);
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
            Publish, edit, and orchestrate releases for all mobile apps in the studio catalog.
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

          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black hover:bg-[#16151B] text-white border border-white/20 hover:border-violet-400/50 font-mono text-xs uppercase tracking-wider font-semibold shadow-xl transition-all"
          >
            <Plus className="w-4 h-4 text-violet-400" />
            <span>+ Add Project</span>
          </Link>
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
          Showing <span className="text-white font-bold">{filteredProjects.length}</span> of {projects.length} projects
        </div>
      </div>

      {/* View: Table Mode */}
      {viewMode === 'table' ? (
        <div className="rounded-[32px] bg-[#0F0E11] border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#16151B] text-white/50 font-mono font-bold uppercase tracking-wider text-[10px] border-b border-white/10">
                <tr>
                  <th className="py-4 px-6">App Name & Details</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Platforms</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Featured</th>
                  <th className="py-4 px-4">Last Updated</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/80">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-white/5 transition-colors">
                    
                    {/* App Logo & Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={project.logo} 
                          alt={project.name} 
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10 shrink-0" 
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-white text-xs hover:text-violet-300 transition-colors">
                            {project.name}
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

                    {/* Status Toggle */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleProjectPublish(project.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase font-semibold transition-all cursor-pointer ${
                          project.published
                            ? 'bg-violet-500/15 text-violet-300 border border-violet-500/30 hover:bg-violet-500/25'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {project.published ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleProjectFeatured(project.id)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          project.featured
                            ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                            : 'text-white/30 hover:text-white/60'
                        }`}
                        title="Toggle Featured on Homepage"
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
                        <Link
                          to={`/projects/${project.id}`}
                          target="_blank"
                          className="p-2 rounded-full bg-[#16151B] hover:bg-black text-white/70 hover:text-white border border-white/10 hover:border-violet-400/50 transition-colors"
                          title="View Live Public Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/admin/projects/${project.id}/edit`}
                          className="p-2 rounded-full bg-[#16151B] hover:bg-black text-white/70 hover:text-violet-300 border border-white/10 hover:border-violet-400/50 transition-colors"
                          title="Edit Project"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => setProjectToDelete(project.id)}
                          className="p-2 rounded-full bg-[#16151B] hover:bg-rose-500/20 text-white/70 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-colors cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* View: Grid Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className="p-6 rounded-[28px] bg-[#0F0E11] border border-white/10 flex flex-col justify-between space-y-4 hover:border-violet-400/40 transition-all shadow-md"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <img src={project.logo} alt={project.name} className="w-12 h-12 rounded-xl object-cover ring-1 ring-white/10" />
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${
                      project.published 
                        ? 'bg-violet-500/15 text-violet-300 border border-violet-500/30' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {project.published ? 'Published' : 'Draft'}
                    </span>
                    <button
                      onClick={() => toggleProjectFeatured(project.id)}
                      className={project.featured ? 'text-amber-400 cursor-pointer' : 'text-white/30 hover:text-white/60 cursor-pointer'}
                    >
                      <Star className={`w-4 h-4 ${project.featured ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white">{project.name}</h3>
                <p className="text-xs font-mono text-violet-400 mb-1">{project.category}</p>
                <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">{project.shortDescription}</p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="font-mono text-[11px] text-white/50">{project.platforms}</span>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/admin/projects/${project.id}/edit`}
                    className="px-4 py-1.5 rounded-full bg-[#16151B] hover:bg-black text-white border border-white/10 hover:border-violet-400/50 font-mono text-xs uppercase tracking-wider"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setProjectToDelete(project.id)}
                    className="p-2 rounded-full bg-[#16151B] hover:bg-rose-500/20 text-white/60 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <Modal
          isOpen={!!projectToDelete}
          onClose={() => setProjectToDelete(null)}
          title="Delete Project?"
          subtitle="Are you sure you want to remove this application from the studio catalog?"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 pt-2">
            <p className="text-xs text-white/60 leading-relaxed">
              This action will remove the project from the public showcase and admin portfolio listings. You can test adding it back anytime.
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setProjectToDelete(null)}
                className="px-5 py-2.5 rounded-full bg-[#16151B] text-white/80 hover:text-white border border-white/10 text-xs font-mono uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono uppercase tracking-wider font-bold shadow-lg shadow-rose-600/20 cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
