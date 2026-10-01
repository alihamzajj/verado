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

export type PredefinedUserRole = 'Owner' | 'Admin' | 'Developer' | 'Editor' | 'Content Manager';
export type UserRole = PredefinedUserRole | (string & {});

export interface Permissions {
  viewProjects: boolean;
  addProjects: boolean;       // Create new applications in catalog
  editProjects: boolean;      // Edit application specs, metadata, and URLs
  uploadMedia?: boolean;      // Upload and replace icons, covers, screenshots, videos
  publishProjects?: boolean;  // Publish projects live to showcase without owner review
  deployProduction: boolean;  // Full release and production pipeline
  deleteProjects?: boolean;   // Strictly Owner only
  manageTeam?: boolean;       // Strictly Owner only
  codeEditor?: boolean;
  createBranch?: boolean;
  previewChanges?: boolean;
  mergeToProduction?: boolean;
  customScope?: string;
}

export type AccountStatus = 'Active' | 'Deactivated' | 'Pending Invitation' | 'Suspended';
export type InvitationEmailStatus = 'Pending' | 'Sent' | 'Failed';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  status: AccountStatus;
  codeAccess?: 'Full Access' | 'Read Only' | 'Locked';
  permissions: Permissions;
  lastActive: string;
  emailStatus?: InvitationEmailStatus;
  invitationToken?: string;
  invitedAt?: string;
  invitedBy?: string;
  accessPasscode?: string;
  passcodeGeneratedAt?: string;
}

export interface TeamInvitation {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: Permissions;
  token: string;
  status: 'Pending' | 'Accepted' | 'Revoked' | 'Expired';
  emailStatus: InvitationEmailStatus;
  emailError?: string;
  createdAt: string;
  expiresAt: string;
  invitedBy: string;
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

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  subject?: string;
  category?: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

