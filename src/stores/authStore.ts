import { create } from 'zustand';
import type { UserRole } from '../types';

interface AuthStore {
  isAuthenticated: boolean;
  role: UserRole | null;
  code: string | null;
  login: (code: string) => boolean;
  logout: () => void;
}

const ADMIN_CODE = 'adminoncbros';
const TEAM_CODE = 'teamoncbros';

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: localStorage.getItem('apex_auth') === 'true',
  role: localStorage.getItem('apex_role') as UserRole | null,
  code: localStorage.getItem('apex_code'),
  login: (code: string) => {
    if (code === ADMIN_CODE) {
      localStorage.setItem('apex_auth', 'true');
      localStorage.setItem('apex_role', 'admin');
      localStorage.setItem('apex_code', code);
      set({ isAuthenticated: true, role: 'admin', code });
      return true;
    }
    if (code === TEAM_CODE) {
      localStorage.setItem('apex_auth', 'true');
      localStorage.setItem('apex_role', 'team');
      localStorage.setItem('apex_code', code);
      set({ isAuthenticated: true, role: 'team', code });
      return true;
    }
    return false;
  },
  logout: () => {
    localStorage.removeItem('apex_auth');
    localStorage.removeItem('apex_role');
    localStorage.removeItem('apex_code');
    set({ isAuthenticated: false, role: null, code: null });
  },
}));
