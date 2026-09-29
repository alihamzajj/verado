import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, User, Permissions, UserRole, ActivityItem, CodeFile } from '../types';
import { INITIAL_PROJECTS, INITIAL_USERS, INITIAL_ACTIVITIES, MOCK_CODE_FILES } from '../data/mockData';
import { isSupabaseConfigured, fetchProjectsFromSupabase, upsertProjectToSupabase, deleteProjectFromSupabase } from '../lib/supabase';

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
  toggleProjectPublish: (id: string) => void;
  toggleProjectFeatured: (id: string) => void;
  
  users: User[];
  currentUser: User;
  setCurrentUser: (user: User) => void;
  loginAsUser: (userId: string) => void;
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

  // Dark/Light Theme
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(true);

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

  const toggleTheme = () => {
    setIsDarkTheme(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
      return next;
    });
  };

  const addProject = (projectData: Omit<Project, 'id' | 'lastUpdated' | 'rating' | 'reviewsCount' | 'downloads'>): Project => {
    const newId = projectData.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000);
    const createdProject: Project = {
      ...projectData,
      id: newId,
      rating: 5.0,
      reviewsCount: 1,
      downloads: '100+',
      lastUpdated: 'Just now',
    };
    setProjects(prev => [createdProject, ...prev]);
    upsertProjectToSupabase(createdProject);
    addActivity({
      user: currentUser.name,
      avatar: currentUser.avatar,
      action: `Created new project "${createdProject.name}"`,
      target: createdProject.platforms,
      type: 'project',
    });
    addNotification(`Project "${createdProject.name}" created successfully!`, 'success');
    return createdProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        const updated = { ...p, ...updates, lastUpdated: 'Just now' };
        upsertProjectToSupabase(updated);
        return updated;
      }
      return p;
    }));
    addActivity({
      user: currentUser.name,
      avatar: currentUser.avatar,
      action: `Updated project settings`,
      target: updates.name || id,
      type: 'project',
    });
    addNotification('Project details updated!', 'success');
  };

  const deleteProject = (id: string) => {
    const target = projects.find(p => p.id === id);
    setProjects(prev => prev.filter(p => p.id !== id));
    deleteProjectFromSupabase(id);
    if (target) {
      addActivity({
        user: currentUser.name,
        avatar: currentUser.avatar,
        action: `Deleted project "${target.name}"`,
        target: target.category,
        type: 'project',
      });
      addNotification(`Project "${target.name}" was removed.`, 'info');
    }
  };

  const toggleProjectPublish = (id: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        const newStatus = !p.published;
        const updated = { ...p, published: newStatus };
        upsertProjectToSupabase(updated);
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

  const updateUserPermissions = (userId: string, permissions: Partial<Permissions>, newRole?: UserRole) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updatedPermissions: Permissions = { ...u.permissions, ...permissions };
        
        const updatedUser: User = {
          ...u,
          role: newRole || u.role,
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
      target: newRole || targetUser?.role || 'User',
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
        toggleProjectPublish,
        toggleProjectFeatured,
        users,
        currentUser,
        setCurrentUser,
        loginAsUser,
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
