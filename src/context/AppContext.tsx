import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, User, Permissions, UserRole, ActivityItem, CodeFile, TeamInvitation, ContactInquiry } from '../types';
import { INITIAL_PROJECTS, INITIAL_USERS, INITIAL_ACTIVITIES, MOCK_CODE_FILES } from '../data/mockData';
import { 
  isSupabaseConfigured, 
  fetchProjectsFromSupabase, 
  upsertProjectToSupabase, 
  deleteProjectFromSupabase,
  fetchTeamMembersFromSupabase,
  upsertTeamMemberToSupabase,
  deleteTeamMemberFromSupabase,
  fetchTeamInvitationsFromSupabase,
  upsertTeamInvitationToSupabase,
  fetchActivityLogsFromSupabase,
  insertActivityLogToSupabase,
  fetchStudioSettings,
  fetchInquiriesFromSupabase,
  submitContactInquiry,
  markInquiryAsReadInSupabase,
  deleteInquiryFromSupabase
} from '../lib/supabase';
import { sendEmployeeInvitationEmail } from '../lib/email';
import { getInitialsAvatar } from '../lib/avatar';

interface NotificationItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
import { isAdministrativeRole, isAdministrativeUser } from '../lib/permissions';
export { isAdministrativeRole, isAdministrativeUser };

interface AppContextType {
  projects: Project[];
  addProject: (newProject: Omit<Project, 'id' | 'lastUpdated' | 'rating' | 'reviewsCount' | 'downloads'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  archiveProject: (id: string) => void;
  restoreProject: (id: string) => void;
  approveAndPublishProject: (id: string) => void;
  toggleProjectPublish: (id: string) => void;
  toggleProjectFeatured: (id: string) => void;
  
  users: User[];
  currentUser: User;
  setCurrentUser: (user: User) => void;
  loginAsUser: (userId: string) => void;
  addUser: (userData: { name: string; email: string; role: UserRole; avatar?: string; codeAccess?: 'Full Access' | 'Read Only' | 'Locked'; permissions?: Partial<Permissions> }) => User | null;
  deleteUser: (userId: string) => void;
  toggleUserStatus: (userId: string) => void;
  updateUserPermissions: (userId: string, permissions: Partial<Permissions>, role?: UserRole) => void;
  updateUserProfile: (userId: string, updates: { name?: string; email?: string; avatar?: string; role?: UserRole }) => void;
  
  teamInvitations: TeamInvitation[];
  inviteEmployee: (data: {
    name: string;
    email: string;
    role: UserRole;
    permissions?: Partial<Permissions>;
    avatar?: string;
    codeAccess?: 'Full Access' | 'Read Only' | 'Locked';
  }) => Promise<{ success: boolean; emailStatus: 'Sent' | 'Failed'; inviteUrl: string; error?: string; user?: User }>;
  resendInvitation: (userOrInvitationId: string) => Promise<{ success: boolean; emailStatus: 'Sent' | 'Failed'; error?: string }>;
  acceptInvitation: (token: string, password?: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  isAdministrativeUser: (user?: User | null) => boolean;

  generateUserPasscode: (userId: string) => string;
  revokeUserPasscode: (userId: string) => void;
  loginWithPasscode: (passcode: string, email?: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  verifyProjectEditPasscode: (passcode: string) => boolean;

  activities: ActivityItem[];
  addActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
  
  codeFiles: CodeFile[];
  activeFilePath: string;
  setActiveFilePath: (path: string) => void;
  updateFileContent: (path: string, content: string) => void;
  currentBranch: string;
  branches: string[];
  createBranch: (branchName: string) => void;
  switchBranch: (branchName: string) => void;
  
  notifications: NotificationItem[];
  addNotification: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeNotification: (id: string) => void;

  inquiries: ContactInquiry[];
  unreadInquiriesCount: number;
  addInquiry: (inquiryData: { name: string; email: string; subject?: string; category?: string; message: string }) => Promise<boolean>;
  markInquiryAsRead: (id: string) => void;
  deleteInquiry: (id: string) => void;

  isDarkTheme: boolean;
  toggleTheme: () => void;
  isSupabaseLive: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Projects state
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('apex_projects');
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  // Users state
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('apex_users');
      let parsed = saved ? JSON.parse(saved) : INITIAL_USERS;

      const storedEmail = localStorage.getItem('verado_admin_email');
      const storedName = localStorage.getItem('verado_owner_name');
      const storedAvatar = localStorage.getItem('verado_owner_avatar');

      // Ensure ali or primary admin is ALWAYS the Studio Owner
      const hasOwner = parsed.some((u: User) => u.role === 'Owner');
      parsed = parsed.map((u: User, idx: number) => {
        const isAli = u.email.toLowerCase().includes('alihamza') || u.name.toLowerCase() === 'ali';
        const isStored = Boolean(storedEmail && u.email.toLowerCase() === storedEmail.toLowerCase());
        const shouldBeOwner = u.role === 'Owner' || isAli || isStored || (!hasOwner && idx === 0);

        if (shouldBeOwner) {
          return {
            ...u,
            role: 'Owner' as const,
            status: 'Active' as const,
            email: storedEmail || u.email,
            name: storedName || u.name,
            avatar: storedAvatar || u.avatar,
            permissions: {
              ...u.permissions,
              viewProjects: true,
              addProjects: true,
              editProjects: true,
              deleteProjects: true,
              publishProjects: true,
              deployProduction: true,
              uploadMedia: true,
              manageTeam: true,
              codeEditor: true,
              createBranch: true,
              previewChanges: true,
              mergeToProduction: true,
            },
          };
        }
        return u;
      });

      return parsed;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Current logged in user is either Owner or an authorized Developer
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    try {
      return localStorage.getItem('apex_current_user_id') || 'u-1';
    } catch {
      return 'u-1';
    }
  });

  // Activities state
  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem('apex_activities');
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  // Team Invitations state
  const [teamInvitations, setTeamInvitations] = useState<TeamInvitation[]>(() => {
    try {
      const saved = localStorage.getItem('apex_invitations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Code editor state
  const [codeFiles, setCodeFiles] = useState<CodeFile[]>(MOCK_CODE_FILES);
  const [activeFilePath, setActiveFilePath] = useState<string>('app/page.tsx');
  const [branches, setBranches] = useState<string[]>(['main', 'staging', 'feature/homepage-update']);
  const [currentBranch, setCurrentBranch] = useState<string>('main');

  // Notifications / toasts
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Inquiries / Messages state
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('verado_inquiries');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'inq-sample-1',
          name: 'Sarah Jenkins',
          email: 'sarah.j@novalabs.io',
          subject: 'Enterprise Partnership & App Licensing',
          category: 'Enterprise Partnership',
          message: 'Hello Verado team, we love your mobile showcase portfolio. We are interested in licensing ShoeCheck AI and integrating your verification models into our platform. What are your commercial terms?',
          createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
          isRead: false,
        },
        {
          id: 'inq-sample-2',
          name: 'David Thorne',
          email: 'd.thorne@apexventures.co',
          subject: 'App Store Collaboration / Seed Investment',
          category: 'Investment',
          message: 'Hi Ali, impressive mobile architecture and clean UI execution. We would like to connect regarding your roadmap for Q4 and potential syndication opportunities.',
          createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
          isRead: false,
        }
      ];
    } catch {
      return [];
    }
  });


