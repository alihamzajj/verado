import { TeamInvitation } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

export interface EmailSendResult {
  success: boolean;
  status: 'Sent' | 'Failed';
  messageId?: string;
  error?: string;
  inviteUrl: string;
}

/**
 * Builds the HTML content for the employee invitation email.
 */
export const buildInvitationEmailHtml = (params: {
  name: string;
  email: string;
  role: string;
  ownerName: string;
  studioName: string;
  inviteUrl: string;
  permissions: {
    addProjects: boolean;
    editProjects: boolean;
    uploadMedia?: boolean;
    publishProjects?: boolean;
    deployProduction: boolean;
  };
}): string => {
  const { name, role, ownerName, studioName, inviteUrl, permissions } = params;

  const permissionBadges = [
    permissions.addProjects && 'Create New Applications',
    permissions.editProjects && 'Edit Project Metadata & URLs',
    (permissions.uploadMedia ?? true) && 'Upload & Replace Media Assets',
    (permissions.publishProjects || permissions.deployProduction) ? 'Direct Production Publishing' : 'Catalog Editor (Draft Submissions)',
  ].filter(Boolean);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Verado Studio Access Invitation</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0E; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #FFFFFF;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0A0A0E; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #121118; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 28px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(124, 58, 237, 0.25);">
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 36px 40px 24px 40px; background: linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(15, 14, 17, 0.8) 100%); border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="display: inline-block; width: 44px; height: 44px; background: linear-gradient(135deg, #7C3AED, #4F46E5); border-radius: 14px; text-align: center; line-height: 44px; font-weight: 900; font-size: 20px; color: #FFFFFF; box-shadow: 0 8px 16px rgba(124, 58, 237, 0.35);">
                      V
                    </div>
                    <span style="font-weight: 800; font-size: 20px; letter-spacing: -0.5px; color: #FFFFFF; vertical-align: middle; margin-left: 12px;">
                      VERADO STUDIO
                    </span>
                  </td>
                  <td align="right">
                    <span style="background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); color: #34D399; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 6px 12px; border-radius: 9999px;">
                      Official Invitation
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 36px 40px;">
              <h1 style="font-size: 24px; font-weight: 800; color: #FFFFFF; margin: 0 0 16px 0; letter-spacing: -0.5px;">
                Welcome to the team, ${name}
              </h1>
              
              <p style="font-size: 14px; line-height: 24px; color: rgba(255, 255, 255, 0.75); margin: 0 0 20px 0;">
                Studio Owner <strong>${ownerName}</strong> has authorized your employee account and invited you to collaborate on the <strong>${studioName}</strong> application showcase & project management platform.
              </p>

              <!-- Role & Access Summary Card -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #17161F; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; margin: 0 0 28px 0; padding: 20px;">
                <tr>
                  <td>
                    <div style="font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 1.5px; color: #A78BFA; margin-bottom: 8px;">
                      Assigned Role & Permissions
                    </div>
                    <div style="font-size: 18px; font-weight: 700; color: #FFFFFF; margin-bottom: 12px;">
                      ${role}
                    </div>
                    <div style="margin-top: 10px;">
                      ${permissionBadges.map(badge => `
                        <span style="display: inline-block; background: rgba(124, 58, 237, 0.15); border: 1px solid rgba(124, 58, 237, 0.3); color: #C4B5FD; font-size: 11px; font-family: monospace; padding: 4px 10px; border-radius: 8px; margin: 0 6px 6px 0;">
                          ✓ ${badge}
                        </span>
                      `).join('')}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Call to Action Button -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 28px 0;">
                <tr>
                  <td align="center">
                    <a href="${inviteUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #7C3AED, #6366F1); color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 800; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; padding: 16px 36px; border-radius: 9999px; box-shadow: 0 10px 25px -5px rgba(124, 58, 237, 0.5);">
                      Accept Invitation & Sign In →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 12px; line-height: 18px; color: rgba(255, 255, 255, 0.45); margin: 0 0 12px 0; text-align: center;">
                Clicking the link will securely activate your developer access and sign you into the Verado Control Hub according to the permissions assigned by the Owner.
              </p>

              <!-- Magic Link Fallback -->
              <div style="background-color: #0D0C10; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 12px 16px; margin-top: 20px;">
                <div style="font-size: 10px; font-family: monospace; text-transform: uppercase; color: rgba(255, 255, 255, 0.4); margin-bottom: 4px;">
                  Direct Secure Link (Valid for 7 days):
                </div>
                <div style="font-size: 11px; font-family: monospace; color: #A78BFA; word-break: break-all;">
                  ${inviteUrl}
                </div>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #0E0D12; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
              <p style="font-size: 11px; color: rgba(255, 255, 255, 0.4); margin: 0;">
                © 2026 ${studioName}. All rights reserved. • Protected by Studio Role-Based Security
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};

