"use client";

import { useEffect, useRef } from "react";

import { setUser } from "../store/userSlice";
import { useAppDispatch } from "../store/hooks";
import { useHydration } from "../hooks/useHydration";
import { StorageService } from "../services/StorageService";

declare global {
  interface Window {
    __isUpdatingFromExternal?: () => boolean;
  }
}

export const CrossAppSyncProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const dispatch = useAppDispatch();
  const isUpdatingFromExternalRef = useRef(false);
  const isHydrated = useHydration();
  const storageService = useRef(new StorageService()).current;

  useEffect(() => {
    if (typeof window === "undefined" || !isHydrated) return;

    console.log("🔵 CrossAppSyncProvider: Verificando userData no mount");
    const storage = new StorageService();
    const userData = storage.getUserData();

    console.log("🔵 CrossAppSyncProvider: userData encontrado:", !!userData);

    if (userData) {
      console.log("🔵 CrossAppSyncProvider: Despachando userData para Redux");
      isUpdatingFromExternalRef.current = true;
      dispatch(setUser(userData));

      setTimeout(() => {
        isUpdatingFromExternalRef.current = false;
      }, 100);
    }
  }, [dispatch, isHydrated]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleUserStateChange = (event: CustomEvent) => {
      console.log("🔵 CrossAppSyncProvider: handleUserStateChange chamado", {
        isUpdating: isUpdatingFromExternalRef.current,
        eventDetail: !!event.detail,
      });

      if (!isUpdatingFromExternalRef.current) {
        if (event.detail) {
          console.log(
            "🔵 CrossAppSyncProvider: Processando user change (login)"
          );
          isUpdatingFromExternalRef.current = true;
          dispatch(setUser(event.detail));
          setTimeout(() => {
            isUpdatingFromExternalRef.current = false;
          }, 100);
        } else {
          console.log(
            "🔵 CrossAppSyncProvider: Processando user change (logout)"
          );
          const hasLocalLogout = storageService.hasLocalLogoutFlag();
          console.log(
            "🔵 CrossAppSyncProvider: hasLocalLogout:",
            hasLocalLogout
          );

          if (hasLocalLogout) {
            console.log("🔵 CrossAppSyncProvider: Limpando flag local logout");
            storageService.clearLocalLogoutFlag();
          } else {
            console.log(
              "🔵 CrossAppSyncProvider: Setando flag external logout"
            );
            storageService.setExternalLogoutFlag();
          }
        }
      }
    };

    window.__isUpdatingFromExternal = () => isUpdatingFromExternalRef.current;
    window.addEventListener(
      "@bytebank/user-changed",
      handleUserStateChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "@bytebank/user-changed",
        handleUserStateChange as EventListener
      );
    };
  }, [dispatch, storageService]);

  return <>{children}</>;
};
