import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, User, Permissions, UserRole, ActivityItem, CodeFile } from '../types';
import { INITIAL_PROJECTS, INITIAL_USERS, INITIAL_ACTIVITIES, MOCK_CODE_FILES } from '../data/mockData';
import { isSupabaseConfigured, fetchProjectsFromSupabase, upsertProjectToSupabase, deleteProjectFromSupabase } from '../lib/supabase';
import { getInitialsAvatar } from '../lib/avatar';

interface NotificationItem {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

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
  addUser: (userData: { name: string; email: string; role: UserRole; avatar?: string; codeAccess?: 'Full Access' | 'Read Only' | 'Locked' }) => void;
  deleteUser: (userId: string) => void;
  updateUserPermissions: (userId: string, permissions: Partial<Permissions>, role?: UserRole) => void;
  
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
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  // Current logged in mock user (Default to Alex Rivera - Owner)
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

  // Code editor state
  const [codeFiles, setCodeFiles] = useState<CodeFile[]>(MOCK_CODE_FILES);
  const [activeFilePath, setActiveFilePath] = useState<string>('app/page.tsx');
  const [branches, setBranches] = useState<string[]>(['main', 'staging', 'feature/homepage-update']);
  const [currentBranch, setCurrentBranch] = useState<string>('main');

  // Notifications / toasts
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

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
      fetchProjectsFromSupabase().then((remoteProjects) => {
        if (remoteProjects && remoteProjects.length > 0) {
          setProjects(remoteProjects);
          setIsSupabaseLive(true);
        }
      });
    }
  }, []);

  // Sync to localStorage as local cache
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

  const currentUser = users.find(u => u.id === currentUserId) || users[0];

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
    const isOwner = currentUser.role === 'Owner';
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
    const isOwner = currentUser.role === 'Owner';
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
    if (currentUser.role !== 'Owner') {
      addNotification('Access Denied: Only the Studio Owner has authority to permanently delete projects.', 'error');
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
    if (currentUser.role !== 'Owner') {
      addNotification('Review Required: Only the Studio Owner can publish projects to the live showcase.', 'warning');
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

  const addUser = (userData: { name: string; email: string; role: UserRole; avatar?: string; codeAccess?: 'Full Access' | 'Read Only' | 'Locked' }) => {
    if (currentUser.role !== 'Owner') {
      addNotification('Access Denied: Only the Studio Owner can add team members.', 'error');
      return;
    }

    const trimmedName = userData.name.trim();
    const trimmedEmail = userData.email.trim();

    if (!trimmedName || !trimmedEmail) {
      addNotification('Name and email are required to add a team member.', 'error');
      return;
    }

    if (users.some(u => u.email.toLowerCase() === trimmedEmail.toLowerCase())) {
      addNotification('A team member with this email already exists.', 'error');
      return;
    }

    const newId = 'u-' + Math.random().toString(36).substring(2, 8);
    const isTargetOwner = userData.role === 'Owner';

    const permissions: Permissions = {
      viewProjects: true,
      addProjects: true,
      editProjects: true,
      createBranch: userData.role === 'Developer' || isTargetOwner,
      previewChanges: true,
      codeEditor: userData.role === 'Developer' || isTargetOwner,
      mergeToProduction: isTargetOwner,
      deployProduction: isTargetOwner,
      deleteProjects: isTargetOwner,
      manageTeam: isTargetOwner,
    };

    const assignedAvatar = userData.avatar || getInitialsAvatar(trimmedName);

    const newUser: User = {
      id: newId,
      name: trimmedName,
      email: trimmedEmail,
      avatar: assignedAvatar,
      role: userData.role,
      status: 'Active',
      codeAccess: userData.codeAccess || (userData.role === 'Developer' ? 'Full Access' : 'Read Only'),
      permissions,
      lastActive: 'Just joined',
    };

    setUsers(prev => [...prev, newUser]);

    addActivity({
      user: currentUser.name,
      avatar: currentUser.avatar,
      action: `Added ${newUser.name} as ${newUser.role} to the studio team`,
      target: newUser.role,
      type: 'user',
    });

    addNotification(`Team member "${newUser.name}" added successfully as ${newUser.role}!`, 'success');
  };

  const deleteUser = (userId: string) => {
    if (currentUser.role !== 'Owner') {
      addNotification('Access Denied: Only the Studio Owner can remove team members.', 'error');
      return;
    }

    if (userId === currentUser.id) {
      addNotification('Cannot remove your own active owner account.', 'error');
      return;
    }

    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    setUsers(prev => prev.filter(u => u.id !== userId));

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
    if (currentUser.role !== 'Owner') {
      addNotification('Access Denied: Only the Studio Owner can configure team permissions.', 'error');
      return;
    }

    const effectiveRole = newRole || users.find(u => u.id === userId)?.role || 'Developer';
    const isTargetOwner = effectiveRole === 'Owner';

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updatedPermissions: Permissions = { 
          ...u.permissions, 
          ...permissions,
          // Only Owner can ever have deleteProjects and manageTeam permissions
          deleteProjects: isTargetOwner,
          manageTeam: isTargetOwner,
        };
        
        const updatedUser: User = {
          ...u,
          role: effectiveRole,
          permissions: updatedPermissions,
        };
        return updatedUser;
      }
      return u;
    }));

    const targetUser = users.find(u => u.id === userId);
    addActivity({
      user: currentUser.name,
      avatar: currentUser.avatar,
      action: `Modified permissions for ${targetUser?.name || 'team member'}`,
      target: effectiveRole,
      type: 'user',
    });
    addNotification(`Permissions updated for ${targetUser?.name}`, 'success');
  };

  const addActivity = (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    const newItem: ActivityItem = {
      ...activity,
      id: 'act-' + Math.random().toString(36).substring(2, 8),
      timestamp: 'Just now',
    };
    setActivities(prev => [newItem, ...prev.slice(0, 15)]);
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
        updateUserPermissions,
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
