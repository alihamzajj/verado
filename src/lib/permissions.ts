import { User } from '../types';

export const isAdministrativeRole = (role?: string): boolean => {
  if (!role) return false;
  const lower = role.toLowerCase().trim();
  return lower === 'owner' || lower === 'admin' || lower === 'administrator';
};

export const isAdministrativeUser = (user?: User | null): boolean => {
  if (!user) return false;
  return isAdministrativeRole(user.role) || user.permissions?.manageTeam === true;
};
