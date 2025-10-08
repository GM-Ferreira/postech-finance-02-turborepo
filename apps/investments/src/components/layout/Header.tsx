"use client";

import { useState } from "react";
import {
  SharedHeader,
  StorageService,
  CrossDomainSyncService,
  LoadingOverlay,
} from "@repo/ui";
import {
  useAppSelector,
  clearUser,
  useAppDispatch,
  selectIsLoggedIn,
} from "@repo/ui";

const useInvestmentsHeaderData = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const reduxUser = useAppSelector((state) => state.user);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();
  const storageService = new StorageService();

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
