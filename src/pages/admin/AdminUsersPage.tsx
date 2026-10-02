import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Camera,
  Edit3,
  ChevronDown,
  ChevronUp,
  Send,
  AlertTriangle,
  Clock,
  Eye,
  Edit,
  RefreshCw,
  Copy
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { isAdministrativeRole } from '../../lib/permissions';
import { User, Permissions, UserRole } from '../../types';
import { Modal } from '../../components/common/Modal';
import { EmailInviteModal } from '../../components/common/EmailInviteModal';
import { getInitialsAvatar, AVATAR_GRADIENTS } from '../../lib/avatar';

const ROLE_PRESETS = [
  { value: 'Developer', label: 'Developer', desc: 'Engineering & Catalog Drafting' },
  { value: 'Editor', label: 'Editor', desc: 'Release Notes & Copywriting' },
  { value: 'Content Manager', label: 'Content Manager', desc: 'Media & Storefront Assets' },
  { value: 'UI/UX Designer', label: 'UI/UX Designer', desc: 'Design Systems & App Visuals' },
  { value: 'QA Specialist', label: 'QA Specialist', desc: 'Testing, Quality & Bug Validation' },
  { value: 'Product Manager', label: 'Product Manager', desc: 'Roadmaps & Application Specs' },
  { value: 'Admin', label: 'Admin', desc: 'Full Platform & Team Administration' },
  { value: 'Owner', label: 'Owner', desc: 'Full Executive & Delete Authority' },
];

const ROLE_SUGGESTIONS = [
  'Lead Flutter Engineer',
  'Senior iOS Developer',
  'UI/UX Designer',
  'DevOps Architect',
  'QA Specialist',
  'Product Marketing Lead',
];

