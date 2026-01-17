'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { useDependencyInjection } from '@/providers/dependency-injection.provider';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | null>(null);

export const AppAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { authService } = useDependencyInjection();

  useEffect(() => {
    const unsubscribe = authService.listen((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    return authService.login(email, password);
  };

  const logout = async () => {
    return authService.logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAppAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAppAuth deve ser usado dentro de um AppAuthProvider');
  return context;
};