  // Dark Theme (Locked to luxury amethyst crystal design)
  const isDarkTheme = true;

  useEffect(() => {
    try {
      localStorage.removeItem('verado_theme');
    } catch {}
    document.documentElement.classList.remove('light');
    document.documentElement.classList.add('dark');
  }, []);

  // Cloud Database state
  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(isSupabaseConfigured());

  // Load from Supabase on start if configured
  useEffect(() => {
    if (isSupabaseConfigured()) {
      // 1. Projects
      fetchProjectsFromSupabase().then((remoteProjects) => {
        if (remoteProjects && remoteProjects.length > 0) {
          setProjects(remoteProjects);
          setIsSupabaseLive(true);
        }
      });

      // 2. Team Members
      fetchTeamMembersFromSupabase().then((remoteMembers) => {
        if (remoteMembers && remoteMembers.length > 0) {
          setUsers(prev => {
            const merged = [...remoteMembers];
            prev.forEach(p => {
              if (!merged.some(m => m.email.toLowerCase() === p.email.toLowerCase())) {
                merged.push(p);
              }
            });
            return merged;
          });
        }
      });

      // 3. Team Invitations
      fetchTeamInvitationsFromSupabase().then((remoteInvs) => {
        if (remoteInvs && remoteInvs.length > 0) {
          setTeamInvitations(remoteInvs);
        }
      });

      // 4. Activity Logs
      fetchActivityLogsFromSupabase().then((remoteActs) => {
        if (remoteActs && remoteActs.length > 0) {
          setActivities(remoteActs);
        }
      });

      // 5. Studio Settings
      fetchStudioSettings().then((remoteSettings) => {
        if (remoteSettings?.ownerEmail) {
          setUsers(prev => prev.map(u => u.role === 'Owner' ? { ...u, email: remoteSettings.ownerEmail } : u));
        }
      });

      // 6. Contact Inquiries
      fetchInquiriesFromSupabase().then((remoteInqs) => {
        if (remoteInqs && remoteInqs.length > 0) {
          setInquiries(prev => {
            const merged = [...remoteInqs];
            prev.forEach(p => {
              if (!merged.some(m => m.id === p.id)) {
                merged.push(p);
              }
            });
            return merged;
          });
        }
      });
    }
  }, []);

  // Sync to localStorage as local cache
  useEffect(() => {
    try {
      localStorage.setItem('verado_inquiries', JSON.stringify(inquiries));
    } catch (e) {
      console.warn('Could not save inquiries to localStorage', e);
    }
  }, [inquiries]);

