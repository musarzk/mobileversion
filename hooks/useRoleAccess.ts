import { useAuth } from '../context/AuthContext';

export type UserRole = 'user' | 'agent' | 'admin' | 'investor';

interface RoleAccess {
  isUser: boolean;
  isAgent: boolean;
  isAdmin: boolean;
  isInvestor: boolean;
  canCreateListing: boolean;
  canAccessAdmin: boolean;
  canViewInvestments: boolean;
}

export const useRoleAccess = (): RoleAccess => {
  const { user } = useAuth();
  
  const role = user?.role || 'user';
  
  return {
    isUser: role === 'user',
    isAgent: role === 'agent',
    isAdmin: role === 'admin',
    isInvestor: role === 'investor',
    canCreateListing: role === 'agent' || role === 'admin',
    canAccessAdmin: role === 'admin',
    canViewInvestments: role === 'investor' || role === 'admin',
  };
};
