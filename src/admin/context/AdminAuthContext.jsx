import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  bootstrapAdmin,
  clearAdminSession,
  getStoredAdminSession,
  loginAdmin,
} from '../api/adminApi.js';

const AdminAuthContext = createContext(null);

/* eslint-disable react-refresh/only-export-components */
export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(() => getStoredAdminSession());

  const login = useCallback(async (email, password) => {
    const data = await loginAdmin(email, password);
    setSession(getStoredAdminSession() ?? { ...data, email });
    return data;
  }, []);

  const bootstrap = useCallback(async ({ email, password, displayName }) => {
    const data = await bootstrapAdmin({ email, password, displayName });
    setSession(getStoredAdminSession() ?? { ...data, email });
    return data;
  }, []);

  const logout = useCallback(() => {
    clearAdminSession();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: Boolean(session?.accessToken && session?.role === 'ADMIN'),
      login,
      bootstrap,
      logout,
    }),
    [session, login, bootstrap, logout]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
