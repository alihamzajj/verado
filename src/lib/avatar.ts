export interface AvatarGradient {
  id: string;
  name: string;
  from: string;
  to: string;
}

export const AVATAR_GRADIENTS: AvatarGradient[] = [
  { id: 'amethyst', name: 'Amethyst (Default)', from: '#8B5CF6', to: '#4C1D95' },
  { id: 'indigo', name: 'Deep Indigo', from: '#6366F1', to: '#312E81' },
  { id: 'cyan', name: 'Neon Cyan', from: '#06B6D4', to: '#164E63' },
  { id: 'emerald', name: 'Emerald Tech', from: '#10B981', to: '#064E3B' },
  { id: 'rose', name: 'Rose Quartz', from: '#F43F5E', to: '#881337' },
  { id: 'amber', name: 'Solar Amber', from: '#F59E0B', to: '#78350F' },
];

export const getInitialsAvatar = (
  name: string, 
  gradientId: string = 'amethyst'
): string => {
  const cleanName = (name || '').trim();
  const initials = cleanName
    ? cleanName
        .split(' ')
        .map(n => n[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  const gradient = AVATAR_GRADIENTS.find(g => g.id === gradientId) || AVATAR_GRADIENTS[0];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
    <defs>
      <linearGradient id="g_${gradient.id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${gradient.from}"/>
        <stop offset="100%" stop-color="${gradient.to}"/>
      </linearGradient>
    </defs>
    <rect width="128" height="128" rx="28" fill="url(#g_${gradient.id})"/>
    <text x="50%" y="54%" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="700" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle" letter-spacing="1">${initials}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};
