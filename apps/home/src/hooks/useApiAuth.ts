"use client";

import { useState, useCallback, useMemo } from "react";

import { AuthService } from "@repo/api";
import { StorageService } from "@repo/ui";
import type {
  CreateUserRequest,
  LoginRequest,
  ApiResponse,
  CreateUserResponse,
  LoginResponse,
  GetUserAccountResponse,
} from "@repo/api";

export const useApiAuth = (onTokenExpired?: () => void) => {
  const [isLoading, setIsLoading] = useState(false);

  const storageService = useMemo(() => new StorageService(), []);

  const handleTokenExpired = useCallback(() => {
    console.warn("Token expirado - limpando dados e notificando Context");
    storageService.clearAllUserData();
    onTokenExpired?.();
  }, [storageService, onTokenExpired]);

  const authService = useMemo(
    () =>
      new AuthService(() => storageService.getAuthToken(), handleTokenExpired),
    [storageService, handleTokenExpired]
  );

  const register = useCallback(
    async (
      userData: CreateUserRequest
    ): Promise<ApiResponse<CreateUserResponse>> => {
      setIsLoading(true);
      try {
        const response = await authService.registerUser(userData);
        return response;
      } finally {
        setIsLoading(false);
      }
    },
    [authService]
  );

  const login = useCallback(
    async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
      setIsLoading(true);
      try {
        const response = await authService.loginUser(credentials);

        if (response.data?.result?.token) {
          storageService.setAuthToken(response.data.result.token);

          const userResponse = await authService.getUserAccount();
          const userData = userResponse.data?.result;

          if (userData) {
            storageService.setUserData({
              name: userData.userInfo.username || "Nome não encontrado",
              email: userData.userInfo.email || "Não encontrado",
              accountId: userData.account[0].id || "123",
            });
          }
        }

        return response;
      } catch (error) {
        console.error("Login error:", error);
        return {
          error: "Login failed. Please check your credentials.",
          status: 401,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [authService, storageService]
  );

  const logout = useCallback(() => {
    storageService.clearAllUserData();
  }, [storageService]);

  const isAuthenticated = useCallback(() => {
    return storageService.isAuthenticated();
  }, [storageService]);

  const getCurrentUser = useCallback(() => {
    return storageService.getUserData();
  }, [storageService]);

  const getAuthToken = useCallback(() => {
    return storageService.getAuthToken();
  }, [storageService]);

  const getUserAccount = useCallback(async (): Promise<
    ApiResponse<GetUserAccountResponse>
  > => {
    setIsLoading(true);
    try {
      const response = await authService.getUserAccount();
      return response;
    } finally {
      setIsLoading(false);
    }
  }, [authService]);

  return useMemo(
    () => ({
      register,
      login,
      logout,
      isAuthenticated,
      getCurrentUser,
      getAuthToken,
      getUserAccount,
      isLoading,
    }),
    [
      register,
      login,
      logout,
      isAuthenticated,
      getCurrentUser,
      getAuthToken,
      getUserAccount,
      isLoading,
    ]
  );
};
