"use client";

import { useCallback, useMemo } from "react";

import { HashAuthService } from "../services/HashAuthService";
import { StorageService } from "../services/StorageService";
import { TokenValidationService } from "../services/TokenValidationService";
import { AuthService } from "@repo/api";

export const useCrossAppNavigation = () => {
  const storageService = useMemo(() => new StorageService(), []);

  const authService = useMemo(() => {
    return new AuthService(() => storageService.getAuthToken());
  }, [storageService]);

  const navigateToApp = useCallback(
    (targetUrl: string) => {
      const token = storageService.getAuthToken();
      const userData = storageService.getUserData();

      if (token && userData) {
        console.log("Navegando com autenticação via hash para:", targetUrl);
        HashAuthService.redirectWithAuth(targetUrl, token, userData);
      } else {
        console.log("Navegando sem autenticação para:", targetUrl);
        window.location.href = targetUrl;
      }
    },
    [storageService]
  );

  const navigateToHome = useCallback(() => {
    const homeUrl = process.env.NEXT_PUBLIC_HOME_URL || "http://localhost:3000";
    navigateToApp(homeUrl);
  }, [navigateToApp]);

  const navigateToInvestments = useCallback(() => {
    const token = storageService.getAuthToken();
    const userData = storageService.getUserData();

    if (token && userData) {
      const investmentsUrl =
        process.env.NEXT_PUBLIC_INVESTMENTS_URL || "http://localhost:3001";
      console.log("Navegando com autenticação via hash para:", investmentsUrl);
      HashAuthService.redirectWithAuth(investmentsUrl, token, userData);
    } else {
      console.warn(
        "Dados de autenticação não encontrados para navegação para investments - redirecionando para login"
      );
      const homeUrl =
        process.env.NEXT_PUBLIC_HOME_URL || "http://localhost:3000";
      window.location.href = homeUrl;
    }
  }, [storageService]);

  const logoutAndNavigateToHome = useCallback(async () => {
    const baseUrl = process.env.NEXT_PUBLIC_HOME_URL || "http://localhost:3000";
    const homeUrl = `${baseUrl}/home`;

    console.log("Fazendo logout no servidor...");

    try {
      await TokenValidationService.logoutOnServer(authService);
    } catch (error) {
      console.warn("Erro no logout do servidor:", error);
    }

    storageService.clearAllUserData();

    console.log("Redirecionando para home...");
    HashAuthService.redirectWithLogout(homeUrl);
  }, [storageService, authService]);

  return {
    navigateToApp,
    navigateToHome,
    navigateToInvestments,
    logoutAndNavigateToHome,
  };
};
