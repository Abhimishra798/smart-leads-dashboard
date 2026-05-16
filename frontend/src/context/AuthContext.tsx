import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState } from '@/types';
import { authApi, LoginInput, RegisterInput } from '@/api/authApi';
import { tokenStorage } from '@/utils/token';
import toast from 'react-hot-toast';

interface AuthContextType extends AuthState {
  login: (data: LoginInput) => Promise<boolean>;
  register: (data: RegisterInput) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: tokenStorage.get(),
    isAuthenticated: !!tokenStorage.get(),
    isLoading: true,
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = tokenStorage.get();
      if (!token) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        const response = await authApi.getMe();
        if (response.data.success && response.data.data) {
          setState({
            user: response.data.data,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          throw new Error('Failed to fetch user');
        }
      } catch (error) {
        tokenStorage.remove();
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initAuth();
  }, []);

  const login = async (data: LoginInput): Promise<boolean> => {
    try {
      const response = await authApi.login(data);
      if (response.data.success && response.data.data) {
        const { token, user } = response.data.data;
        tokenStorage.set(token);
        setState({ user, token, isAuthenticated: true, isLoading: false });
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (data: RegisterInput): Promise<boolean> => {
    try {
      const response = await authApi.register(data);
      if (response.data.success && response.data.data) {
        const { token, user } = response.data.data;
        tokenStorage.set(token);
        setState({ user, token, isAuthenticated: true, isLoading: false });
        return true;
      }
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logout = () => {
    tokenStorage.remove();
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
