import React, { useEffect, useMemo, useState } from 'react';
import { AuthContext } from './auth';
import api from '../utils/axios.jsx';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);

  // Persist
  useEffect(() => {
    if (token) localStorage.setItem('token', token); else localStorage.removeItem('token');
  }, [token]);
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user');
  }, [user]);

  // Load user via /me if we only have token
  useEffect(() => {
    async function fetchMe() {
      if (!token || user) return;
      setLoading(true);
      try {
        const res = await api.get('auth/me', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res?.data?.user) setUser(res.data.user);
      } catch (e) {
        console.error('Failed to fetch current user', e);
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, [token, user]);

  const isSeller = user?.role === 'seller';
  const isUser = user?.role === 'user';
  const isAdmin = user?.role === 'admin';

  const value = useMemo(
    () => ({ token, setToken, user, setUser, isSeller, isUser, isAdmin, loading }),
    [token, user, isSeller, isUser, isAdmin, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export default AuthProvider;
