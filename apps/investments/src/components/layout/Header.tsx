"use client";

import { useState, useEffect, useMemo } from "react";

import {
  SharedHeader,
  StorageService,
  CrossDomainSyncService,
  LoadingOverlay,
  useAppSelector,
  clearUser,
  useAppDispatch,
  selectIsLoggedIn,
  setUser,
} from "@repo/ui";

const useInvestmentsHeaderData = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const reduxUser = useAppSelector((state) => state.user);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();
  const storageService = useMemo(() => new StorageService(), []);

  // Monitor de localStorage para detectar limpeza
  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalRemoveItem = localStorage.removeItem.bind(localStorage);
    const originalClear = localStorage.clear.bind(localStorage);
    const originalSetItem = localStorage.setItem.bind(localStorage);

    localStorage.removeItem = function (key: string) {
      console.log("🚨 localStorage.removeItem chamado:", key);
      console.trace("Stack trace da remoção:");
      return originalRemoveItem(key);
    };

    localStorage.clear = function () {
      console.log("🚨 localStorage.clear chamado!");
      console.trace("Stack trace da limpeza:");
      return originalClear();
    };

    localStorage.setItem = function (key: string, value: string) {
      if (key.includes("@bytebank")) {
        console.log("📝 localStorage.setItem chamado:", key, "=", value);
      }
      return originalSetItem(key, value);
    };

    return () => {
      localStorage.removeItem = originalRemoveItem;
      localStorage.clear = originalClear;
      localStorage.setItem = originalSetItem;
    };
  }, []);

  useEffect(() => {
    console.log("Investments Header - Verificando localStorage...");

    const userData = storageService.getUserData();
    const syncCompleted = storageService.hasSyncCompletedFlag();

    console.log("LocalStorage state:", {
      hasToken: storageService.isAuthenticated(),
      userData,
      reduxLoggedIn: isLoggedIn,
      syncCompleted,
    });

    if (userData && !isLoggedIn) {
      console.log("Carregando dados do localStorage para Redux...");
      dispatch(
        setUser({
          name: userData.name,
          email: userData.email,
          accountId: userData.accountId,
        })
      );
      console.log("Dados carregados para Redux");

      if (syncCompleted) {
        storageService.clearSyncCompletedFlag();
        console.log("Flag de sync removida após carregar dados");
      }
    }
  }, [dispatch, isLoggedIn, storageService]);

  return {
    isLoggedIn,
    currentUser: reduxUser.name ? { name: reduxUser.name } : null,
    isLoading: false,
    isLoggingOut,
    onLogin: () => {
      window.location.href = "/home";
    },
    onSignUp: () => {
      window.location.href = "/home";
    },
    onLogout: async () => {
      setIsLoggingOut(true);

      try {
        storageService.setLocalLogoutFlag();
        storageService.clearAllUserData();
        dispatch(clearUser());

        await CrossDomainSyncService.syncLogout();
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const homeUrl =
          process.env.NEXT_PUBLIC_HOME_URL || "http://localhost:3000";
        window.location.href = homeUrl;
      } catch (error) {
        console.warn("Erro durante logout:", error);

        setTimeout(() => {
          const homeUrl =
            process.env.NEXT_PUBLIC_HOME_URL || "http://localhost:3000";
          window.location.href = homeUrl;
        }, 2000);
      }
    },
  };
};

const InvestmentsHeader = () => {
  const headerData = useInvestmentsHeaderData();
  const homeUrl = process.env.NEXT_PUBLIC_HOME_URL || "http://localhost:3000";

  return (
    <>
      <SharedHeader {...headerData} logoHref={`${homeUrl}/home`} />

      <LoadingOverlay
        isVisible={headerData.isLoggingOut}
        message="Saindo da conta..."
        submessage="Sincronizando dados entre aplicativos"
      />
    </>
  );
};

export default InvestmentsHeader;
