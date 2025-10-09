"use client";

import { useEffect, useMemo } from "react";

import { AuthService } from "@repo/api";

import { setUser, clearUser } from "../store/userSlice";
import { useAppDispatch } from "../store/hooks";
import { useHydration } from "../hooks/useHydration";
import { StorageService } from "../services/StorageService";
import { HashAuthService } from "../services/HashAuthService";
import { TokenValidationService } from "../services/TokenValidationService";

export const CrossAppSyncProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const isHydrated = useHydration();

  const authService = useMemo(() => {
    const storage = new StorageService();
    return new AuthService(
      () => storage.getAuthToken(),
      () => {
        storage.clearAllUserData();
        dispatch(clearUser());
      }
    );
  }, [dispatch]);

  useEffect(() => {
    if (typeof window === "undefined" || !isHydrated) return;

    const storage = new StorageService();

    const hasLogout = HashAuthService.hasLogoutInHash();
    if (hasLogout) {
      console.log("Logout detectado no hash, limpando dados...");
      storage.clearAllUserData();
      dispatch(clearUser());
      HashAuthService.clearLogoutHash();
      return;
    }

    const hashAuth = HashAuthService.extractAuthFromHash();
    if (hashAuth) {
      console.log("Dados de autenticação encontrados no hash, salvando...");
      storage.setAuthToken(hashAuth.token);
      storage.setUserData(hashAuth.userData);
      dispatch(setUser(hashAuth.userData));
      HashAuthService.clearAuthHash();
      return;
    }

    const token = storage.getAuthToken();
    const userData = storage.getUserData();

    if (token && userData) {
      dispatch(setUser(userData));

      if (TokenValidationService.needsValidation()) {
        console.log("Validando token no servidor...");

        TokenValidationService.validateTokenWithCache(authService)
          .then((result) => {
            if (result.shouldLogout) {
              console.log("Token inválido - fazendo logout...");
              storage.clearAllUserData();
              dispatch(clearUser());

              if (
                window.location.pathname !== "/" &&
                !window.location.pathname.includes("/home")
              ) {
                const homeUrl =
                  process.env.NEXT_PUBLIC_HOME_URL || "http://localhost:3000";
                window.location.href = homeUrl;
              }
            } else if (result.userData) {
              const updatedUserData = {
                name: result.userData.username,
                email: result.userData.email,
                accountId: userData.accountId,
              };
              storage.setUserData(updatedUserData);
              dispatch(setUser(updatedUserData));
            }
          })
          .catch((error) => {
            console.warn("Erro na validação do token:", error);
          });
      }
    }
  }, [dispatch, isHydrated, authService]);

  return <>{children}</>;
};
