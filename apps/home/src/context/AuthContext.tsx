"use client";

import { createContext, useState, useMemo, ReactNode, useEffect } from "react";

import { AuthService, User } from "@/services/AuthService";
import { StringUtils } from "@/lib/utils/StringUtils";

type AuthContextType = {
  isLoading: boolean;
  isLoggedIn: boolean;
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const authService = useMemo(() => new AuthService(), []);

  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(
    authService.currentUser
  );

  useEffect(() => {
    const user = authService.currentUser;

    if (user) {
      user.name = StringUtils.toPascalCase(currentUser?.name ?? "");
    }

    setCurrentUser(user);
    setIsLoading(false);
  }, [authService, currentUser?.name]);

  const login = (user: User) => {
    authService.login(user, setCurrentUser);
  };

  const logout = () => {
    authService.logout(setCurrentUser);
  };

  const value = {
    isLoading,
    isLoggedIn: currentUser !== null,
    currentUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
