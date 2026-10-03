import type { Project } from '../types';

export interface SubdomainAppConfig {
  subdomain: string;
  projectId: string;
  name: string;
  defaultHost: string;
}

export const KNOWN_SUBDOMAINS: Record<string, SubdomainAppConfig> = {
  shoecheck: {
    subdomain: 'shoecheck',
    projectId: 'shoecheck',
    name: 'ShoeCheck AI',
    defaultHost: 'shoecheck.verado.dev',
  },
  foodai: {
    subdomain: 'foodai',
    projectId: 'foodai',
    name: 'FoodAI Nutritionist',
    defaultHost: 'foodai.verado.dev',
  },
  pulsefit: {
    subdomain: 'pulsefit',
    projectId: 'pulsefit-tracker',
    name: 'PulseFit Pro',
    defaultHost: 'pulsefit.verado.dev',
  },
  'pulsefit-tracker': {
    subdomain: 'pulsefit',
    projectId: 'pulsefit-tracker',
    name: 'PulseFit Pro',
    defaultHost: 'pulsefit.verado.dev',
  },
  spendwise: {
    subdomain: 'spendwise',
    projectId: 'spendwise',
    name: 'SpendWise Manager',
    defaultHost: 'spendwise.verado.dev',
  },
  brainwave: {
    subdomain: 'brainwave',
    projectId: 'brainwave-ai',
    name: 'BrainWave AI Study',
    defaultHost: 'brainwave.verado.dev',
  },
  'brainwave-ai': {
    subdomain: 'brainwave',
    projectId: 'brainwave-ai',
    name: 'BrainWave AI Study',
    defaultHost: 'brainwave.verado.dev',
  },
  neuralstudio: {
    subdomain: 'brainwave',
    projectId: 'brainwave-ai',
    name: 'BrainWave AI Study',
    defaultHost: 'brainwave.verado.dev',
  },
  lenz: {
    subdomain: 'lenz',
    projectId: 'lenz',
    name: 'Lenz Object AI',
    defaultHost: 'lenz.verado.dev',
  },
};

/**
 * Extracts raw subdomain from current browser location
 */
export function detectRawSubdomain(): string | null {
  if (typeof window === 'undefined') return null;

  // 1. Manual query param override (e.g. ?subdomain=shoecheck or ?app=foodai)
  const urlParams = new URLSearchParams(window.location.search);
  const param = urlParams.get('subdomain') || urlParams.get('app');
  if (param) {
    return param.toLowerCase().trim();
  }

  const hostname = window.location.hostname.toLowerCase();

  // Exclude raw IP addresses
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
    return null;
  }

  // Handle localhost subdomains: e.g. shoecheck.localhost:5173
  if (hostname.includes('localhost')) {
    const parts = hostname.split('.');
    if (parts.length > 1 && parts[0] !== 'localhost') {
      const sub = parts[0];
      if (sub !== 'www' && sub !== 'admin' && sub !== 'api') {
        return sub;
      }
    }
    return null;
  }

  // CRITICAL PROTECTION FOR VERCEL:
  // "verado-pi.vercel.app" is the ROOT domain (3 parts: verado-pi, vercel, app)
  // A subdomain on Vercel is only when there are 4 or more parts: e.g. "shoecheck.verado-pi.vercel.app"
  if (hostname.endsWith('.vercel.app')) {
    const parts = hostname.split('.');
    if (parts.length >= 4) {
      const sub = parts[0];
      if (sub !== 'www' && sub !== 'admin' && sub !== 'api') {
        return sub;
      }
    }
    // "verado-pi.vercel.app" has 3 parts -> It is the main website root, NEVER a subdomain!
    return null;
  }

  // Handle standard custom domain subdomains (e.g. shoecheck.verado.com, novaai.verado.dev)
  const parts = hostname.split('.');
  if (parts.length >= 3) {
    const sub = parts[0];
    if (
      sub !== 'www' && 
      sub !== 'admin' && 
      sub !== 'api' && 
      sub !== 'verado' && 
      sub !== 'verado-pi'
    ) {
      return sub;
    }
  }

  return null;
}

/**
 * Resolves the app config for any subdomain dynamically from either KNOWN_SUBDOMAINS
 * or the active live projects database (when created by Owner or Team Member).
 * If the subdomain does NOT match an actual app, returns null to protect the main website.
 */
export function detectAppSubdomain(projects?: Project[]): SubdomainAppConfig | null {
  const sub = detectRawSubdomain();
  if (!sub) return null;

  // 1. Check known pre-configured subdomains
  if (KNOWN_SUBDOMAINS[sub]) {
    return KNOWN_SUBDOMAINS[sub];
  }

  // 2. Dynamically search through database projects (for projects added by Owner or Team Members)
  if (projects && projects.length > 0) {
    const match = projects.find(p => 
      p.id.toLowerCase() === sub ||
      p.id.toLowerCase().replace(/[^a-z0-9]/g, '') === sub.replace(/[^a-z0-9]/g, '') ||
      p.name.toLowerCase().replace(/[^a-z0-9]/g, '') === sub.replace(/[^a-z0-9]/g, '')
    );

    if (match) {
      return {
        subdomain: sub,
        projectId: match.id,
        name: match.name,
        defaultHost: `${sub}.verado.dev`,
      };
    }
  }

  return null;
}

/**
 * Returns clean subdomain slug for any project
 */
export function getProjectSubdomain(project: { id: string; name?: string }): string {
  if (project.id === 'pulsefit-tracker') return 'pulsefit';
  if (project.id === 'brainwave-ai') return 'brainwave';
  return project.id.toLowerCase().replace(/[^a-z0-9-]/g, '');
}

/**
 * Generates the live URL for an app's subdomain or fallback direct path
 */
export function getAppSubdomainUrl(subdomainKey: string, path: string = ''): string {
  const config = KNOWN_SUBDOMAINS[subdomainKey.toLowerCase()];
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';

  if (typeof window === 'undefined') {
    return `/apps/${config ? config.projectId : subdomainKey}${cleanPath}`;
  }

  const hostname = window.location.hostname;
  const port = window.location.port ? `:${window.location.port}` : '';
  const protocol = window.location.protocol;

  // Localhost
  if (hostname.includes('localhost')) {
    const baseDomain = hostname.split('.').slice(-1)[0];
    return `${protocol}//${subdomainKey}.${baseDomain}${port}${cleanPath}`;
  }

  // Custom domain with wildcard DNS
  const parts = hostname.split('.');
  if (parts.length >= 2 && !hostname.includes('vercel.app')) {
    const domainRoot = parts.slice(-2).join('.');
    return `${protocol}//${subdomainKey}.${domainRoot}${port}${cleanPath}`;
  }

  // Fallback direct path
  return `/apps/${config ? config.projectId : subdomainKey}${cleanPath}`;
}
