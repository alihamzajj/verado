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
  Info,
  UserPlus,
  Trash2,
  Mail,
  User as UserIcon,
  Palette,
  Camera
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User, Permissions, UserRole } from '../../types';
import { Modal } from '../../components/common/Modal';
import { getInitialsAvatar, AVATAR_GRADIENTS } from '../../lib/avatar';

export const AdminUsersPage: React.FC = () => {
  const { 
    users, 
    currentUser, 
    setCurrentUser, 
    updateUserPermissions, 
    updateUserProfile,
    addUser, 
    deleteUser, 
    addNotification 
  } = useApp();

  const isOwner = currentUser.role === 'Owner';
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // New member form state
  const [newMember, setNewMember] = useState<{
    name: string;
    email: string;
    role: UserRole;
    codeAccess: 'Full Access' | 'Read Only' | 'Locked';
  }>({
    name: '',
    email: '',
    role: 'Developer',
    codeAccess: 'Full Access',
  });

  const [selectedGradient, setSelectedGradient] = useState<string>('amethyst');
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>('');
  const [showCustomPhotoInput, setShowCustomPhotoInput] = useState<boolean>(false);

  // Modal local state for editing permissions & profile
  const [modalRole, setModalRole] = useState<UserRole>('Developer');
  const [editName, setEditName] = useState<string>('');
  const [editEmail, setEditEmail] = useState<string>('');
  const [editAvatar, setEditAvatar] = useState<string>('');
  const [editGradient, setEditGradient] = useState<string>('amethyst');
  const [showEditPhotoInput, setShowEditPhotoInput] = useState<boolean>(false);

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
    if (!isOwner) {
      addNotification('Access Denied: Only the Studio Owner has authority to configure team permissions.', 'error');
      return;
    }
    setSelectedUser(user);
    setModalRole(user.role);
    setModalPermissions({ ...user.permissions });
    setEditName(user.name);
    setEditEmail(user.email);
    setEditAvatar(user.avatar && !user.avatar.startsWith('data:image/svg') ? user.avatar : '');
    setEditGradient('amethyst');
    setShowEditPhotoInput(Boolean(user.avatar && !user.avatar.startsWith('data:image/svg')));
  };

  const handleSavePermissions = () => {
    if (!isOwner) {
      addNotification('Access Denied: Only the Studio Owner can update permissions.', 'error');
      return;
    }
    if (selectedUser) {
      const finalAvatar = editAvatar.trim() || getInitialsAvatar(editName, editGradient);
      updateUserPermissions(selectedUser.id, modalPermissions, modalRole);
      updateUserProfile(selectedUser.id, {
        name: editName.trim() || selectedUser.name,
        email: editEmail.trim() || selectedUser.email,
        avatar: finalAvatar,
        role: modalRole,
      });
      setSelectedUser(null);
    }
  };

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) {
      addNotification('Access Denied: Only the Studio Owner can add team members.', 'error');
      return;
    }
    if (!newMember.name.trim() || !newMember.email.trim()) {
      addNotification('Please enter both name and email.', 'error');
      return;
    }

    const finalAvatar = customPhotoUrl.trim() || getInitialsAvatar(newMember.name, selectedGradient);

    addUser({
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      codeAccess: newMember.codeAccess,
      avatar: finalAvatar,
    });

    setNewMember({
      name: '',
      email: '',
      role: 'Developer',
      codeAccess: 'Full Access',
    });
    setCustomPhotoUrl('');
    setShowCustomPhotoInput(false);
    setSelectedGradient('amethyst');
    setIsAddModalOpen(false);
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
            Granular role-based access control. Configure names, emails, avatars, roles, and release authorizations.
          </p>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3">
          {/* Current Active Persona Reminder */}
          <div className="p-3.5 rounded-2xl bg-[#0F0E11] border border-white/10 flex items-center gap-3">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = getInitialsAvatar(currentUser.name);
              }}
              className="w-9 h-9 rounded-xl object-cover ring-1 ring-white/10" 
            />
            <div className="text-xs">
              <span className="text-white/40 block font-mono text-[10px] uppercase">Logged in persona:</span>
              <span className="font-bold text-white">{currentUser.name} <span className="text-violet-400 font-mono font-normal">({currentUser.role})</span></span>
            </div>
          </div>

          {/* Add Team Member Button (Owner Only) */}
          {isOwner ? (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-black hover:bg-[#16151B] text-white border border-white/20 hover:border-violet-400/50 font-mono text-xs uppercase tracking-wider font-semibold shadow-xl transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-violet-400" />
              <span>+ Add Member</span>
            </button>
          ) : (
            <button
              disabled
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#16151B]/40 text-white/30 border border-white/5 font-mono text-xs uppercase tracking-wider cursor-not-allowed"
              title="Only Studio Owner can add team members"
            >
              <Lock className="w-4 h-4 text-white/20" />
              <span>+ Add Member</span>
            </button>
          )}
        </div>
      </div>

      {/* Studio Security Policy Banner */}
      <div className="p-4 rounded-2xl bg-[#0F0E11] border border-violet-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-violet-400 shrink-0" />
          <span className="text-white/80">
            <strong className="text-white">Studio Policy:</strong> Owner holds exclusive authority to add/remove members, assign roles, and delete catalog data. Team members can draft and edit applications based on their assigned role.
          </span>
        </div>
        <span className="font-mono text-[10px] text-violet-300 bg-violet-500/10 px-2.5 py-1 rounded-full border border-violet-500/20 whitespace-nowrap">
          Governance: Owner Enforced
        </span>
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
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = getInitialsAvatar(user.name);
                          }}
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
                        
                        {/* Permissions & Profile configuration */}
                        <button
                          onClick={() => handleOpenPermissions(user)}
                          disabled={!isOwner}
                          className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-1.5 transition-colors uppercase tracking-wider ${
                            isOwner
                              ? 'bg-[#16151B] hover:bg-black text-white/80 hover:text-white border-white/10 hover:border-violet-400/50 cursor-pointer'
                              : 'bg-white/5 text-white/30 border-white/5 cursor-not-allowed'
                          }`}
                          title={isOwner ? 'Edit Profile & Permissions' : 'Only Studio Owner can configure permissions'}
                        >
                          <Sliders className="w-3 h-3 text-violet-400" />
                          <span>Edit & Access</span>
                        </button>

                        {/* Persona switcher */}
                        <button
                          onClick={() => setCurrentUser(user)}
                          disabled={isCurrent}
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                            isCurrent
                              ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/5'
                              : 'bg-black hover:bg-[#16151B] text-white border border-white/20 hover:border-violet-400/50 font-bold'
                          }`}
                        >
                          {isCurrent ? 'Active' : 'Switch'}
                        </button>

                        {/* Remove Team Member button (Owner Only, Cannot delete self) */}
                        {!isCurrent && (
                          isOwner ? (
                            <button
                              onClick={() => setUserToDelete(user)}
                              className="p-2 rounded-full bg-[#16151B] hover:bg-rose-500/20 text-white/60 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-colors cursor-pointer"
                              title={`Remove ${user.name} from studio team`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              disabled
                              className="p-2 rounded-full bg-white/5 text-white/20 border border-white/5 cursor-not-allowed"
                              title="Only Studio Owner can remove team members"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </button>
                          )
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

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Add New Team Member"
          subtitle="Invite a new developer, editor, or administrator to the studio team."
          maxWidth="max-w-md"
        >
          <form onSubmit={handleAddMemberSubmit} className="space-y-4 pt-2">
            
            {/* Live Monogram Badge / Avatar Selector (No Photo Required!) */}
            <div className="p-4 rounded-2xl bg-[#16151B] border border-white/10 space-y-3">
              <div className="flex items-center gap-3.5">
                <img 
                  src={customPhotoUrl.trim() || getInitialsAvatar(newMember.name || 'Member', selectedGradient)} 
                  alt="Avatar Preview" 
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-violet-500/40 shadow-lg shrink-0" 
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Monogram Badge Preview</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-violet-500/20 text-violet-300">
                      Auto Generated
                    </span>
                  </div>
                  <p className="text-[11px] text-white/50 leading-tight mt-0.5">
                    <strong>No photo required!</strong> A monogram badge with their initials is generated automatically. Pick a color theme below:
                  </p>
                </div>
              </div>

              {/* 6 Gradient Theme Selectors */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono text-white/40 uppercase block">Badge Color Theme:</span>
                <div className="flex items-center gap-2.5">
                  {AVATAR_GRADIENTS.map((grad) => (
                    <button
                      key={grad.id}
                      type="button"
                      onClick={() => {
                        setSelectedGradient(grad.id);
                        setCustomPhotoUrl('');
                      }}
                      style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}
                      className={`w-7 h-7 rounded-xl transition-all cursor-pointer ${
                        selectedGradient === grad.id && !customPhotoUrl
                          ? 'ring-2 ring-white scale-110 shadow-lg shadow-violet-500/30'
                          : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                      title={grad.name}
                    />
                  ))}
                </div>
              </div>

              {/* Optional Custom Photo toggle */}
              <div className="pt-2 border-t border-white/5">
                {!showCustomPhotoInput ? (
                  <button
                    type="button"
                    onClick={() => setShowCustomPhotoInput(true)}
                    className="text-[11px] font-mono text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
                  >
                    + Have a custom photo URL? (Optional)
                  </button>
                ) : (
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="font-mono text-[10px] uppercase text-white/50">Custom Photo Link (Optional)</label>
                      <button
                        type="button"
                        onClick={() => {
                          setCustomPhotoUrl('');
                          setShowCustomPhotoInput(false);
                        }}
                        className="text-[10px] text-white/40 hover:text-white"
                      >
                        Reset to Initials Badge
                      </button>
                    </div>
                    <input
                      type="url"
                      value={customPhotoUrl}
                      onChange={(e) => setCustomPhotoUrl(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full px-3 py-2 rounded-xl bg-[#0F0E11] border border-white/10 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-violet-400"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  required
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="e.g. Jordan Hayes"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  required
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  placeholder="e.g. jordan@verado.io"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs sm:text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                Assigned Role
              </label>
              <select
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value as UserRole })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-violet-400 cursor-pointer"
              >
                <option value="Developer" className="bg-[#0F0E11]">Developer (Engineering & Catalog Drafting)</option>
                <option value="Editor" className="bg-[#0F0E11]">Editor (Release Notes & Copywriting)</option>
                <option value="Content Manager" className="bg-[#0F0E11]">Content Manager (Media & Storefront Assets)</option>
                <option value="Owner" className="bg-[#0F0E11]">Owner (Full Executive & Delete Authority)</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                Code Repository Access
              </label>
              <select
                value={newMember.codeAccess}
                onChange={(e) => setNewMember({ ...newMember, codeAccess: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-violet-400 cursor-pointer"
              >
                <option value="Full Access" className="bg-[#0F0E11]">Full Access (Read, Write & Branch)</option>
                <option value="Read Only" className="bg-[#0F0E11]">Read Only</option>
                <option value="Locked" className="bg-[#0F0E11]">Locked (No Code Access)</option>
              </select>
            </div>

            <div className="p-3.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs space-y-1">
              <span className="font-mono text-xs text-white font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                <span>Security Policy</span>
              </span>
              <p className="text-[11px] text-white/70 leading-relaxed">
                New members can draft and edit applications. The authority to delete catalog projects or remove members is permanently locked to the Studio Owner.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-5 py-2.5 rounded-full bg-[#16151B] hover:bg-black border border-white/10 text-white/80 hover:text-white text-xs font-mono uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-black hover:bg-[#16151B] text-white border border-white/20 hover:border-violet-400/50 font-mono text-xs uppercase tracking-wider font-bold shadow-xl transition-all cursor-pointer"
              >
                Add Member
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Remove Member Confirmation Modal */}
      {userToDelete && (
        <Modal
          isOpen={!!userToDelete}
          onClose={() => setUserToDelete(null)}
          title="Remove Team Member?"
          subtitle={`Revoke access for ${userToDelete.name}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 leading-relaxed space-y-2">
              <p>
                Are you sure you want to remove <strong className="text-white">{userToDelete.name}</strong> (<span className="font-mono text-white/80">{userToDelete.email}</span>) from the studio team?
              </p>
              <p className="text-[11px] text-rose-300/80">
                They will lose all access to the admin dashboard, project drafting, and code workspaces. This action can only be performed by the Studio Owner.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-5 py-2.5 rounded-full bg-[#16151B] hover:bg-black border border-white/10 text-white/80 hover:text-white text-xs font-mono uppercase tracking-wider cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (userToDelete) {
                    deleteUser(userToDelete.id);
                    setUserToDelete(null);
                  }
                }}
                className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs uppercase tracking-wider font-bold shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
              >
                Confirm Remove
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Profile & Permissions Drawer / Modal */}
      {selectedUser && (
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title={`Edit Profile & Access: ${selectedUser.name}`}
          subtitle={`${selectedUser.email} • ID: ${selectedUser.id}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-5 pt-2">
            
            {/* Live Monogram Badge / Picture Preview */}
            <div className="p-4 rounded-2xl bg-[#16151B] border border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src={editAvatar.trim() || getInitialsAvatar(editName || selectedUser.name, editGradient)} 
                  alt={editName} 
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-violet-500/40 shrink-0" 
                />
                <div>
                  <span className="text-xs font-bold text-white block">{editName || selectedUser.name}</span>
                  <span className="text-[11px] text-white/50 font-mono">{editEmail || selectedUser.email}</span>
                </div>
              </div>

              {/* Theme Picker */}
              <div className="flex items-center gap-2">
                {AVATAR_GRADIENTS.map((grad) => (
                  <button
                    key={grad.id}
                    type="button"
                    onClick={() => {
                      setEditGradient(grad.id);
                      setEditAvatar('');
                    }}
                    style={{ background: `linear-gradient(135deg, ${grad.from}, ${grad.to})` }}
                    className={`w-6 h-6 rounded-lg transition-all cursor-pointer ${
                      editGradient === grad.id && !editAvatar
                        ? 'ring-2 ring-white scale-110 shadow-md'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    title={grad.name}
                  />
                ))}
              </div>
            </div>

            {/* Custom Photo URL toggle */}
            <div>
              {!showEditPhotoInput ? (
                <button
                  type="button"
                  onClick={() => setShowEditPhotoInput(true)}
                  className="text-[11px] font-mono text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
                >
                  + Edit custom photo link
                </button>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-[10px] uppercase text-white/50">Custom Photo Link</label>
                    <button
                      type="button"
                      onClick={() => {
                        setEditAvatar('');
                        setShowEditPhotoInput(false);
                      }}
                      className="text-[10px] text-white/40 hover:text-white"
                    >
                      Use Monogram Badge
                    </button>
                  </div>
                  <input
                    type="url"
                    value={editAvatar}
                    onChange={(e) => setEditAvatar(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-3 py-2 rounded-xl bg-[#16151B] border border-white/10 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-violet-400"
                  />
                </div>
              )}
            </div>

            {/* Name & Email Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-mono text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-violet-400 transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-violet-400 transition-colors"
                />
              </div>
            </div>

            {/* Role Dropdown */}
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
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

              {/* Permanent Owner-Only Delete Guard Notice */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 mt-3">
                <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
                      Delete Authority: Owner Only
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-amber-400/20 text-amber-300">
                      Enforced
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-200/80 leading-relaxed">
                    Team members can be granted rights to view, add, and edit applications, but the authority to permanently delete catalog projects or remove team members is strictly locked to the Studio Owner.
                  </p>
                </div>
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
                Save Changes
              </button>
            </div>

          </div>
        </Modal>
      )}

    </div>
  );
};