export const AdminUsersPage: React.FC = () => {
  const { 
    users, 
    currentUser, 
    setCurrentUser, 
    loginAsUser,
    toggleUserStatus,
    updateUserPermissions, 
    updateUserProfile,
    inviteEmployee,
    resendInvitation,
    teamInvitations,
    deleteUser, 
    addNotification,
    isAdministrativeUser,
    generateUserPasscode,
    revokeUserPasscode,
  } = useApp();

  const navigate = useNavigate();
  const isOwner = currentUser.role === 'Owner';
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inviteModalUser, setInviteModalUser] = useState<User | null>(null);
  const [resendingUserId, setResendingUserId] = useState<string | null>(null);
  const [isSubmittingInvite, setIsSubmittingInvite] = useState(false);
  const [copiedPasscodeId, setCopiedPasscodeId] = useState<string | null>(null);
  
  // New member form state
  const [newMember, setNewMember] = useState<{
    name: string;
    email: string;
    role: string;
    codeAccess: 'Full Access' | 'Read Only' | 'Locked';
  }>({
    name: '',
    email: '',
    role: 'Developer',
    codeAccess: 'Full Access',
  });

  const [newMemberRoleMode, setNewMemberRoleMode] = useState<'preset' | 'custom'>('preset');
  const [newMemberCustomRole, setNewMemberCustomRole] = useState<string>('');
  const [newMemberCustomScope, setNewMemberCustomScope] = useState<string>('');
  const [showAddPermissions, setShowAddPermissions] = useState<boolean>(false);
  const [newMemberPermissions, setNewMemberPermissions] = useState<Permissions>({
    viewProjects: true,
    addProjects: true,
    editProjects: true,
    uploadMedia: true,
    publishProjects: false,
    deployProduction: false,
    deleteProjects: false,
    manageTeam: false,
  });

  const [selectedGradient, setSelectedGradient] = useState<string>('amethyst');
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>('');
  const [showCustomPhotoInput, setShowCustomPhotoInput] = useState<boolean>(false);

  // Modal local state for editing permissions & profile
  const [modalRole, setModalRole] = useState<string>('Developer');
  const [modalRoleMode, setModalRoleMode] = useState<'preset' | 'custom'>('preset');
  const [modalCustomRole, setModalCustomRole] = useState<string>('');
  const [modalCustomScope, setModalCustomScope] = useState<string>('');
  const [editName, setEditName] = useState<string>('');
  const [editEmail, setEditEmail] = useState<string>('');
  const [editAvatar, setEditAvatar] = useState<string>('');
  const [editGradient, setEditGradient] = useState<string>('amethyst');
  const [showEditPhotoInput, setShowEditPhotoInput] = useState<boolean>(false);

  const [modalPermissions, setModalPermissions] = useState<Permissions>({
    viewProjects: true,
    addProjects: true,
    editProjects: true,
    uploadMedia: true,
    publishProjects: false,
    deployProduction: false,
    deleteProjects: false,
    manageTeam: false,
  });

  const handleOpenPermissions = (user: User) => {
    if (!isOwner) {
      addNotification('Access Denied: Only the Studio Owner has authority to configure team permissions.', 'error');
      return;
    }
    setSelectedUser(user);
    const isPreset = ROLE_PRESETS.some(p => p.value === user.role);
    setModalRole(user.role);
    setModalRoleMode(isPreset ? 'preset' : 'custom');
    setModalCustomRole(isPreset ? '' : user.role);
    setModalCustomScope(user.permissions.customScope || '');
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
      const finalRole = (modalRoleMode === 'custom' ? modalCustomRole.trim() : modalRole) || 'Developer';
      const finalAvatar = editAvatar.trim() || getInitialsAvatar(editName, editGradient);
      const finalPermissions: Permissions = {
        ...modalPermissions,
        customScope: modalCustomScope.trim() || undefined,
      };

      updateUserPermissions(selectedUser.id, finalPermissions, finalRole);
      updateUserProfile(selectedUser.id, {
        name: editName.trim() || selectedUser.name,
        email: editEmail.trim() || selectedUser.email,
        avatar: finalAvatar,
        role: finalRole,
      });
      setSelectedUser(null);
    }
  };

  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) {
      addNotification('Access Denied: Only the Studio Owner can invite team members.', 'error');
      return;
    }
    if (!newMember.name.trim() || !newMember.email.trim()) {
      addNotification('Please enter both name and email.', 'error');
      return;
    }

    setIsSubmittingInvite(true);
    try {
      const effectiveRole = (newMemberRoleMode === 'custom' ? newMemberCustomRole.trim() : newMember.role) || 'Developer';
      const finalAvatar = customPhotoUrl.trim() || getInitialsAvatar(newMember.name, selectedGradient);

      const finalPermissions: Permissions = {
        ...newMemberPermissions,
        customScope: newMemberCustomScope.trim() || undefined,
      };

      const result = await inviteEmployee({
        name: newMember.name,
        email: newMember.email,
        role: effectiveRole,
        codeAccess: newMember.codeAccess,
        avatar: finalAvatar,
        permissions: finalPermissions,
      });

      const invitedUser = result.user || users.find(u => u.email.toLowerCase() === newMember.email.trim().toLowerCase());

      setNewMember({
        name: '',
        email: '',
        role: 'Developer',
        codeAccess: 'Full Access',
      });
      setNewMemberRoleMode('preset');
      setNewMemberCustomRole('');
      setNewMemberCustomScope('');
      setShowAddPermissions(false);
      setCustomPhotoUrl('');
      setShowCustomPhotoInput(false);
      setSelectedGradient('amethyst');
      setIsAddModalOpen(false);

      if (invitedUser) {
        setInviteModalUser(invitedUser);
      }
    } finally {
      setIsSubmittingInvite(false);
    }
  };

  const handleResend = async (userId: string) => {
    setResendingUserId(userId);
    try {
      await resendInvitation(userId);
    } finally {
      setResendingUserId(null);
    }
  };

  const handleAllowAndNotify = async (user: User) => {
    if (!isOwner) return;
    if (user.status !== 'Active') {
      toggleUserStatus(user.id);
    }
    await resendInvitation(user.id);
    setInviteModalUser(user);
    addNotification(`Authorization activated! Notification email dispatched to ${user.email}`, 'success');
  };

  type PermissionItemKey = 
    | 'addProjects' 
    | 'editProjects' 
    | 'uploadMedia' 
    | 'publishProjects' 
    | 'manageTeam' 
    | 'deleteProjects';

  const permissionItems: { key: PermissionItemKey; label: string; desc: string; ownerOnly?: boolean }[] = [
    { key: 'addProjects', label: 'Create Projects', desc: 'Can add and register new applications in the catalog' },
    { key: 'editProjects', label: 'Edit Projects', desc: 'Can update project names, descriptions, images, logos, technologies, and application links' },
    { key: 'uploadMedia', label: 'Upload Images', desc: 'Can upload and replace application logos, covers, screenshots, and visual media' },
    { key: 'publishProjects', label: 'Publish Projects', desc: 'Can publish projects directly to live showcase without owner review' },
    { key: 'deleteProjects', label: 'Delete Projects', desc: 'Permanently purge applications from database (Strictly Owner Only)', ownerOnly: true },
    { key: 'manageTeam', label: 'Manage Team Members', desc: 'Invite developers, grant/revoke permissions, and remove team members (Strictly Owner Only)', ownerOnly: true },
  ];

  if (!isOwner) {
    return (
      <div className="p-8 max-w-3xl mx-auto space-y-6">
        <div className="p-8 rounded-[32px] bg-[#0F0E11] border border-white/10 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Access Restricted to Studio Owner</h2>
          <p className="text-xs sm:text-sm text-white/60 max-w-md mx-auto leading-relaxed">
            Only the Studio Owner has permission to invite developers, configure permissions, or manage team members.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/admin/projects')}
              className="px-6 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs uppercase tracking-wider font-bold transition-all cursor-pointer shadow-lg shadow-violet-600/30"
            >
              Go to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              <span className="text-white/40 block font-mono text-[10px] uppercase">Studio Administrator:</span>
              <span className="font-bold text-white">{currentUser.name} <span className="text-amber-400 font-mono font-semibold">(👑 Studio Owner)</span></span>
            </div>
          </div>

          {/* Add Team Member Button (Owner Full Control) */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs uppercase tracking-wider font-bold shadow-xl shadow-violet-600/30 transition-all cursor-pointer active:scale-95"
          >
            <UserPlus className="w-4 h-4 text-white" />
            <span>+ Add Member</span>
          </button>
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
                <th className="py-4 px-4">Project Edit Password</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Last Active</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/80">
              {users.map((user) => {
                const isCurrent = user.id === currentUser.id;
                const invitation = teamInvitations?.find(i => i.email.toLowerCase() === user.email.toLowerCase());

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
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold ${
                        user.role === 'Owner' 
                          ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                          : user.role === 'Developer'
                          ? 'bg-violet-500/15 text-violet-300 border border-violet-500/30'
                          : user.role === 'Editor'
                          ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                          : user.role === 'Content Manager'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-violet-500/10 text-violet-200 border border-violet-500/30'
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    {/* Project Edit Password */}
                    <td className="py-4 px-4">
                      {user.role === 'Owner' ? (
                        <span className="text-[10px] font-mono text-amber-400/80 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                          👑 Master Owner Access
                        </span>
                      ) : user.accessPasscode ? (
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className="px-2.5 py-1 rounded-xl bg-violet-500/15 border border-violet-500/30 text-violet-300 font-bold text-[11px] tracking-wider">
                            {user.accessPasscode}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(user.accessPasscode!);
                              setCopiedPasscodeId(user.id);
                              addNotification(`Copied password "${user.accessPasscode}" to clipboard! Give it to ${user.name}.`, 'success');
                              setTimeout(() => setCopiedPasscodeId(null), 2000);
                            }}
                            className="p-1.5 rounded-lg bg-[#16151B] hover:bg-black border border-white/10 hover:border-violet-400/50 text-white/70 hover:text-white transition-all cursor-pointer"
                            title="Copy password to give to employee"
                          >
                            {copiedPasscodeId === user.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-violet-400" />}
                          </button>
                          {isOwner && (
                            <button
                              type="button"
                              onClick={() => {
                                const newCode = generateUserPasscode(user.id);
                                navigator.clipboard.writeText(newCode);
                                setCopiedPasscodeId(user.id);
                                setTimeout(() => setCopiedPasscodeId(null), 2000);
                              }}
                              className="p-1.5 rounded-lg bg-[#16151B] hover:bg-violet-500/20 border border-white/10 hover:border-violet-500/30 text-violet-300 transition-all cursor-pointer"
                              title="Generate a brand new password for this employee (revokes previous password)"
                            >
                              <RefreshCw className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ) : (
                        isOwner ? (
                          <button
                            type="button"
                            onClick={() => {
                              const newCode = generateUserPasscode(user.id);
                              navigator.clipboard.writeText(newCode);
                              setCopiedPasscodeId(user.id);
                              setTimeout(() => setCopiedPasscodeId(null), 2000);
                            }}
                            className="px-2.5 py-1 rounded-full bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/20 hover:border-violet-500/40 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer"
                            title="Generate an edit password for this employee"
                          >
                            <Key className="w-3 h-3 text-violet-400" />
                            <span>+ Generate Password</span>
                          </button>
                        ) : (
                          <span className="text-white/30 font-mono text-[10px]">—</span>
                        )
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold ${
                          user.status === 'Active' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : user.status === 'Pending Invitation'
                            ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                            : 'bg-white/5 text-white/40 border border-white/10'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            user.status === 'Active' ? 'bg-emerald-400' : user.status === 'Pending Invitation' ? 'bg-amber-400 animate-pulse' : 'bg-white/40'
                          }`} />
                          {user.status}
                        </span>

                        {/* Real Email delivery badge */}
                        {(user.status === 'Pending Invitation' || invitation) && (
                          <div className="text-[10px] font-mono flex items-center gap-1">
                            {invitation?.emailStatus === 'Sent' ? (
                              <span className="text-emerald-400 flex items-center gap-1">
                                <Check className="w-2.5 h-2.5" /> Email Sent
                              </span>
                            ) : invitation?.emailStatus === 'Failed' ? (
                              <span className="text-rose-400 flex items-center gap-1" title={invitation?.emailError || 'Check RESEND_API_KEY'}>
                                <AlertTriangle className="w-2.5 h-2.5" /> Email Failed
                              </span>
                            ) : (
                              <span className="text-white/40 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" /> Dispatching...
                              </span>
                            )}
                          </div>
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
                        
                        {isCurrent ? (
                          <span className="px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>You (Active)</span>
                          </span>
                        ) : (
                          <>
                            {/* Resend Invite button if pending or email failed */}
                            {isOwner && (user.status === 'Pending Invitation' || invitation?.emailStatus === 'Failed') && (
                              <button
                                type="button"
                                onClick={() => handleResend(user.id)}
                                disabled={resendingUserId === user.id}
                                className="px-3 py-1.5 rounded-full bg-violet-500/15 hover:bg-violet-500/25 text-violet-300 border border-violet-500/30 font-mono text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                                title={`Resend invitation email to ${user.email}`}
                              >
                                {resendingUserId === user.id ? (
                                  <span className="w-3 h-3 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Send className="w-3 h-3 text-violet-400" />
                                )}
                                <span>Resend Invite</span>
                              </button>
                            )}

                            {/* Permissions configuration */}
                            <button
                              onClick={() => handleOpenPermissions(user)}
                              disabled={!isOwner}
                              className={`p-2 rounded-full border text-xs font-semibold flex items-center transition-colors uppercase tracking-wider ${
                                isOwner
                                  ? 'bg-[#16151B] hover:bg-black text-white/80 hover:text-white border-white/10 hover:border-violet-400/50 cursor-pointer'
                                  : 'bg-white/5 text-white/30 border-white/5 cursor-not-allowed'
                              }`}
                              title={isOwner ? `Edit Role & Details for ${user.name}` : 'Only Studio Owner can configure members'}
                            >
                              <Sliders className="w-3.5 h-3.5 text-violet-400" />
                            </button>

                            {/* Remove Employee button (Only Owner has option to remove employee) */}
                            {isOwner ? (
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
                            )}
                          </>
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

            {/* Assigned Role: Categories vs Custom Role */}
            <div className="space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <label className="block font-mono text-xs font-bold uppercase tracking-wider text-white/70">
                  Assigned Role
                </label>
                <div className="flex items-center gap-1 bg-[#16151B] p-0.5 rounded-lg border border-white/10 text-[10px] font-mono self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setNewMemberRoleMode('preset')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      newMemberRoleMode === 'preset'
                        ? 'bg-violet-600 text-white font-bold shadow'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    Role Categories
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewMemberRoleMode('custom');
                      if (!newMemberCustomRole) setNewMemberCustomRole(newMember.role);
                    }}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                      newMemberRoleMode === 'custom'
                        ? 'bg-violet-600 text-white font-bold shadow'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    <Edit3 className="w-2.5 h-2.5" />
                    <span>Write Custom Role</span>
                  </button>
                </div>
              </div>

              {newMemberRoleMode === 'preset' ? (
                <select
                  value={newMember.role}
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setNewMemberRoleMode('custom');
                      setNewMemberCustomRole('');
                    } else {
                      setNewMember({ ...newMember, role: e.target.value });
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-violet-400 cursor-pointer"
                >
                  {ROLE_PRESETS.map((preset) => (
                    <option key={preset.value} value={preset.value} className="bg-[#0F0E11]">
                      {preset.label} — {preset.desc}
                    </option>
                  ))}
                  <option value="__custom__" className="bg-[#0F0E11] text-violet-400 font-bold">
                    ✏️ + Write Custom Role (Custom Title...)
                  </option>
                </select>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={newMemberCustomRole}
                      onChange={(e) => setNewMemberCustomRole(e.target.value)}
                      placeholder="e.g. Lead Flutter Engineer, UI/UX Designer, QA Specialist..."
                      className="w-full pl-3.5 pr-24 py-2.5 rounded-xl bg-[#16151B] border border-violet-500/50 text-xs font-semibold text-white placeholder:text-white/30 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setNewMemberRoleMode('preset');
                        setNewMember({ ...newMember, role: 'Developer' });
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-violet-400 hover:text-violet-300 underline cursor-pointer"
                    >
                      Use Category
                    </button>
                  </div>

                  {/* Suggestion Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-[10px] font-mono text-white/40">Quick Ideas:</span>
                    {ROLE_SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => setNewMemberCustomRole(suggestion)}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#16151B] border border-white/10 hover:border-violet-400/50 text-white/70 hover:text-white transition-colors cursor-pointer"
                      >
                        + {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Custom Permission Scope / Notes (Owner write on his way) */}
            <div className="space-y-1">
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-white/70">
                Custom Permission Scope / Notes (Optional)
              </label>
              <input
                type="text"
                value={newMemberCustomScope}
                onChange={(e) => setNewMemberCustomScope(e.target.value)}
                placeholder="e.g. Authorized to draft & review shoecheck catalog; restricted to staging branch"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-violet-400 transition-colors"
              />
              <p className="text-[10px] text-white/40 font-mono">
                Owner note specifying custom responsibilities, project boundaries, or staging scopes.
              </p>
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

            {/* Collapsible Granular Permissions Setup */}
            <div className="space-y-2 pt-1 border-t border-white/5">
              <button
                type="button"
                onClick={() => setShowAddPermissions(!showAddPermissions)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#16151B] border border-white/10 hover:border-violet-400/50 text-xs text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 font-mono text-xs">
                  <Sliders className="w-3.5 h-3.5 text-violet-400" />
                  <span className="font-bold">Initial Granular Permissions Policy</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-violet-400">
                  <span>{showAddPermissions ? 'Hide Toggles' : 'Configure (Optional)'}</span>
                  {showAddPermissions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </div>
              </button>

              {showAddPermissions && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-2xl bg-[#0F0E11] border border-white/10">
                  {permissionItems.map((item) => {
                    const effectiveRole = newMemberRoleMode === 'custom' ? newMemberCustomRole.trim() : newMember.role;
                    const isLockedToOwner = Boolean(item.ownerOnly && !isAdministrativeRole(effectiveRole));
                    const isChecked = isLockedToOwner ? false : Boolean(newMemberPermissions[item.key]);

                    return (
                      <label 
                        key={item.key}
                        className={`p-2.5 rounded-xl border transition-all flex items-start gap-2.5 ${
                          isLockedToOwner 
                            ? 'bg-[#16151B]/30 border-white/5 opacity-50 cursor-not-allowed'
                            : isChecked 
                            ? 'bg-[#16151B] border-violet-500/40 shadow-sm cursor-pointer' 
                            : 'bg-[#16151B]/40 border-white/5 opacity-60 cursor-pointer'
                        }`}
                      >
                        <input
                          type="checkbox"
                          disabled={isLockedToOwner}
                          checked={isChecked}
                          onChange={(e) => {
                            if (isLockedToOwner) return;
                            setNewMemberPermissions(prev => ({
                              ...prev,
                              [item.key]: e.target.checked
                            }));
                          }}
                          className="mt-0.5 w-3.5 h-3.5 rounded text-violet-500 focus:ring-violet-400 bg-[#16151B] border-white/20 disabled:opacity-40"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[11px] font-bold block ${isChecked ? 'text-white' : 'text-white/60'}`}>
                              {item.label}
                            </span>
                            {isLockedToOwner && (
                              <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                                <Lock className="w-2 h-2" /> Owner
                              </span>
                            )}
                          </div>
                          <p className="text-[9px] text-white/50 leading-tight">
                            {item.desc}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs space-y-1">
              <span className="font-mono text-xs text-white font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                <span>Studio Security Policy</span>
              </span>
              <p className="text-[11px] text-white/70 leading-relaxed">
                Members can draft, review, and collaborate according to their assigned permissions. The authority to delete catalog projects and remove members is permanently locked to the Studio Owner.
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
                disabled={isSubmittingInvite}
                className="px-6 py-2.5 rounded-full bg-black hover:bg-[#16151B] text-white border border-white/20 hover:border-violet-400/50 font-mono text-xs uppercase tracking-wider font-bold shadow-xl transition-all cursor-pointer flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmittingInvite ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
                    <span>Sending Invite...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5 text-violet-400" />
                    <span>Send Invite</span>
                  </>
                )}
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

            {/* Developer Access Password Section (Admin Generates Password to give employee) */}
            {selectedUser.role !== 'Owner' && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/40 via-[#16151B] to-[#16151B] border border-violet-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-300">
                      <Key className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">Employee Project Edit Password</span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase bg-violet-500/20 text-violet-300">
                          {selectedUser.accessPasscode ? 'Active' : 'Not Set'}
                        </span>
                      </div>
                      <p className="text-[10px] text-white/50 leading-tight mt-0.5">
                        Generate a password to give this employee so they can sign in and edit projects.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-xs text-white/50">Current Password:</span>
                    <span className="text-sm font-bold text-white px-3 py-1.5 rounded-xl bg-black border border-violet-500/40 tracking-wider">
                      {selectedUser.accessPasscode || 'No active password'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const newCode = generateUserPasscode(selectedUser.id);
                        setSelectedUser(prev => prev ? { ...prev, accessPasscode: newCode } : null);
                        navigator.clipboard.writeText(newCode);
                        setCopiedPasscodeId(selectedUser.id);
                        setTimeout(() => setCopiedPasscodeId(null), 2500);
                      }}
                      className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-mono text-[11px] uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-violet-600/20"
                      title="Generate a brand new password for this employee (revokes previous password)"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{selectedUser.accessPasscode ? 'Generate New Password' : 'Create Password'}</span>
                    </button>

                    {selectedUser.accessPasscode && (
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedUser.accessPasscode!);
                          setCopiedPasscodeId(selectedUser.id);
                          addNotification(`Copied password "${selectedUser.accessPasscode}" to clipboard!`, 'success');
                          setTimeout(() => setCopiedPasscodeId(null), 2500);
                        }}
                        className="px-3 py-2 rounded-xl bg-[#16151B] hover:bg-black text-white/80 hover:text-white border border-white/10 hover:border-violet-400/50 font-mono text-[11px] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
                        title="Copy password"
                      >
                        {copiedPasscodeId === selectedUser.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-violet-400" />}
                        <span>{copiedPasscodeId === selectedUser.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {selectedUser.accessPasscode && (
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between text-[11px] font-mono text-white/60">
                    <span className="truncate mr-2">
                      Give to employee: "Your Verado project edit access password is: {selectedUser.accessPasscode}"
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const shareText = `Here is your Verado dashboard access password to edit projects: ${selectedUser.accessPasscode}\nSign in here: https://verado-pi.vercel.app/admin/login`;
                        navigator.clipboard.writeText(shareText);
                        addNotification('Share message copied to clipboard!', 'success');
                      }}
                      className="text-[10px] text-violet-400 hover:text-violet-300 whitespace-nowrap underline cursor-pointer"
                    >
                      Copy Full Message
                    </button>
                  </div>
                )}
              </div>
            )}

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

            {/* Assigned Role: Categories vs Custom Role */}
            <div className="space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <label className="block font-mono text-xs font-bold uppercase tracking-wider text-white/70">
                  Assigned Role
                </label>
                <div className="flex items-center gap-1 bg-[#16151B] p-0.5 rounded-lg border border-white/10 text-[10px] font-mono self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setModalRoleMode('preset');
                      if (!ROLE_PRESETS.some(p => p.value === modalRole)) {
                        setModalRole('Developer');
                      }
                    }}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      modalRoleMode === 'preset'
                        ? 'bg-violet-600 text-white font-bold shadow'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    Role Categories
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setModalRoleMode('custom');
                      if (!modalCustomRole) setModalCustomRole(modalRole);
                    }}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                      modalRoleMode === 'custom'
                        ? 'bg-violet-600 text-white font-bold shadow'
                        : 'text-white/50 hover:text-white'
                    }`}
                  >
                    <Edit3 className="w-2.5 h-2.5" />
                    <span>Write Custom Role</span>
                  </button>
                </div>
              </div>

              {modalRoleMode === 'preset' ? (
                <select
                  value={modalRole}
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setModalRoleMode('custom');
                      setModalCustomRole('');
                    } else {
                      setModalRole(e.target.value);
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-violet-400 cursor-pointer"
                >
                  {ROLE_PRESETS.map((preset) => (
                    <option key={preset.value} value={preset.value} className="bg-[#0F0E11]">
                      {preset.label} — {preset.desc}
                    </option>
                  ))}
                  <option value="__custom__" className="bg-[#0F0E11] text-violet-400 font-bold">
                    ✏️ + Write Custom Role (Custom Title...)
                  </option>
                </select>
              ) : (
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={modalCustomRole}
                      onChange={(e) => setModalCustomRole(e.target.value)}
                      placeholder="e.g. Lead Flutter Engineer, UI/UX Designer, QA Specialist..."
                      className="w-full pl-3.5 pr-24 py-2.5 rounded-xl bg-[#16151B] border border-violet-500/50 text-xs font-semibold text-white placeholder:text-white/30 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setModalRoleMode('preset');
                        setModalRole('Developer');
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-violet-400 hover:text-violet-300 underline cursor-pointer"
                    >
                      Use Category
                    </button>
                  </div>

                  {/* Suggestion Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="text-[10px] font-mono text-white/40">Quick Ideas:</span>
                    {ROLE_SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => setModalCustomRole(suggestion)}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#16151B] border border-white/10 hover:border-violet-400/50 text-white/70 hover:text-white transition-colors cursor-pointer"
                      >
                        + {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Custom Permission Scope / Notes (Owner write on his way) */}
            <div className="space-y-1">
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-white/70">
                Custom Permission Scope / Notes (Optional)
              </label>
              <input
                type="text"
                value={modalCustomScope}
                onChange={(e) => setModalCustomScope(e.target.value)}
                placeholder="e.g. Authorized to draft & review shoecheck catalog; restricted to staging branch"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#16151B] border border-white/10 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-violet-400 transition-colors"
              />
              <p className="text-[10px] text-white/40 font-mono">
                Owner note specifying custom responsibilities, project boundaries, or staging scopes.
              </p>
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
                  const effectiveRole = modalRoleMode === 'custom' ? modalCustomRole.trim() : modalRole;
                  const isLockedToOwner = Boolean(item.ownerOnly && !isAdministrativeRole(effectiveRole));
                  const isChecked = isLockedToOwner ? false : Boolean(modalPermissions[item.key]);
                  const isDeployToggle = item.key === 'publishProjects';

                  return (
                    <label 
                      key={item.key}
                      className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                        isLockedToOwner
                          ? 'bg-[#16151B]/30 border-white/5 opacity-50 cursor-not-allowed'
                          : isChecked 
                          ? 'bg-[#16151B] border-violet-500/40 shadow-sm cursor-pointer' 
                          : 'bg-[#16151B]/40 border-white/5 opacity-60 cursor-pointer'
                      }`}
                    >
                      <input
                        type="checkbox"
                        disabled={isLockedToOwner}
                        checked={isChecked}
                        onChange={(e) => {
                          if (isLockedToOwner) return;
                          setModalPermissions(prev => ({
                            ...prev,
                            [item.key]: e.target.checked
                          }));
                        }}
                        className="mt-0.5 w-4 h-4 rounded text-violet-500 focus:ring-violet-400 bg-[#16151B] border-white/20 disabled:opacity-40"
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
                          {isLockedToOwner && (
                            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" /> Studio Owner Only
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
                className="px-6 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs uppercase tracking-wider font-bold shadow-xl shadow-violet-600/30 hover:shadow-violet-600/50 transition-all cursor-pointer active:scale-95 ring-1 ring-violet-400/30 flex items-center gap-2"
              >
                <span>Save Changes</span>
              </button>
            </div>

          </div>
        </Modal>
      )}

      {/* Email Invite Modal */}
      <EmailInviteModal
        isOpen={Boolean(inviteModalUser)}
        onClose={() => setInviteModalUser(null)}
        user={inviteModalUser}
        onAcceptAndLaunch={(user) => {
          loginAsUser(user.id);
          setInviteModalUser(null);
          navigate('/admin');
        }}
      />

    </div>
  );
};
