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

    const storage = new StorageService();
    const userData = storage.getUserData();

    if (userData) {
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
      if (!isUpdatingFromExternalRef.current) {
        if (event.detail) {
          isUpdatingFromExternalRef.current = true;
          dispatch(setUser(event.detail));
          setTimeout(() => {
            isUpdatingFromExternalRef.current = false;
          }, 100);
        } else {
          const hasLocalLogout = storageService.hasLocalLogoutFlag();
          if (hasLocalLogout) {
            storageService.clearLocalLogoutFlag();
          } else {
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