/**
 * Dispatches a real invitation email to an employee.
 * Uses Supabase Edge Functions with Resend API integration,
 * or direct Resend API if configured.
 */
export const sendEmployeeInvitationEmail = async (
  invitation: TeamInvitation,
  ownerName = 'Studio Owner',
  studioName = 'Verado Studios'
): Promise<EmailSendResult> => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const inviteUrl = `${origin}/admin/login?invite=${invitation.token}&email=${encodeURIComponent(invitation.email)}`;

  const emailHtml = buildInvitationEmailHtml({
    name: invitation.name,
    email: invitation.email,
    role: invitation.role,
    ownerName,
    studioName,
    inviteUrl,
    permissions: invitation.permissions,
  });

  // 1. Primary path: Call Supabase Edge Function 'send-invite'
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.functions.invoke('send-invite', {
        body: {
          to: invitation.email,
          name: invitation.name,
          role: invitation.role,
          ownerName,
          studioName,
          inviteUrl,
          html: emailHtml,
          token: invitation.token,
          subject: `You've been invited to ${studioName} as ${invitation.role}`,
        },
      });

      if (!error && data?.success) {
        return {
          success: true,
          status: 'Sent',
          messageId: data.id || `resend_${Date.now()}`,
          inviteUrl,
        };
      }

      // If function returned specific error message
      if (error && error.message && !error.message.includes('Failed to send') && !error.message.includes('404')) {
        console.warn('Supabase Edge Function returned error:', error);
      }
    } catch (edgeErr) {
      console.warn('Edge function invocation skipped or offline:', edgeErr);
    }
  }

  // 2. Secondary path: Check for client-side test key VITE_RESEND_API_KEY
  const resendApiKey = (import.meta as any).env?.VITE_RESEND_API_KEY;
  if (resendApiKey && !resendApiKey.includes('placeholder') && resendApiKey.startsWith('re_')) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Verado Studio <onboarding@resend.dev>',
          to: [invitation.email],
          subject: `You've been invited to ${studioName} as ${invitation.role}`,
          html: emailHtml,
        }),
      });

      const resendData = await response.json();
      if (response.ok && resendData?.id) {
        return {
          success: true,
          status: 'Sent',
          messageId: resendData.id,
          inviteUrl,
        };
      }

      return {
        success: false,
        status: 'Failed',
        error: resendData?.message || 'Resend API returned an error dispatching email.',
        inviteUrl,
      };
    } catch (fetchErr: any) {
      return {
        success: false,
        status: 'Failed',
        error: fetchErr?.message || 'Failed connecting to Resend API.',
        inviteUrl,
      };
    }
  }

  // 3. Realistic failure state if no email service key is configured
  // Fulfills: "Do not simulate emails or display a fake success message. Configure the required environment variables and provide setup instructions."
  return {
    success: false,
    status: 'Failed',
    error: 'Real email dispatch requires RESEND_API_KEY configured in Supabase Edge Functions or VITE_RESEND_API_KEY in .env. Invitation recorded with secure access link.',
    inviteUrl,
  };
};
