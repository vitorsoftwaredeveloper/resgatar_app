import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { isAuthenticated, logout as logoutService } from '../services/auth';

interface AuthContextData {
  isLoggedIn: boolean;
  loading: boolean;
  setIsLoggedIn: (value: boolean) => void;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await isAuthenticated();
      setIsLoggedIn(authenticated);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutService();
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn, 
        loading, 
        setIsLoggedIn, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};