"use client";

import {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";

import { useToast } from "@/context/ToastContext";

import { useApiAuth } from "@/hooks/useApiAuth";
import { StringUtils } from "@/lib/utils/StringUtils";

type User = {
  name: string;
  email: string;
};

type AuthContextType = {
  isLoading: boolean;
  isLoggedIn: boolean;
  currentUser: User | null;
  login: (credentials: { email: string; password: string }) => Promise<boolean>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
  }) => Promise<boolean>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { setShowSlowApiToast } = useToast();

  const handleTokenExpired = useCallback(() => {
    alert("Sua sessão expirou. Você será redirecionado para o login.");
    setCurrentUser(null);
  }, []);

  const handleSlowRequest = useCallback(
    (show: boolean) => {
      setShowSlowApiToast(show);
    },
    [setShowSlowApiToast]
  );

  const apiAuth = useApiAuth(handleTokenExpired, handleSlowRequest);

  useEffect(() => {
    const userData = apiAuth.getCurrentUser();

    if (userData && apiAuth.isAuthenticated()) {
      setCurrentUser({
        name: StringUtils.toPascalCase(userData.name),
        email: userData.email,
      });
    }
  }, [apiAuth]);

  const login = async (credentials: {
    email: string;
    password: string;
  }): Promise<boolean> => {
    const response = await apiAuth.login(credentials);

    if (response.data?.result?.token) {
      const userData = apiAuth.getCurrentUser();

      if (userData) {
        setCurrentUser({
          name: StringUtils.toPascalCase(userData.name),
          email: userData.email,
        });
      }
      return true;
    }

    return false;
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
  }): Promise<boolean> => {
    const response = await apiAuth.register(userData);

    if (response.data) {
      const loginSuccess = await login({
        email: userData.email,
        password: userData.password,
      });

      return loginSuccess;
    }

    return false;
  };

  const logout = useCallback(() => {
    apiAuth.logout();
    setCurrentUser(null);
  }, [apiAuth]);

  const value = {
    isLoading: apiAuth.isLoading,
    isLoggedIn: currentUser !== null && apiAuth.isAuthenticated(),
    currentUser,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
