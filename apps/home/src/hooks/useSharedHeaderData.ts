"use client";

import { useEffect, useMemo } from "react";

import { useAuth } from "@/hooks/useAuth";
import {
  useAppSelector,
  setUser,
  clearUser,
  useAppDispatch,
  selectIsLoggedIn,
  StorageService,
} from "@repo/ui";

export const useSharedHeaderData = () => {
  const { isLoggedIn, logout, currentUser } = useAuth();

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
      dispatch(
        setUser({
          name: currentUser.name,
          email: currentUser.email || "",
        })
      );
    } else if (!isLoggedIn && reduxIsLoggedIn) {
      dispatch(clearUser());
    }
  }, [isLoggedIn, currentUser, reduxIsLoggedIn, dispatch, logout, storageService]);

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
