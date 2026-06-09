import type { AuthUser } from '@/entities/user/model/types';

const TOKEN_KEY = 'fleetcore:token';
const USER_KEY = 'fleetcore:user';

const isBrowser = () => typeof window !== 'undefined';

const safeParseUser = (raw: string | null): AuthUser | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }
    return parsed;
  } catch (error) {
    console.warn('Failed to parse stored session user', error);
    return null;
  }
};

export const sessionStorage = {
  setSession(token: string, user: AuthUser) {
    if (!isBrowser()) return;
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clearSession() {
    if (!isBrowser()) return;
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  },
  getToken(): string | null {
    if (!isBrowser()) return null;
    return window.localStorage.getItem(TOKEN_KEY);
  },
  getUser(): AuthUser | null {
    if (!isBrowser()) return null;
    return safeParseUser(window.localStorage.getItem(USER_KEY));
  },
};
