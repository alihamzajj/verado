import { createClient } from '@supabase/supabase-js';
import { Project, User, TeamInvitation, ActivityItem, ContactInquiry } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your') &&
    !supabaseAnonKey.includes('your') &&
    !supabaseUrl.includes('placeholder')
  );
};

// Safe fallback URL & key so createClient never throws an invalid URL exception
const safeUrl = isSupabaseConfigured() ? supabaseUrl : 'https://placeholder.supabase.co';
const safeKey = isSupabaseConfigured() ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder_key';

export const supabase = createClient(safeUrl, safeKey);

// Database helpers for Projects
export const fetchProjectsFromSupabase = async (): Promise<Project[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch error:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map((item: any) => ({
        id: item.id,
        name: item.name,
        tagline: item.tagline || '',
        shortDescription: item.short_description || '',
        fullDescription: item.full_description || '',
        logo: item.logo || '',
        coverImage: item.cover_image || '',
        screenshots: item.screenshots || [],
        demoVideoUrl: item.demo_video_url || '',
        features: item.features || [],
        technologies: item.technologies || [],
        platforms: item.platforms || 'Android + iOS',
        category: item.category || 'AI & Computer Vision',
        featured: Boolean(item.featured),
        published: Boolean(item.published),
        playStoreUrl: item.play_store_url || '',
        appStoreUrl: item.app_store_url || '',
        websiteUrl: item.website_url || '',
        githubUrl: item.github_url || '',
        rating: Number(item.rating) || 4.8,
        reviewsCount: Number(item.reviews_count) || 1200,
        downloads: item.downloads || '100k+',
        version: item.version || '1.0.0',
        size: item.size || '45 MB',
        minAndroid: item.min_android || 'Android 10+',
        minIos: item.min_ios || 'iOS 16+',
        lastUpdated: item.last_updated || 'Recently',
        accentColor: item.accent_color || '#38bdf8',
        badge: item.badge || undefined,
      }));
    }
    return null;
  } catch (err) {
    console.warn('Error connecting to Supabase:', err);
    return null;
  }
};

export const upsertProjectToSupabase = async (project: Project): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const dbPayload = {
      id: project.id,
      name: project.name,
      tagline: project.tagline,
      short_description: project.shortDescription,
      full_description: project.fullDescription,
      logo: project.logo,
      cover_image: project.coverImage,
      screenshots: project.screenshots,
      demo_video_url: project.demoVideoUrl,
      features: project.features,
      technologies: project.technologies,
      platforms: project.platforms,
      category: project.category,
      featured: project.featured,
      published: project.published,
      play_store_url: project.playStoreUrl,
      app_store_url: project.appStoreUrl,
      website_url: project.websiteUrl,
      github_url: project.githubUrl,
      rating: project.rating,
      reviews_count: project.reviewsCount,
      downloads: project.downloads,
      version: project.version,
      size: project.size,
      min_android: project.minAndroid,
      min_ios: project.minIos,
      last_updated: project.lastUpdated,
      accent_color: project.accentColor,
      badge: project.badge,
    };

    const { error } = await supabase
      .from('projects')
      .upsert(dbPayload, { onConflict: 'id' });

    if (error) {
      console.error('Failed to upsert to Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase upsert error:', err);
    return false;
  }
};

export const deleteProjectFromSupabase = async (projectId: string): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    return !error;
  } catch {
    return false;
  }
};

// Upload media asset to Supabase Storage bucket
export const uploadMediaToSupabase = async (file: File, bucket = 'project-assets'): Promise<string | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (error) {
      console.error('Supabase storage upload error:', error);
      return null;
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (err) {
    console.error('Upload exception:', err);
    return null;
  }
};

// Save Contact / Support Inquiries
export const submitContactInquiry = async (inquiry: {
  id?: string;
  name: string;
  email: string;
  subject?: string;
  category?: string;
  message: string;
  created_at?: string;
  is_read?: boolean;
}): Promise<boolean> => {
  if (!isSupabaseConfigured()) return true; // Fallback mock success
  try {
    const { error } = await supabase.from('inquiries').insert([{
      name: inquiry.name,
      email: inquiry.email,
      subject: inquiry.subject,
      category: inquiry.category || inquiry.subject,
      message: inquiry.message,
    }]);
    return !error;
  } catch {
    return true;
  }
};

export const fetchInquiriesFromSupabase = async (): Promise<ContactInquiry[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;

    return data.map((item: any) => ({
      id: String(item.id),
      name: item.name || 'Anonymous',
      email: item.email || '',
      subject: item.subject || item.category || 'General Inquiry',
      category: item.category || item.subject,
      message: item.message || '',
      createdAt: item.created_at || new Date().toISOString(),
      isRead: Boolean(item.is_read),
    }));
  } catch (err) {
    console.warn('Error fetching inquiries from Supabase:', err);
    return null;
  }
};

export const markInquiryAsReadInSupabase = async (id: string): Promise<boolean> => {
  if (!isSupabaseConfigured()) return true;
  try {
    const { error } = await supabase
      .from('inquiries')
      .update({ is_read: true })
      .eq('id', id);
    return !error;
  } catch {
    return true;
  }
};

export const deleteInquiryFromSupabase = async (id: string): Promise<boolean> => {
  if (!isSupabaseConfigured()) return true;
  try {
    const { error } = await supabase
      .from('inquiries')
      .delete()
      .eq('id', id);
    return !error;
  } catch {
    return true;
  }
};


// Studio & Owner Self-Service Credentials Settings
export interface StudioSettings {
  ownerEmail: string;
  ownerPassword?: string;
  studioName: string;
  supportEmail: string;
  apiKey?: string;
}

