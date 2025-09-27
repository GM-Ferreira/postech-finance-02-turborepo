"use client";

import { useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";
import { useAppSelector, setUser, clearUser, useAppDispatch } from "@repo/ui";

export const useSharedHeaderData = () => {
  const { isLoggedIn, logout, currentUser } = useAuth();
  const reduxUser = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const externalLogout = localStorage.getItem("external-logout-flag");
    if (externalLogout === "true" && isLoggedIn) {
      localStorage.removeItem("external-logout-flag");
      logout();
      return;
    }

    if (isLoggedIn && currentUser && !reduxUser.isLoggedIn) {
      dispatch(
        setUser({
          name: currentUser.name,
          email: currentUser.email || "",
          isLoggedIn: true,
        })
      );
    } else if (!isLoggedIn && reduxUser.isLoggedIn) {
      dispatch(clearUser());
    }
  }, [isLoggedIn, currentUser, reduxUser.isLoggedIn, dispatch, logout]);

  const finalUser =
    currentUser || (reduxUser.name ? { name: reduxUser.name } : null);

  const finalIsLoggedIn = isLoggedIn || reduxUser.isLoggedIn;

  return {
    isLoggedIn: finalIsLoggedIn,
    currentUser: finalUser,
    isLoading: false,
    onLogin: () => {},
    onSignUp: () => {},
    onLogout: () => {
      localStorage.setItem("local-logout-flag", "true");
      logout();
      dispatch(clearUser());
    },
  };
};
