"use client";

import { SharedHeader, StorageService, CrossDomainSyncService } from "@repo/ui";
import {
  useAppSelector,
  clearUser,
  useAppDispatch,
  selectIsLoggedIn,
} from "@repo/ui";

const useInvestmentsHeaderData = () => {
  const reduxUser = useAppSelector((state) => state.user);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();
  const storageService = new StorageService();

  return {
    isLoggedIn,
    currentUser: reduxUser.name ? { name: reduxUser.name } : null,
    isLoading: false,
    onLogin: () => {
      window.location.href = "/home";
    },
    onSignUp: () => {
      window.location.href = "/home";
    },
    onLogout: async () => {
      storageService.setLocalLogoutFlag();
      storageService.clearAllUserData();
      dispatch(clearUser());

      try {
        await CrossDomainSyncService.syncLogout();
        console.log("Header - Investments - Logout sincronizado entre apps");
      } catch (error) {
        console.warn(
          "Header - Investments - Erro na sincronização de logout:",
          error
        );
      }

      setTimeout(() => {
        const homeUrl =
          process.env.NEXT_PUBLIC_HOME_URL || "http://localhost:3000";
        window.location.href = homeUrl;
      }, 100);
    },
  };
};

const InvestmentsHeader = () => {
  const headerData = useInvestmentsHeaderData();

  return <SharedHeader {...headerData} logoHref="/home" />;
};

export default InvestmentsHeader;
