"use client";

import { useEffect, useMemo, useState } from "react";

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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { isLoggedIn, logout, currentUser } = useAuthWithTransactions();

  const reduxUser = useAppSelector((state) => state.user);
  const reduxIsLoggedIn = useAppSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();
  const storageService = useMemo(() => new StorageService(), []);

  useEffect(() => {
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
  }, [isLoggedIn, currentUser, reduxIsLoggedIn, dispatch, storageService]);

  const finalUser =
    currentUser || (reduxUser.name ? { name: reduxUser.name } : null);

  const finalIsLoggedIn = isLoggedIn || reduxIsLoggedIn;

  return {
    isLoggedIn: finalIsLoggedIn,
    currentUser: finalUser,
    isLoading: false,
    isLoggingOut,
    onLogin: () => {},
    onSignUp: () => {},
    onLogout: async () => {
      setIsLoggingOut(true);

      try {
        logout();
        dispatch(clearUser());
      } catch (error) {
        console.warn("Home - Erro durante logout:", error);
      } finally {
        setIsLoggingOut(false);
      }
    },
  };
};
