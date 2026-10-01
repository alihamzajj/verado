export type Platform = 'Android' | 'iOS' | 'Android + iOS';

export type ProjectCategory = 
  | 'AI & Computer Vision'
  | 'Health & Fitness'
  | 'Finance & Crypto'
  | 'Lifestyle & E-Commerce'
  | 'Productivity & Tools'
  | 'Travel & Navigation';

export interface Project {
  id: string;
  name: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  logo: string;
  coverImage: string;
  screenshots: string[];
  demoVideoUrl: string;
  features: string[];
  technologies: string[];
  platforms: Platform;
  category: ProjectCategory;
  featured: boolean;
  published: boolean;
  playStoreUrl: string;
  appStoreUrl: string;
  websiteUrl: string;
  githubUrl: string;
  rating: number;
  reviewsCount: number;
  downloads: string;
  version: string;
  size: string;
  minAndroid: string;
  minIos: string;
  lastUpdated: string;
  accentColor: string;
  badge?: string;
  isArchived?: boolean;
  reviewStatus?: 'approved' | 'pending_review' | 'draft';
  submittedBy?: string;
}

export type UserRole = 'Owner' | 'Developer' | 'Editor' | 'Content Manager';

export interface Permissions {
  viewProjects: boolean;
  addProjects: boolean;
  editProjects: boolean;
  deleteProjects?: boolean;
  codeEditor?: boolean;
  createBranch: boolean;
  previewChanges: boolean;
  mergeToProduction: boolean;
  deployProduction: boolean;
  manageTeam?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  status: 'Active' | 'Invited' | 'Suspended';
  codeAccess?: 'Full Access' | 'Read Only' | 'Locked';
  permissions: Permissions;
  lastActive: string;
}

export interface ActivityItem {
  id: string;
  user: string;
  avatar: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'deploy' | 'project' | 'code' | 'user';
}

export interface CodeFile {
  name: string;
  path: string;
  language: string;
  content: string;
}
