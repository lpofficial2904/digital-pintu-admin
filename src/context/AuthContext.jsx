import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

// const API_URL = 'https://digital-pintu-backend.onrender.com/api';
const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!localStorage.getItem('admin_session')) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/auth/admin/me`, {
  credentials: "include",
});
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success && data.user?.role === 'admin') {
          setUser(data.user);
        } else {
          localStorage.removeItem('admin_session');
        }
      } catch (_error) {
        setUser(null);
        localStorage.removeItem('admin_session');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // login 

  const login = async (email, password) => {

    const res = await fetch(`${API_URL}/auth/admin/login`, {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email, password }),
});


    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success || data.user?.role !== 'admin') {
      throw new Error(data.message || 'Login failed');
    }
    setUser(data.user);
    localStorage.setItem('admin_session', 'true');
    toast.success('Welcome back');
    return data.user;
  };


  // logout 

  const logout = async () => {
   const res=  await fetch(`${API_URL}/auth/admin/logout`, {
  method: "POST",
  credentials: "include",
});
    setUser(null);
    localStorage.removeItem('admin_session');
    toast.success('Logged out');
  };

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
