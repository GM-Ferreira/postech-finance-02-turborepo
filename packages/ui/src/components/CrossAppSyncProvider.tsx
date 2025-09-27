"use client";

import { useEffect, useRef } from "react";

import { setUser } from "../store/userSlice";
import { useAppDispatch } from "../store/hooks";
import { useHydration } from "../hooks/useHydration";

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

  useEffect(() => {
    if (typeof window === "undefined" || !isHydrated) return;

    const savedState = localStorage.getItem("redux-user-state");
    if (savedState) {
      try {
        const userState = JSON.parse(savedState);

        isUpdatingFromExternalRef.current = true;
        dispatch(setUser(userState));
        setTimeout(() => {
          isUpdatingFromExternalRef.current = false;
        }, 100);
      } catch (error) {
        console.error("Erro ao carregar estado do localStorage:", error);
      }
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
          const isLocalLogout = localStorage.getItem("local-logout-flag");
          if (isLocalLogout === "true") {
            localStorage.removeItem("local-logout-flag");
          } else {
            localStorage.setItem("external-logout-flag", "true");
          }
        }
      }
    };

    window.__isUpdatingFromExternal = () => isUpdatingFromExternalRef.current;
    window.addEventListener(
      "redux-user-changed",
      handleUserStateChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "redux-user-changed",
        handleUserStateChange as EventListener
      );
    };
  }, [dispatch]);

  return <>{children}</>;
};