export const fetchStudioSettings = async (): Promise<StudioSettings | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('studio_settings')
      .select('*')
      .eq('id', 'default')
      .single();

    if (error || !data) return null;
    return {
      ownerEmail: data.owner_email,
      ownerPassword: data.owner_password,
      studioName: data.studio_name,
      supportEmail: data.support_email,
      apiKey: data.api_key,
    };
  } catch {
    return null;
  }
};

export const updateStudioSettings = async (settings: Partial<StudioSettings>): Promise<boolean> => {
  if (!isSupabaseConfigured()) return true;
  try {
    const payload: any = {
      id: 'default',
      updated_at: new Date().toISOString(),
    };
    if (settings.ownerEmail) payload.owner_email = settings.ownerEmail;
    if (settings.ownerPassword) payload.owner_password = settings.ownerPassword;
    if (settings.studioName) payload.studio_name = settings.studioName;
    if (settings.supportEmail) payload.support_email = settings.supportEmail;
    if (settings.apiKey) payload.api_key = settings.apiKey;

    const { error } = await supabase
      .from('studio_settings')
      .upsert(payload, { onConflict: 'id' });

    return !error;
  } catch {
    return false;
  }
};

// ==============================================================================
// TEAM MEMBERS SUPABASE OPERATIONS
// ==============================================================================

export const fetchTeamMembersFromSupabase = async (): Promise<User[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data) return null;

    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      avatar: item.avatar || '',
      role: item.role,
      status: item.status,
      codeAccess: item.code_access || 'Read Only',
      permissions: item.permissions || {
        viewProjects: true,
        addProjects: false,
        editProjects: false,
        uploadMedia: false,
        publishProjects: false,
        deployProduction: false,
      },
      lastActive: item.last_active || 'Recently',
      emailStatus: item.email_status || 'Pending',
      invitationToken: item.invitation_token,
      invitedAt: item.invited_at,
      invitedBy: item.invited_by,
      accessPasscode: item.access_passcode || item.permissions?.accessPasscode,
      passcodeGeneratedAt: item.passcode_generated_at || item.permissions?.passcodeGeneratedAt,
    }));
  } catch (err) {
    console.warn('Error fetching team members from Supabase:', err);
    return null;
  }
};

export const upsertTeamMemberToSupabase = async (user: User): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
      code_access: user.codeAccess,
      permissions: {
        ...user.permissions,
        accessPasscode: user.accessPasscode,
        passcodeGeneratedAt: user.passcodeGeneratedAt,
      },
      last_active: user.lastActive,
      email_status: user.emailStatus || 'Pending',
      invitation_token: user.invitationToken,
      invited_at: user.invitedAt,
      invited_by: user.invitedBy,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('team_members')
      .upsert(payload, { onConflict: 'email' });

    if (error) {
      console.warn('Failed to upsert team member in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Upsert team member exception:', err);
    return false;
  }
};

export const deleteTeamMemberFromSupabase = async (userIdOrEmail: string): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase
      .from('team_members')
      .delete()
      .or(`id.eq.${userIdOrEmail},email.eq.${userIdOrEmail}`);

    return !error;
  } catch {
    return false;
  }
};

// ==============================================================================
// TEAM INVITATIONS SUPABASE OPERATIONS
// ==============================================================================

export const fetchTeamInvitationsFromSupabase = async (): Promise<TeamInvitation[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('team_invitations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;

    return data.map((item: any) => ({
      id: item.id,
      email: item.email,
      name: item.name,
      role: item.role,
      permissions: item.permissions,
      token: item.token,
      status: item.status,
      emailStatus: item.email_status,
      emailError: item.email_error,
      invitedBy: item.invited_by,
      createdAt: item.created_at,
      expiresAt: item.expires_at,
    }));
  } catch (err) {
    console.warn('Error fetching invitations from Supabase:', err);
    return null;
  }
};

export const upsertTeamInvitationToSupabase = async (invitation: TeamInvitation): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const payload = {
      id: invitation.id,
      email: invitation.email,
      name: invitation.name,
      role: invitation.role,
      permissions: invitation.permissions,
      token: invitation.token,
      status: invitation.status,
      email_status: invitation.emailStatus,
      email_error: invitation.emailError,
      invited_by: invitation.invitedBy,
      expires_at: invitation.expiresAt,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('team_invitations')
      .upsert(payload, { onConflict: 'token' });

    return !error;
  } catch {
    return false;
  }
};

// ==============================================================================
// ACTIVITY LOGS SUPABASE OPERATIONS
// ==============================================================================

export const fetchActivityLogsFromSupabase = async (): Promise<ActivityItem[] | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error || !data) return null;

    return data.map((item: any) => ({
      id: String(item.id),
      user: item.user_name,
      avatar: item.avatar || '',
      action: item.action,
      target: item.target || '',
      timestamp: item.created_at ? new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
      type: item.type || 'project',
    }));
  } catch (err) {
    console.warn('Error fetching activity logs from Supabase:', err);
    return null;
  }
};

export const insertActivityLogToSupabase = async (activity: Omit<ActivityItem, 'id' | 'timestamp'>): Promise<boolean> => {
  if (!isSupabaseConfigured()) return false;
  try {
    const { error } = await supabase
      .from('activity_logs')
      .insert([{
        user_name: activity.user,
        avatar: activity.avatar,
        action: activity.action,
        target: activity.target,
        type: activity.type,
      }]);

    return !error;
  } catch {
    return false;
  }
};


