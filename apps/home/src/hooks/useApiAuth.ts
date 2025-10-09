"use client";

import { useState, useCallback, useMemo } from "react";

import {
  StorageService,
  HashAuthService,
  TokenValidationService,
} from "@repo/ui";
import {
  type CreateUserRequest,
  type LoginRequest,
  type ApiResponse,
  type CreateUserResponse,
  type LoginResponse,
  type GetUserAccountResponse,
  AuthService,
} from "@repo/api";

export const useApiAuth = (
  onTokenExpired?: () => void,
  onSlowRequest?: (show: boolean) => void
) => {
  const [isLoading, setIsLoading] = useState(false);

  const storageService = useMemo(() => new StorageService(), []);

  const handleTokenExpired = useCallback(() => {
    console.warn("Token expirado - limpando dados e notificando Context");
    storageService.clearAllUserData();
    onTokenExpired?.();
  }, [storageService, onTokenExpired]);

  const authService = useMemo(
    () =>
      new AuthService(
        () => storageService.getAuthToken(),
        handleTokenExpired,
        onSlowRequest
      ),
    [storageService, handleTokenExpired, onSlowRequest]
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

          const userDataToStore = {
            name: userData?.userInfo?.username || "Nome não encontrado",
            email: userData?.userInfo?.email || "Email não encontrado",
            accountId: userData?.account[0]?.id || "Account não encontrada",
          };

          if (userData) {
            storageService.setUserData(userDataToStore);
          }
        }

        return response;
      } catch (error) {
        console.warn("Login error:", error);
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

  const logout = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);

    try {
      const serverLogoutSuccess =
        await TokenValidationService.logoutOnServer(authService);

      if (serverLogoutSuccess) {
        console.log("Logout realizado no servidor com sucesso");
      } else {
        console.warn(
          "Erro no logout do servidor, mas continuando com logout local"
        );
      }

      storageService.clearAllUserData();

      return true;
    } catch (error) {
      console.warn("Erro durante logout:", error);

      storageService.clearAllUserData();

      return false;
    } finally {
      setIsLoading(false);
    }
  }, [authService, storageService]);

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

  const navigateToInvestments = useCallback(() => {
    const token = storageService.getAuthToken();
    const userData = storageService.getUserData();

    if (token && userData) {
      const investmentsUrl =
        process.env.NEXT_PUBLIC_INVESTMENTS_URL || "http://localhost:3001";
      HashAuthService.redirectWithAuth(investmentsUrl, token, userData);
    } else {
      console.warn(
        "Dados de autenticação não encontrados para navegação - redirecionando para login"
      );

      const homeUrl =
        process.env.NEXT_PUBLIC_HOME_URL || "http://localhost:3000";

      window.location.href = homeUrl;
    }
  }, [storageService]);

  return useMemo(
    () => ({
      register,
      login,
      logout,
      isAuthenticated,
      getCurrentUser,
      getAuthToken,
      getUserAccount,
      navigateToInvestments,
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
      navigateToInvestments,
      isLoading,
    ]
  );
};
