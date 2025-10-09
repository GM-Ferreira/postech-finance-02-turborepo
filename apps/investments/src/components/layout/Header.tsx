"use client";

import { useState, useEffect, useMemo } from "react";

import {
  SharedHeader,
  StorageService,
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

  useEffect(() => {
    const userData = storageService.getUserData();
    const hasToken = storageService.isAuthenticated();

    if (userData && hasToken && !isLoggedIn) {
      dispatch(
        setUser({
          name: userData.name,
          email: userData.email,
          accountId: userData.accountId,
        })
      );
    }
  }, [dispatch, isLoggedIn, storageService]);

  return {
    isLoggedIn,
    currentUser: reduxUser.name ? { name: reduxUser.name } : null,
    isLoading: false,
    isLoggingOut,
    onLogin: () => {
      const homeUrl =
        process.env.NEXT_PUBLIC_HOME_URL || "http://localhost:3000";
      window.location.href = homeUrl;
    },
    onSignUp: () => {
      const homeUrl =
        process.env.NEXT_PUBLIC_HOME_URL || "http://localhost:3000";
      window.location.href = homeUrl;
    },
    onLogout: async () => {
      setIsLoggingOut(true);

      storageService.clearUserData();
      dispatch(clearUser());

      const homeUrl =
        process.env.NEXT_PUBLIC_HOME_URL || "http://localhost:3000";
      window.location.href = homeUrl;
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
