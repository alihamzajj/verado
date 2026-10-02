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
  spendwise: {
    subdomain: 'spendwise',
    projectId: 'spendwise',
    name: 'SpendWise Manager',
    defaultHost: 'spendwise.verado.dev',
  },
  lenz: {
    subdomain: 'lenz',
    projectId: 'lenz',
    name: 'Lenz Object AI',
    defaultHost: 'lenz.verado.dev',
  },
};

/**
 * Extracts and resolves the app subdomain if the user is visiting via an app-specific domain/subdomain.
 * Supports:
 * - Production/Staging subdomains: shoecheck.verado.com, foodai.verado.dev, etc.
 * - Vercel subdomains: shoecheck.verado-pi.vercel.app
 * - Localhost subdomains: shoecheck.localhost:5173
 * - Query parameter simulation: ?subdomain=shoecheck or ?app=foodai
 */
export function detectAppSubdomain(): SubdomainAppConfig | null {
  if (typeof window === 'undefined') return null;

  // 1. Check for manual query param override (vital for instant testing on any host)
  const urlParams = new URLSearchParams(window.location.search);
  const param = urlParams.get('subdomain') || urlParams.get('app');
  if (param && KNOWN_SUBDOMAINS[param.toLowerCase()]) {
    return KNOWN_SUBDOMAINS[param.toLowerCase()];
  }

  const hostname = window.location.hostname.toLowerCase();

  // Exclude IP addresses
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
    return null;
  }

  // Handle localhost subdomains: e.g. shoecheck.localhost
  if (hostname.includes('localhost')) {
    const parts = hostname.split('.');
    if (parts.length > 1 && parts[0] !== 'localhost') {
      const sub = parts[0];
      if (KNOWN_SUBDOMAINS[sub]) {
        return KNOWN_SUBDOMAINS[sub];
      }
    }
    return null;
  }

  // Handle domain subdomains (e.g. shoecheck.verado.com, shoecheck.verado-pi.vercel.app)
  const parts = hostname.split('.');
  if (parts.length >= 3) {
    const sub = parts[0];
    if (sub !== 'www' && sub !== 'admin' && sub !== 'api') {
      if (KNOWN_SUBDOMAINS[sub]) {
        return KNOWN_SUBDOMAINS[sub];
      }
    }
  }

  return null;
}

/**
 * Generates the live URL for an app's subdomain or fallback path
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

  // If on localhost, allow http://<subdomain>.localhost:5173 or fallback to /apps/:id
  if (hostname.includes('localhost')) {
    const baseDomain = hostname.split('.').slice(-1)[0]; // 'localhost'
    return `${protocol}//${subdomainKey}.${baseDomain}${port}${cleanPath}`;
  }

  // If custom domain (e.g. verado.com or verado.dev)
  const parts = hostname.split('.');
  if (parts.length >= 2 && !hostname.includes('vercel.app')) {
    const domainRoot = parts.slice(-2).join('.');
    return `${protocol}//${subdomainKey}.${domainRoot}${port}${cleanPath}`;
  }

  // For vercel or preview environments without wildcard DNS, use direct route
  return `/apps/${config ? config.projectId : subdomainKey}${cleanPath}`;
}
