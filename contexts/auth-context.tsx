'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  login: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      try {
        const currentUserStr = localStorage.getItem('currentUser');
        const isAuth = localStorage.getItem('isAuthenticated') === 'true';

        if (currentUserStr && isAuth) {
          const currentUser = JSON.parse(currentUserStr);
          setUser(currentUser);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('[v0] Auth check error:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    // sync auth state across tabs
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'currentUser' || e.key === 'isAuthenticated') {
        checkAuth();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', onStorage);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', onStorage);
      }
    };
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const protectedRoutes = ['/tools', '/tools/traffic-analysis', '/tools/keyword-research', '/tools/local-seo'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const logout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/');
  };

  const login = (u: User) => {
    try {
      localStorage.setItem('currentUser', JSON.stringify(u));
      localStorage.setItem('isAuthenticated', 'true');
      setUser(u);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('[v0] login error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
