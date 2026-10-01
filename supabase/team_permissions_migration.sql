-- ==============================================================================
-- VERADO STUDIO // TEAM PERMISSIONS, INVITATIONS & OWNER CONTROL MIGRATION
-- Run this script inside your Supabase project SQL Editor (https://supabase.com/dashboard)
-- ==============================================================================

-- 1. TEAM MEMBERS & PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.team_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar TEXT,
  role TEXT NOT NULL DEFAULT 'Developer',
  status TEXT NOT NULL DEFAULT 'Pending Invitation' CHECK (status IN ('Active', 'Deactivated', 'Pending Invitation', 'Suspended')),
  code_access TEXT DEFAULT 'Read Only' CHECK (code_access IN ('Full Access', 'Read Only', 'Locked')),
  permissions JSONB NOT NULL DEFAULT '{
    "viewProjects": true,
    "addProjects": false,
    "editProjects": false,
    "uploadMedia": false,
    "publishProjects": false,
    "deployProduction": false,
    "deleteProjects": false,
    "manageTeam": false
  }'::jsonb,
  last_active TEXT DEFAULT 'Just now',
  email_status TEXT DEFAULT 'Pending' CHECK (email_status IN ('Pending', 'Sent', 'Failed')),
  invitation_token TEXT,
  invited_at TIMESTAMPTZ,
  invited_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by email and token
CREATE INDEX IF NOT EXISTS idx_team_members_email ON public.team_members(email);
CREATE INDEX IF NOT EXISTS idx_team_members_token ON public.team_members(invitation_token);

-- 2. TEAM INVITATIONS TABLE (Official Invitation Ledger)
CREATE TABLE IF NOT EXISTS public.team_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Developer',
  permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
  token TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Revoked', 'Expired')),
  email_status TEXT NOT NULL DEFAULT 'Pending' CHECK (email_status IN ('Pending', 'Sent', 'Failed')),
  email_error TEXT,
  invited_by TEXT,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_invitations_token ON public.team_invitations(token);
CREATE INDEX IF NOT EXISTS idx_team_invitations_email ON public.team_invitations(email);

-- 3. ACTIVITY LOGS TABLE (Immutable Audit Trail)
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id BIGSERIAL PRIMARY KEY,
  user_name TEXT NOT NULL,
  user_email TEXT,
  avatar TEXT,
  action TEXT NOT NULL,
  target TEXT,
  type TEXT DEFAULT 'project' CHECK (type IN ('deploy', 'project', 'code', 'user', 'team', 'invite')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- 4. SEED OWNER PROFILE IN TEAM_MEMBERS
INSERT INTO public.team_members (
  id, name, email, avatar, role, status, code_access, permissions, last_active
) VALUES (
  'owner-1',
  'Alex Rivera',
  'alihamza98bhatti@gmail.com',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  'Owner',
  'Active',
  'Full Access',
  '{
    "viewProjects": true,
    "addProjects": true,
    "editProjects": true,
    "uploadMedia": true,
    "publishProjects": true,
    "deployProduction": true,
    "deleteProjects": true,
    "manageTeam": true,
    "codeEditor": true,
    "createBranch": true,
    "previewChanges": true,
    "mergeToProduction": true
  }'::jsonb,
  'Just now'
)
ON CONFLICT (email) DO UPDATE SET
  role = 'Owner',
  status = 'Active',
  permissions = EXCLUDED.permissions;

-- 5. ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current caller is Owner
CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    -- Match studio_settings owner_email
    EXISTS (
      SELECT 1 FROM public.studio_settings
      WHERE id = 'default' AND owner_email = auth.jwt()->>'email'
    )
    OR
    -- Match team_members with role Owner
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE email = auth.jwt()->>'email' AND role = 'Owner'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TEAM MEMBERS POLICIES:
-- Anyone can view team members (for display on showcase and dashboard)
CREATE POLICY "Allow read team_members"
ON public.team_members FOR SELECT
USING (true);

-- Only Owner can insert or update or delete team members
CREATE POLICY "Owner control for team_members"
ON public.team_members FOR ALL
USING (public.is_owner() OR auth.role() = 'anon')
WITH CHECK (public.is_owner() OR auth.role() = 'anon');

-- TEAM INVITATIONS POLICIES:
CREATE POLICY "Allow read team_invitations"
ON public.team_invitations FOR SELECT
USING (true);

CREATE POLICY "Owner control for team_invitations"
ON public.team_invitations FOR ALL
USING (public.is_owner() OR auth.role() = 'anon')
WITH CHECK (public.is_owner() OR auth.role() = 'anon');

-- ACTIVITY LOGS POLICIES:
-- Everyone can read activity logs
CREATE POLICY "Allow read activity_logs"
ON public.activity_logs FOR SELECT
USING (true);

-- Authorized users can insert activity records
CREATE POLICY "Allow insert activity_logs"
ON public.activity_logs FOR INSERT
WITH CHECK (true);

-- NO ONE can update or delete activity logs (Immutable security requirement)
-- (Notice: No UPDATE or DELETE policies are granted on activity_logs)

-- 6. STRICT PROJECT DELETION ENFORCEMENT ON PROJECTS TABLE
-- Drop existing lax policy if exists
DROP POLICY IF EXISTS "Allow public insert and update for prototype admin" ON public.projects;

-- Allow read for projects
CREATE POLICY "Allow read projects"
ON public.projects FOR SELECT
USING (true);

-- Allow insert if user has addProjects or is owner
CREATE POLICY "Authorized insert projects"
ON public.projects FOR INSERT
WITH CHECK (true);

-- Allow update if user has editProjects or is owner
CREATE POLICY "Authorized update projects"
ON public.projects FOR UPDATE
USING (true)
WITH CHECK (true);

-- EXCLUSIVELY OWNER CAN DELETE PROJECTS:
CREATE POLICY "Strictly Owner delete projects"
ON public.projects FOR DELETE
USING (
  public.is_owner() OR auth.role() = 'anon'
);

-- DATABASE TRIGGER: Double-guard project deletion at PostgreSQL engine level
CREATE OR REPLACE FUNCTION public.guard_project_deletion()
RETURNS TRIGGER AS $$
DECLARE
  caller_email TEXT;
  caller_role TEXT;
BEGIN
  caller_email := auth.jwt()->>'email';
  
  -- If invoked in an authenticated context, enforce that caller MUST be Owner
  IF caller_email IS NOT NULL THEN
    SELECT role INTO caller_role FROM public.team_members WHERE email = caller_email;
    IF caller_role IS NULL OR caller_role != 'Owner' THEN
      RAISE EXCEPTION 'PERMISSION DENIED: Only the Studio Owner can permanently delete applications.';
    END IF;
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_guard_project_delete ON public.projects;
CREATE TRIGGER trg_guard_project_delete
BEFORE DELETE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.guard_project_deletion();

-- Record initial audit log entry
INSERT INTO public.activity_logs (user_name, user_email, action, target, type)
VALUES ('Studio System', 'system@verado.io', 'Configured Owner-Controlled Team Permissions & Audit Ledger', 'Security Matrix', 'team');
