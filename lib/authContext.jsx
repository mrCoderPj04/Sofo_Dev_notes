'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import api from './api';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isOwner: false,
  loading: true,
  login: async () => {},
  logout: async () => {}
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data && res.data.success) {
        setUser(res.data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('sofo_dev_user', JSON.stringify(res.data.user));
        }
        setLoading(false);
        return;
      }
    } catch (error) {
      // Unauthenticated
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sofo_dev_user');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (identity, password) => {
    try {
      const res = await api.post('/auth/login', { identity, password });
      if (res.data && res.data.success) {
        setUser(res.data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('sofo_dev_user', JSON.stringify(res.data.user));
        }
        return { success: true, message: res.data.message };
      } else {
        return { success: false, message: res.data?.message || 'Login failed.' };
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Login failed. Invalid credentials or server error.';
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sofo_dev_user');
      }
      return { success: false, message: errorMsg };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error(err);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sofo_dev_user');
      }
      setUser(null);
    }
  };

  const isOwner = user?.role === 'OWNER' || user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isOwner,
        loading,
        login,
        logout,
        refreshAuth: checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
