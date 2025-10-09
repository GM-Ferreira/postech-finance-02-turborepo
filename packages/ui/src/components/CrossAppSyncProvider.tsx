"use client";

import { useEffect } from "react";
import { setUser, clearUser } from "../store/userSlice";
import { useAppDispatch } from "../store/hooks";
import { useHydration } from "../hooks/useHydration";
import { StorageService } from "../services/StorageService";
import { HashAuthService } from "../services/HashAuthService";

export const CrossAppSyncProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const isHydrated = useHydration();

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

    const userData = storage.getUserData();
    if (userData) {
      dispatch(setUser(userData));
    }
  }, [dispatch, isHydrated]);

  return <>{children}</>;
};
