import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

const AuthContext = createContext(null);

// const API_URL = 'https://digital-pintu-backend.onrender.com/api';
const API_URL = import.meta.env.DEV ? "/api" : "https://api.digitalpintu.com/api";
const ADMIN_SESSION_ORIGIN = "https://api.digitalpintu.com";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const init = async () => {
      const token = localStorage.getItem('admin_token');
      const sessionOrigin = localStorage.getItem('admin_session_api_origin');
      if (!localStorage.getItem('admin_session') || !token || sessionOrigin !== ADMIN_SESSION_ORIGIN) {
        localStorage.removeItem('admin_session');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_session_api_origin');
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/auth/admin/me`, {
  credentials: "include",
  headers: { Authorization: `Bearer ${token}` },
});
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success && data.user?.role === 'admin') {
          setUser(data.user);
        } else {
          localStorage.removeItem('admin_session');
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_session_api_origin');
        }
      } catch (_error) {
        setUser(null);
        localStorage.removeItem('admin_session');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_session_api_origin');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    const resetUnauthorizedSession = () => {
      setUser(null);
      setLoading(false);
      localStorage.removeItem('admin_session');
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_session_api_origin');
    };
    window.addEventListener('admin:unauthorized', resetUnauthorizedSession);
    return () => window.removeEventListener('admin:unauthorized', resetUnauthorizedSession);
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
    localStorage.setItem('admin_token', data.token);
    localStorage.setItem('admin_session_api_origin', ADMIN_SESSION_ORIGIN);
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
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_session_api_origin');
    toast.success('Logged out');
  };

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
