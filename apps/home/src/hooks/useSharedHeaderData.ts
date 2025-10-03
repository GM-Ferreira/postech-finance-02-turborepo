"use client";

import { useEffect, useMemo } from "react";

import { useAuthWithTransactions } from "@/hooks/useAuthWithTransactions";
import {
  useAppSelector,
  setUser,
  clearUser,
  useAppDispatch,
  selectIsLoggedIn,
  StorageService,
} from "@repo/ui";

export const useSharedHeaderData = () => {
  const { isLoggedIn, logout, currentUser } = useAuthWithTransactions();

  const reduxUser = useAppSelector((state) => state.user);
  const reduxIsLoggedIn = useAppSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();
  const storageService = useMemo(() => new StorageService(), []);

  useEffect(() => {
    const hasExternalLogout = storageService.hasExternalLogoutFlag();

    if (hasExternalLogout && isLoggedIn) {
      storageService.clearExternalLogoutFlag();
      logout();
      return;
    }

    if (isLoggedIn && currentUser && !reduxIsLoggedIn) {
      const userData = storageService.getUserData();
      if (userData?.accountId) {
        dispatch(
          setUser({
            name: currentUser.name,
            email: currentUser.email || "",
            accountId: userData.accountId,
          })
        );
      }
    } else if (!isLoggedIn && reduxIsLoggedIn) {
      dispatch(clearUser());
    }
  }, [
    isLoggedIn,
    currentUser,
    reduxIsLoggedIn,
    dispatch,
    logout,
    storageService,
  ]);

  const finalUser =
    currentUser || (reduxUser.name ? { name: reduxUser.name } : null);

  const finalIsLoggedIn = isLoggedIn || reduxIsLoggedIn;

  return {
    isLoggedIn: finalIsLoggedIn,
    currentUser: finalUser,
    isLoading: false,
    onLogin: () => {},
    onSignUp: () => {},
    onLogout: () => {
      storageService.setLocalLogoutFlag();
      logout();
      dispatch(clearUser());
    },
  };
};