  useEffect(() => {
    try {
      localStorage.setItem('apex_invitations', JSON.stringify(teamInvitations));
    } catch (e) {
      console.warn('Could not save invitations to localStorage', e);
    }
  }, [teamInvitations]);
  useEffect(() => {
    try {
      localStorage.setItem('apex_projects', JSON.stringify(projects));
    } catch (e) {
      console.warn('Could not save projects to localStorage', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem('apex_users', JSON.stringify(users));
    } catch (e) {
      console.warn('Could not save users to localStorage', e);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem('apex_current_user_id', currentUserId);
    } catch (e) {
      console.warn('Could not save currentUserId to localStorage', e);
    }
  }, [currentUserId]);

  // Resolve current active dashboard user (Owner or authenticated Developer)
  const currentUser = users.find(u => u.id === currentUserId) || users.find(u => u.role === 'Owner') || users[0];

  const addNotification = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleTheme = () => {};

  const addProject = (projectData: Omit<Project, 'id' | 'lastUpdated' | 'rating' | 'reviewsCount' | 'downloads'>): Project => {
    const isOwner = isAdministrativeUser(currentUser);
    const newId = projectData.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000);
    
    // Non-owner team submissions are created as Drafts pending Owner review
    const effectivePublished = isOwner ? Boolean(projectData.published) : false;
    const reviewStatus = isOwner ? 'approved' : 'pending_review';

    const createdProject: Project = {
      ...projectData,
      id: newId,
      published: effectivePublished,
      isArchived: false,
      reviewStatus,
      submittedBy: currentUser.name,
      rating: 5.0,
      reviewsCount: 1,
      downloads: '100+',
      lastUpdated: 'Just now',
    };

    setProjects(prev => [createdProject, ...prev]);
    upsertProjectToSupabase(createdProject);

    if (isOwner) {
      addActivity({
        user: currentUser.name,
        avatar: currentUser.avatar,
        action: `Created and ${effectivePublished ? 'published' : 'drafted'} project "${createdProject.name}"`,
        target: createdProject.platforms,
        type: 'project',
      });
      addNotification(`Project "${createdProject.name}" created successfully!`, 'success');
    } else {
      addActivity({
        user: currentUser.name,
        avatar: currentUser.avatar,
        action: `Submitted project "${createdProject.name}" for Owner review`,
        target: 'Pending Review',
        type: 'project',
      });
      addNotification(`Project "${createdProject.name}" saved as Draft. Submitted for Owner review & publishing.`, 'info');
    }

    return createdProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    const isOwner = isAdministrativeUser(currentUser);
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        const safeUpdates = { ...updates };
        // If non-owner edits, protect live publishing status
        if (!isOwner && safeUpdates.published === true && !p.published) {
          safeUpdates.published = false;
          safeUpdates.reviewStatus = 'pending_review';
        }
        const updated = { ...p, ...safeUpdates, lastUpdated: 'Just now' };
        upsertProjectToSupabase(updated);
        return updated;
      }
      return p;
    }));

    addActivity({
      user: currentUser.name,
      avatar: currentUser.avatar,
      action: `Updated project "${updates.name || id}"`,
      target: updates.category || 'Catalog Settings',
      type: 'project',
    });
    addNotification('Project details updated!', 'success');
  };

  // Archive Project (Soft Delete: hides from public, preserves data, reversible)
  const archiveProject = (id: string) => {
    if (currentUser.role !== 'Owner') {
      addNotification('Access Denied: Only the Studio Owner can archive projects.', 'error');
      return;
    }
    const target = projects.find(p => p.id === id);
    if (!target) return;

    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        const archived = { ...p, isArchived: true, published: false, lastUpdated: 'Archived just now' };
        upsertProjectToSupabase(archived);
        return archived;
      }
      return p;
    }));

    addActivity({
      user: currentUser.name,
      avatar: currentUser.avatar,
      action: `Archived project "${target.name}" (Safe Storage)`,
      target: 'Catalog Archive',
      type: 'project',
    });
    addNotification(`Project "${target.name}" archived. Hidden from public showcase but safely preserved.`, 'info');
  };

  // Restore Project from Archive
  const restoreProject = (id: string) => {
    if (currentUser.role !== 'Owner') {
      addNotification('Access Denied: Only the Studio Owner can restore projects.', 'error');
      return;
    }
    const target = projects.find(p => p.id === id);
    if (!target) return;

    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        const restored = { ...p, isArchived: false, published: false, reviewStatus: 'draft' as const, lastUpdated: 'Restored just now' };
        upsertProjectToSupabase(restored);
        return restored;
      }
      return p;
    }));

    addActivity({
      user: currentUser.name,
      avatar: currentUser.avatar,
      action: `Restored project "${target.name}" from archive`,
      target: 'Catalog Drafts',
      type: 'project',
    });
    addNotification(`Project "${target.name}" restored to drafts. Ready for review.`, 'success');
  };

  // Approve & Publish Project (1-click Owner action)
  const approveAndPublishProject = (id: string) => {
    if (currentUser.role !== 'Owner') {
      addNotification('Access Denied: Only the Studio Owner can approve and publish projects.', 'error');
      return;
    }
    const target = projects.find(p => p.id === id);
    if (!target) return;

    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        const approved = { ...p, published: true, isArchived: false, reviewStatus: 'approved' as const, lastUpdated: 'Published just now' };
        upsertProjectToSupabase(approved);
        return approved;
      }
      return p;
    }));

    addActivity({
      user: currentUser.name,
      avatar: currentUser.avatar,
      action: `Approved & published project "${target.name}" to live showcase`,
      target: 'Live Showcase',
      type: 'deploy',
    });
    addNotification(`Project "${target.name}" is now LIVE on the public showcase!`, 'success');
  };

  // Permanent Delete (Hard Delete: Purges from cloud & state)
  const deleteProject = (id: string) => {
    if (!isAdministrativeUser(currentUser)) {
      addNotification('Access Denied: Only the Studio Owner or Admin has authority to permanently delete projects.', 'error');
      return;
    }
    const target = projects.find(p => p.id === id);
    setProjects(prev => prev.filter(p => p.id !== id));
    deleteProjectFromSupabase(id);
    if (target) {
      addActivity({
        user: currentUser.name,
        avatar: currentUser.avatar,
        action: `Permanently deleted project "${target.name}"`,
        target: target.category,
        type: 'project',
      });
      addNotification(`Project "${target.name}" was permanently deleted by Owner.`, 'info');
    }
  };

  const toggleProjectPublish = (id: string) => {
    if (!isAdministrativeUser(currentUser)) {
      addNotification('Review Required: Only the Studio Owner or Admin can publish projects to the live showcase.', 'warning');
      return;
    }
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        const newStatus = !p.published;
        const updated = { 
          ...p, 
          published: newStatus, 
          reviewStatus: newStatus ? ('approved' as const) : ('draft' as const),
          lastUpdated: 'Just now'
        };
        upsertProjectToSupabase(updated);
        addActivity({
          user: currentUser.name,
          avatar: currentUser.avatar,
          action: `${newStatus ? 'Published' : 'Unpublished'} project "${p.name}"`,
          target: newStatus ? 'Live Showcase' : 'Draft',
          type: 'project',
        });
        addNotification(`Project "${p.name}" is now ${newStatus ? 'Published' : 'Draft'}`, 'info');
        return updated;
      }
      return p;
    }));
  };

  const toggleProjectFeatured = (id: string) => {
    if (!isAdministrativeUser(currentUser)) {
      addNotification('Featured control restricted to Studio Owner or Admin.', 'warning');
      return;
    }
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        const newFeatured = !p.featured;
        const updated = { ...p, featured: newFeatured };
        upsertProjectToSupabase(updated);
        addNotification(`"${p.name}" ${newFeatured ? 'marked as Featured' : 'removed from Featured'}`, 'info');
        return updated;
      }
      return p;
    }));
  };

  const setCurrentUser = (user: User) => {
    setCurrentUserId(user.id);
    addNotification(`Switched persona to ${user.name} (${user.role})`, 'info');
  };

  const loginAsUser = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setCurrentUserId(found.id);
      addNotification(`Signed in as ${found.name} (${found.role})`, 'success');
    }
  };

  const inviteEmployee = async (data: {
    name: string;
    email: string;
    role: UserRole;
    permissions?: Partial<Permissions>;
    avatar?: string;
    codeAccess?: 'Full Access' | 'Read Only' | 'Locked';
  }): Promise<{ success: boolean; emailStatus: 'Sent' | 'Failed'; inviteUrl: string; error?: string; user?: User }> => {
    if (!isAdministrativeUser(currentUser)) {
      addNotification('Access Denied: Only Studio Owner or Admin can invite team members.', 'error');
      return { success: false, emailStatus: 'Failed', inviteUrl: '', error: 'Owner or Admin authority required' };
    }

    const trimmedName = data.name.trim();
    const trimmedEmail = data.email.trim();

    if (!trimmedName || !trimmedEmail) {
      addNotification('Employee name and email address are required.', 'error');
      return { success: false, emailStatus: 'Failed', inviteUrl: '', error: 'Name and email are required' };
    }

    const isTargetAdmin = isAdministrativeRole(data.role);

    // Granular permissions with strict Owner/Admin locks
    const finalPermissions: Permissions = {
      viewProjects: true,
      addProjects: data.role === 'Developer' || data.role === 'Content Manager' || isTargetAdmin,
      editProjects: true,
      uploadMedia: true,
      publishProjects: isTargetAdmin,
      deployProduction: isTargetAdmin,
      codeEditor: data.role === 'Developer' || isTargetAdmin,
      createBranch: data.role === 'Developer' || isTargetAdmin,
      previewChanges: true,
      mergeToProduction: isTargetAdmin,
      ...data.permissions,
      // Security policy: deleteProjects and manageTeam are strictly reserved for Owner and Admin
      deleteProjects: isTargetAdmin,
      manageTeam: isTargetAdmin,
    };

    const token = 'inv_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    const assignedAvatar = data.avatar || getInitialsAvatar(trimmedName);

    const newInvitation: TeamInvitation = {
      id: 'inv-' + Math.random().toString(36).substring(2, 8),
      email: trimmedEmail,
      name: trimmedName,
      role: data.role,
      permissions: finalPermissions,
      token,
      status: 'Pending',
      emailStatus: 'Pending',
      invitedBy: currentUser.name,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    // Send real invitation email via Resend or Supabase Edge Function
    const emailResult = await sendEmployeeInvitationEmail(newInvitation, currentUser.name);

    newInvitation.emailStatus = emailResult.status;
    newInvitation.emailError = emailResult.error;

    // Create or update member in team list with 'Pending Invitation' status
    const existingIndex = users.findIndex(u => u.email.toLowerCase() === trimmedEmail.toLowerCase());
    let targetUser: User;

    if (existingIndex >= 0) {
      targetUser = {
        ...users[existingIndex],
        name: trimmedName,
        role: data.role,
        avatar: assignedAvatar || users[existingIndex].avatar,
        status: 'Pending Invitation',
        permissions: finalPermissions,
        codeAccess: data.codeAccess || users[existingIndex].codeAccess,
        emailStatus: emailResult.status,
        invitationToken: token,
        invitedAt: new Date().toISOString(),
        invitedBy: currentUser.name,
      };
      setUsers(prev => prev.map((u, i) => i === existingIndex ? targetUser : u));
    } else {
      targetUser = {
        id: 'u-' + Math.random().toString(36).substring(2, 8),
        name: trimmedName,
        email: trimmedEmail,
        avatar: assignedAvatar,
        role: data.role,
        status: 'Pending Invitation',
        codeAccess: data.codeAccess || (data.role === 'Developer' ? 'Full Access' : 'Read Only'),
        permissions: finalPermissions,
        lastActive: 'Invited just now',
        emailStatus: emailResult.status,
        invitationToken: token,
        invitedAt: new Date().toISOString(),
        invitedBy: currentUser.name,
      };
      setUsers(prev => [...prev, targetUser]);
    }

    setTeamInvitations(prev => [newInvitation, ...prev.filter(inv => inv.email.toLowerCase() !== trimmedEmail.toLowerCase())]);

    // Persist to Supabase
    upsertTeamMemberToSupabase(targetUser);
    upsertTeamInvitationToSupabase(newInvitation);

    addActivity({
      user: currentUser.name,
      avatar: currentUser.avatar,
      action: `Invited ${targetUser.name} (${targetUser.email}) as ${targetUser.role}`,
      target: targetUser.role,
      type: 'user',
    });

    if (emailResult.success) {
      addNotification(`Invitation email dispatched via Resend to ${trimmedEmail}!`, 'success');
    } else {
      addNotification(`Invitation created for ${trimmedEmail}. Email status: Failed (${emailResult.error || 'Configure RESEND_API_KEY'})`, 'warning');
    }

    return {
      success: true,
      emailStatus: emailResult.status,
      inviteUrl: emailResult.inviteUrl,
      error: emailResult.error,
      user: targetUser,
    };
  };

  const resendInvitation = async (userOrInvitationId: string): Promise<{ success: boolean; emailStatus: 'Sent' | 'Failed'; error?: string }> => {
    if (!isAdministrativeUser(currentUser)) {
      addNotification('Access Denied: Only Studio Owner or Admin can resend invitations.', 'error');
      return { success: false, emailStatus: 'Failed', error: 'Owner or Admin authority required' };
    }

    const targetUser = users.find(u => u.id === userOrInvitationId || u.email.toLowerCase() === userOrInvitationId.toLowerCase());
    if (!targetUser) {
      addNotification('Employee not found.', 'error');
      return { success: false, emailStatus: 'Failed', error: 'User not found' };
    }

    const token = targetUser.invitationToken || ('inv_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36));

    const invitation: TeamInvitation = {
      id: 'inv-' + Math.random().toString(36).substring(2, 8),
      email: targetUser.email,
      name: targetUser.name,
      role: targetUser.role,
      permissions: targetUser.permissions,
      token,
      status: 'Pending',
      emailStatus: 'Pending',
      invitedBy: currentUser.name,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const emailResult = await sendEmployeeInvitationEmail(invitation, currentUser.name);

    setUsers(prev => prev.map(u => u.id === targetUser.id ? { ...u, emailStatus: emailResult.status, invitationToken: token } : u));
    setTeamInvitations(prev => [{ ...invitation, emailStatus: emailResult.status, emailError: emailResult.error }, ...prev.filter(i => i.email !== targetUser.email)]);

    upsertTeamMemberToSupabase({ ...targetUser, emailStatus: emailResult.status, invitationToken: token });
    upsertTeamInvitationToSupabase({ ...invitation, emailStatus: emailResult.status, emailError: emailResult.error });

    addActivity({
      user: currentUser.name,
      avatar: currentUser.avatar,
      action: `Resent invitation email to ${targetUser.email}`,
      target: targetUser.role,
      type: 'user',
    });

    if (emailResult.success) {
      addNotification(`Invitation email successfully resent to ${targetUser.email}!`, 'success');
    } else {
      addNotification(`Resend attempted for ${targetUser.email}: ${emailResult.error}`, 'warning');
    }

    return { success: emailResult.success, emailStatus: emailResult.status, error: emailResult.error };
  };

  const acceptInvitation = async (token: string, password?: string): Promise<{ success: boolean; error?: string; user?: User }> => {
    const matchedUser = users.find(u => u.invitationToken === token);
    const matchedInvite = teamInvitations.find(i => i.token === token);

    if (!matchedUser && !matchedInvite) {
      return { success: false, error: 'Invalid or expired invitation token.' };
    }

    const userEmail = matchedUser?.email || matchedInvite?.email;
    const target = users.find(u => u.email.toLowerCase() === userEmail?.toLowerCase());

    if (!target) {
      return { success: false, error: 'Invited employee record not found.' };
    }

    const activatedUser: User = {
      ...target,
      status: 'Active',
      lastActive: 'Just now',
    };

    setUsers(prev => prev.map(u => u.id === target.id ? activatedUser : u));
    setTeamInvitations(prev => prev.map(inv => inv.token === token ? { ...inv, status: 'Accepted' } : inv));

    localStorage.setItem('verado_admin_auth', 'true');
    setCurrentUserId(activatedUser.id);

    upsertTeamMemberToSupabase(activatedUser);
    if (matchedInvite) {
      upsertTeamInvitationToSupabase({ ...matchedInvite, status: 'Accepted' });
    }

    addActivity({
      user: activatedUser.name,
      avatar: activatedUser.avatar,
      action: `Accepted team invitation and entered Studio Dashboard as ${activatedUser.role}`,
      target: activatedUser.role,
      type: 'user',
    });

    addNotification(`Welcome, ${activatedUser.name}! Your account has been activated with ${activatedUser.role} access.`, 'success');
    return { success: true, user: activatedUser };
  };

  const generateUserPasscode = (userId: string): string => {
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const newPasscode = `VRD-${randomDigits}`;

    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return '';

    const updatedUser: User = {
      ...targetUser,
      accessPasscode: newPasscode,
      passcodeGeneratedAt: new Date().toISOString(),
    };

    setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
    upsertTeamMemberToSupabase(updatedUser);

    addActivity({
      user: currentUser.name,
      avatar: currentUser.avatar,
      action: `Generated new access password for ${targetUser.name}`,
      target: targetUser.role,
      type: 'user',
    });

    addNotification(`New access password generated for ${targetUser.name}: ${newPasscode}`, 'success');
    return newPasscode;
  };

  const revokeUserPasscode = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    const updatedUser: User = {
      ...targetUser,
      accessPasscode: undefined,
      passcodeGeneratedAt: undefined,
    };

    setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
    upsertTeamMemberToSupabase(updatedUser);

    addActivity({
      user: currentUser.name,
      avatar: currentUser.avatar,
      action: `Revoked access password for ${targetUser.name}`,
      target: targetUser.role,
      type: 'user',
    });

    addNotification(`Access password for ${targetUser.name} has been revoked.`, 'info');
  };

  const loginWithPasscode = async (passcode: string, email?: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    const cleanPass = passcode.trim().toUpperCase();
    if (!cleanPass) {
      return { success: false, error: 'Please enter an access password.' };
    }

    let matched = users.find(u => u.accessPasscode && u.accessPasscode.toUpperCase() === cleanPass);
    if (!matched && email) {
      const byEmail = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
      if (byEmail?.accessPasscode && byEmail.accessPasscode.toUpperCase() === cleanPass) {
        matched = byEmail;
      }
    }

    if (!matched) {
      return { success: false, error: 'Invalid or expired access password. Ask the Studio Owner for a new password.' };
    }

    if (matched.status === 'Deactivated' || matched.status === 'Suspended') {
      return { success: false, error: 'This employee account is deactivated. Contact the Studio Owner.' };
    }

    const activeMember: User = { ...matched, status: 'Active', lastActive: 'Just now' };
    setUsers(prev => prev.map(u => u.id === matched!.id ? activeMember : u));
    upsertTeamMemberToSupabase(activeMember);

    localStorage.setItem('verado_admin_auth', 'true');
    localStorage.setItem('apex_current_user_id', activeMember.id);
    setCurrentUserId(activeMember.id);

    addActivity({
      user: activeMember.name,
      avatar: activeMember.avatar,
      action: `Signed in with Admin-generated access password`,
      target: activeMember.role,
      type: 'user',
    });

    addNotification(`Access granted! Signed in as ${activeMember.name} (${activeMember.role}).`, 'success');
    return { success: true, user: activeMember };
  };

  const verifyProjectEditPasscode = (passcode: string): boolean => {
    const cleanPass = passcode.trim().toUpperCase();
    if (!cleanPass) return false;

    const matched = users.find(u => u.accessPasscode && u.accessPasscode.toUpperCase() === cleanPass);
    if (matched) {
      addNotification(`Access verified for ${matched.name}! Project edit authorized.`, 'success');
      return true;
    }
    return false;
  };

  const addUser = (userData: { name: string; email: string; role: UserRole; avatar?: string; codeAccess?: 'Full Access' | 'Read Only' | 'Locked'; permissions?: Partial<Permissions> }): User | null => {
    inviteEmployee(userData);
    const found = users.find(u => u.email.toLowerCase() === userData.email.trim().toLowerCase());
    return found || null;
  };

  const toggleUserStatus = (userId: string) => {
    if (!isAdministrativeUser(currentUser)) {
      addNotification('Access Denied: Only Studio Owner or Admin can change member status.', 'error');
      return;
    }

    const target = users.find(u => u.id === userId);
    if (!target) return;
    if (target.id === currentUser.id) {
      addNotification('Cannot deactivate your own active administrative account.', 'error');
      return;
    }

    const newStatus = target.status === 'Active' ? 'Deactivated' : 'Active';
    const updatedUser: User = { ...target, status: newStatus };

    setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
    upsertTeamMemberToSupabase(updatedUser);

    if (newStatus === 'Active') {
      addNotification(`Activated ${target.name}! Dashboard access and permissions enabled.`, 'success');
      addActivity({
        user: currentUser.name,
        avatar: currentUser.avatar,
        action: `Activated employee account for "${target.name}" (${target.role})`,
        target: target.role,
        type: 'user',
      });
    } else {
      addNotification(`Deactivated ${target.name}. Studio dashboard access disabled.`, 'info');
      addActivity({
        user: currentUser.name,
        avatar: currentUser.avatar,
        action: `Deactivated employee account for "${target.name}"`,
        target: target.role,
        type: 'user',
      });
    }
  };

  const deleteUser = (userId: string) => {
    if (!isAdministrativeUser(currentUser)) {
      addNotification('Access Denied: Only Studio Owner or Admin can remove team members.', 'error');
      return;
    }

    if (userId === currentUser.id) {
      addNotification('Cannot remove your own active administrative account.', 'error');
      return;
    }

    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    setUsers(prev => prev.filter(u => u.id !== userId));
    setTeamInvitations(prev => prev.filter(inv => inv.email.toLowerCase() !== targetUser.email.toLowerCase()));

    deleteTeamMemberFromSupabase(targetUser.id);
    deleteTeamMemberFromSupabase(targetUser.email);

    addActivity({
      user: currentUser.name,
      avatar: currentUser.avatar,
      action: `Removed team member "${targetUser.name}" (${targetUser.role})`,
      target: targetUser.email,
      type: 'user',
    });

    addNotification(`Team member "${targetUser.name}" was removed from the studio team.`, 'info');
  };

  const updateUserPermissions = (userId: string, permissions: Partial<Permissions>, newRole?: UserRole) => {
    if (!isAdministrativeUser(currentUser)) {
      addNotification('Access Denied: Only Studio Owner or Admin can configure team permissions.', 'error');
      return;
    }

    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    const effectiveRole = newRole || targetUser.role;
    const isTargetAdmin = isAdministrativeRole(effectiveRole);

    const updatedPermissions: Permissions = { 
      ...targetUser.permissions, 
      ...permissions,
      deleteProjects: isTargetAdmin,
      manageTeam: isTargetAdmin,
    };
    
    const updatedUser: User = {
      ...targetUser,
      role: effectiveRole,
      permissions: updatedPermissions,
    };

    setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
    upsertTeamMemberToSupabase(updatedUser);

    addActivity({
      user: currentUser.name,
      avatar: currentUser.avatar,
      action: `Modified permissions for ${targetUser.name} (${effectiveRole})`,
      target: effectiveRole,
      type: 'user',
    });
    addNotification(`Permissions updated for ${targetUser.name}`, 'success');
  };

  const updateUserProfile = (userId: string, updates: { name?: string; email?: string; avatar?: string; role?: UserRole }) => {
    const isOwnerOrAdmin = isAdministrativeUser(currentUser);
    const isSelf = currentUser.id === userId;

    if (!isOwnerOrAdmin && !isSelf) {
      addNotification('Access Denied: You can only edit your own profile.', 'error');
      return;
    }

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updatedName = updates.name !== undefined ? updates.name.trim() : u.name;
        const updatedEmail = updates.email !== undefined ? updates.email.trim() : u.email;
        const updatedAvatar = updates.avatar !== undefined ? updates.avatar : u.avatar;
        const updatedRole = (isOwnerOrAdmin && updates.role) ? updates.role : u.role;

        const updated: User = {
          ...u,
          name: updatedName || u.name,
          email: updatedEmail || u.email,
          avatar: updatedAvatar || u.avatar,
          role: updatedRole,
        };

        if (u.role === 'Owner' || updatedRole === 'Owner') {
          if (updatedEmail) localStorage.setItem('verado_admin_email', updatedEmail);
          if (updatedName) localStorage.setItem('verado_owner_name', updatedName);
          if (updatedAvatar) localStorage.setItem('verado_owner_avatar', updatedAvatar);
        }

        upsertTeamMemberToSupabase(updated);
        return updated;
      }
      return u;
    }));

    addActivity({
      user: updates.name || currentUser.name,
      avatar: updates.avatar || currentUser.avatar,
      action: `Updated profile details`,
      target: updates.email || 'Profile Settings',
      type: 'user',
    });

    addNotification('Profile updated successfully!', 'success');
  };

  const addActivity = (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    const newItem: ActivityItem = {
      ...activity,
      id: 'act-' + Math.random().toString(36).substring(2, 8),
      timestamp: 'Just now',
    };
    setActivities(prev => [newItem, ...prev.slice(0, 49)]);
    insertActivityLogToSupabase(activity);
  };

  const updateFileContent = (path: string, content: string) => {
    setCodeFiles(prev => prev.map(f => f.path === path ? { ...f, content } : f));
  };

  const createBranch = (branchName: string) => {
    const sanitized = branchName.trim().replace(/\s+/g, '-');
    if (!branches.includes(sanitized)) {
      setBranches(prev => [...prev, sanitized]);
      setCurrentBranch(sanitized);
      addActivity({
        user: currentUser.name,
        avatar: currentUser.avatar,
        action: `Created new branch "${sanitized}"`,
        target: sanitized,
        type: 'code',
      });
      addNotification(`Branch created: ${sanitized}`, 'success');
    }
  };

  const switchBranch = (branchName: string) => {
    setCurrentBranch(branchName);
    addNotification(`Switched branch to ${branchName}`, 'info');
  };

  const unreadInquiriesCount = inquiries.filter(i => !i.isRead).length;

  const addInquiry = async (inquiryData: { name: string; email: string; subject?: string; category?: string; message: string }): Promise<boolean> => {
    const newInquiry: ContactInquiry = {
      id: 'inq-' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      name: inquiryData.name.trim(),
      email: inquiryData.email.trim(),
      subject: inquiryData.subject || inquiryData.category || 'General Inquiry',
      category: inquiryData.category || inquiryData.subject,
      message: inquiryData.message.trim(),
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    setInquiries(prev => [newInquiry, ...prev]);
    submitContactInquiry(newInquiry);

    addActivity({
      user: newInquiry.name,
      avatar: getInitialsAvatar(newInquiry.name),
      action: `Sent a new message: "${newInquiry.subject}"`,
      target: 'Customer Inquiries',
      type: 'user',
    });

    addNotification(`New customer inquiry received from ${newInquiry.name}!`, 'info');
    return true;
  };

  const markInquiryAsRead = (id: string) => {
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, isRead: true } : i));
    markInquiryAsReadInSupabase(id);
  };

  const deleteInquiry = (id: string) => {
    const target = inquiries.find(i => i.id === id);
    setInquiries(prev => prev.filter(i => i.id !== id));
    deleteInquiryFromSupabase(id);
    if (target) {
      addNotification(`Message from ${target.name} deleted.`, 'info');
    }
  };

  return (
    <AppContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        deleteProject,
        archiveProject,
        restoreProject,
        approveAndPublishProject,
        toggleProjectPublish,
        toggleProjectFeatured,
        users,
        currentUser,
        setCurrentUser,
        loginAsUser,
        addUser,
        deleteUser,
        toggleUserStatus,
        updateUserPermissions,
        updateUserProfile,
        teamInvitations,
        inviteEmployee,
        resendInvitation,
        acceptInvitation,
        isAdministrativeUser,
        generateUserPasscode,
        revokeUserPasscode,
        loginWithPasscode,
        verifyProjectEditPasscode,
        activities,
        addActivity,
        codeFiles,
        activeFilePath,
        setActiveFilePath,
        updateFileContent,
        currentBranch,
        branches,
        createBranch,
        switchBranch,
        notifications,
        addNotification,
        removeNotification,
        inquiries,
        unreadInquiriesCount,
        addInquiry,
        markInquiryAsRead,
        deleteInquiry,
        isDarkTheme,
        toggleTheme,
        isSupabaseLive,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
