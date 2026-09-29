import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Check, 
  Key, 
  Sliders, 
  UserCheck, 
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User, Permissions, UserRole } from '../../types';
import { Modal } from '../../components/common/Modal';

export const AdminUsersPage: React.FC = () => {
  const { users, currentUser, setCurrentUser, updateUserPermissions, addNotification } = useApp();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Modal local state
  const [modalRole, setModalRole] = useState<UserRole>('Developer');
  const [modalPermissions, setModalPermissions] = useState<Permissions>({
    viewProjects: true,
    addProjects: true,
    editProjects: true,
    createBranch: true,
    previewChanges: true,
    mergeToProduction: false,
    deployProduction: false,
  });

  const handleOpenPermissions = (user: User) => {
    setSelectedUser(user);
    setModalRole(user.role);
    setModalPermissions({ ...user.permissions });
  };

  const handleSavePermissions = () => {
    if (selectedUser) {
      updateUserPermissions(selectedUser.id, modalPermissions, modalRole);
      setSelectedUser(null);
    }
  };

  const permissionItems: { key: keyof Permissions; label: string; desc: string }[] = [
    { key: 'viewProjects', label: 'View Projects', desc: 'Allows viewing of public and private app specs' },
    { key: 'addProjects', label: 'Add Projects', desc: 'Can register new mobile applications in catalog' },
    { key: 'editProjects', label: 'Edit Projects', desc: 'Can modify project metadata, screenshots, and URLs' },
    { key: 'createBranch', label: 'Create Branch', desc: 'Allows branching feature pipelines in workspace' },
    { key: 'previewChanges', label: 'Preview Changes', desc: 'Can generate and inspect live preview artifacts' },
    { key: 'mergeToProduction', label: 'Merge to Production', desc: 'Permission to merge changes into main catalog' },
    { key: 'deployProduction', label: 'Deploy Production', desc: 'Trigger App Store / Google Play production release' },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-violet-400 mb-1">
            <span>&#125;</span>
            <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
            <span>Developer Permission Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Team Members & Permissions
          </h1>
          <p className="text-xs sm:text-sm text-white/60 mt-1">
            Granular role-based access control. Configure project catalog editing and release deployment permissions.
          </p>
        </div>

        {/* Current Active Persona Reminder */}
        <div className="p-3.5 rounded-2xl bg-[#0F0E11] border border-white/10 flex items-center gap-3">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-xl object-cover ring-1 ring-white/10" />
          <div className="text-xs">
            <span className="text-white/40 block font-mono text-[10px] uppercase">Logged in persona:</span>
            <span className="font-bold text-white">{currentUser.name} <span className="text-violet-400 font-mono font-normal">({currentUser.role})</span></span>
          </div>
        </div>
      </div>

      {/* Instructional Callout */}
      <div className="p-5 rounded-[24px] bg-[#0F0E11] border border-violet-500/20 text-xs text-violet-200 flex items-start gap-3">
        <Info className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-mono text-xs uppercase tracking-wider text-violet-300 font-bold">Prototype Testing Guide:</span>
          <p className="text-[11px] leading-relaxed text-white/70">
            Click <strong>"Configure Permissions"</strong> for any developer or content manager below. Try toggling <strong>Edit Projects</strong> or <strong>Deploy Production</strong> ON/OFF. Then click <strong>"Simulate as User"</strong> to experience that persona's exact dashboard view!
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-[32px] bg-[#0F0E11] border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#16151B] text-white/50 font-mono font-bold uppercase tracking-wider text-[10px] border-b border-white/10">
              <tr>
                <th className="py-4 px-6">User / Developer</th>
                <th className="py-4 px-4">Role</th>
                <th className="py-4 px-4">Account Status</th>
                <th className="py-4 px-4">Release Access</th>
                <th className="py-4 px-4">Last Active</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {users.map((user) => {
                const isCurrent = user.id === currentUser.id;

                return (
                  <tr key={user.id} className={`hover:bg-white/5 transition-colors ${isCurrent ? 'bg-violet-500/5' : ''}`}>
                    
                    {/* User Identity */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/10 shrink-0" 
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs">{user.name}</span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-violet-500/20 text-violet-300 border border-violet-500/30">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-white/50">{user.email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold ${
                        user.role === 'Owner' 
                          ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                          : user.role === 'Developer'
                          ? 'bg-violet-500/15 text-violet-300 border border-violet-500/30'
                          : 'bg-[#16151B] text-white/70 border border-white/10'
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        {user.status}
                      </span>
                    </td>

                    {/* Release Access Badge */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 font-mono">
                        {user.permissions.deployProduction ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-violet-500/10 text-violet-300 border border-violet-500/20">
                            <ShieldCheck className="w-3 h-3 text-violet-400" />
                            Full Release Access
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#16151B] text-white/60 border border-white/10">
                            <Check className="w-3 h-3 text-violet-400" />
                            Catalog Editor
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Last Active */}
                    <td className="py-4 px-4 text-white/40 font-mono text-[11px]">
                      {user.lastActive}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 font-mono">
                        <button
                          onClick={() => handleOpenPermissions(user)}
                          className="px-3.5 py-1.5 rounded-full bg-[#16151B] hover:bg-black text-white/80 hover:text-white border border-white/10 hover:border-violet-400/50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer uppercase tracking-wider"
                        >
                          <Sliders className="w-3 h-3 text-violet-400" />
                          <span>Permissions</span>
                        </button>

                        <button
                          onClick={() => setCurrentUser(user)}
                          disabled={isCurrent}
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
                              : 'bg-black hover:bg-[#16151B] text-white border border-white/20 hover:border-violet-400/50 font-bold'
                          }`}
                        >
                          {isCurrent ? 'Active Persona' : 'Simulate User'}
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permission Drawer / Modal */}
      {selectedUser && (
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title={`Configure Permissions: ${selectedUser.name}`}
          subtitle={`${selectedUser.email} • ID: ${selectedUser.id}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-6 pt-2">
            
            {/* Role Dropdown */}
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
                Assigned Role
              </label>
              <select
                value={modalRole}
                onChange={(e) => setModalRole(e.target.value as UserRole)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-violet-400 cursor-pointer"
              >
                <option value="Owner" className="bg-[#0F0E11]">Owner (Administrative Executive)</option>
                <option value="Developer" className="bg-[#0F0E11]">Developer (Engineering & Code Access)</option>
                <option value="Editor" className="bg-[#0F0E11]">Editor (Release Notes & Copy)</option>
                <option value="Content Manager" className="bg-[#0F0E11]">Content Manager (Storefront Assets)</option>
              </select>
            </div>

            {/* Permissions Checkbox Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-violet-400">
                  Granular Permissions Policy
                </span>
                <span className="font-mono text-[10px] text-white/40 uppercase">Instant State Sync</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {permissionItems.map((item) => {
                  const isChecked = modalPermissions[item.key];
                  const isDeployToggle = item.key === 'deployProduction';

                  return (
                    <label 
                      key={item.key}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isChecked 
                          ? 'bg-[#16151B] border-violet-500/40 shadow-sm' 
                          : 'bg-[#16151B]/40 border-white/5 opacity-60'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          setModalPermissions(prev => ({
                            ...prev,
                            [item.key]: e.target.checked
                          }));
                        }}
                        className="mt-0.5 w-4 h-4 rounded text-violet-500 focus:ring-violet-400 bg-[#16151B] border-white/20"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-bold ${isChecked ? 'text-white' : 'text-white/60'}`}>
                            {item.label}
                          </span>
                          {isDeployToggle && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase bg-violet-500/20 text-violet-300">
                              Release
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-white/50 leading-tight mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2.5 rounded-full bg-[#16151B] hover:bg-black border border-white/10 text-white/80 hover:text-white text-xs font-mono uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePermissions}
                className="px-6 py-2.5 rounded-full bg-black hover:bg-[#16151B] text-white border border-white/20 hover:border-violet-400/50 font-mono text-xs uppercase tracking-wider font-bold shadow-xl transition-all cursor-pointer"
              >
                Save Permissions
              </button>
            </div>

          </div>
        </Modal>
      )}

    </div>
  );
};
