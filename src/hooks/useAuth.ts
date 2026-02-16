import { useAuthContext } from '@/contexts/AuthContext';

/**
 * Auth state and actions. Uses shared AuthContext so user/isAdmin stay
 * stable across navigation (e.g. Admin sidebar item no longer flickers).
 */
export function useAuth() {
  return useAuthContext();
}
