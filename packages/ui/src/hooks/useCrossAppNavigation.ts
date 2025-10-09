"use client";

import { useCallback, useMemo } from "react";

import { HashAuthService } from "../services/HashAuthService";
import { StorageService } from "../services/StorageService";

export const useCrossAppNavigation = () => {
  const storageService = useMemo(() => new StorageService(), []);

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

  const logoutAndNavigateToHome = useCallback(() => {
    const baseUrl = process.env.NEXT_PUBLIC_HOME_URL || "http://localhost:3000";
    const homeUrl = `${baseUrl}/home`;

    storageService.clearAllUserData();

    console.log("Fazendo logout e redirecionando para home...");
    HashAuthService.redirectWithLogout(homeUrl);
  }, [storageService]);

  return {
    navigateToApp,
    navigateToHome,
    navigateToInvestments,
    logoutAndNavigateToHome,
  };
};
