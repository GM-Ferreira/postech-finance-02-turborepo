"use client";

import { useEffect } from "react";

import { useAuth } from "@/hooks/useAuth";
import {
  useAppSelector,
  setUser,
  clearUser,
  useAppDispatch,
  selectIsLoggedIn,
} from "@repo/ui";

export const useSharedHeaderData = () => {
  const { isLoggedIn, logout, currentUser } = useAuth();

  const reduxUser = useAppSelector((state) => state.user);
  const reduxIsLoggedIn = useAppSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const externalLogout = localStorage.getItem("external-logout-flag");

    if (externalLogout === "true" && isLoggedIn) {
      localStorage.removeItem("external-logout-flag");
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
  }, [isLoggedIn, currentUser, reduxIsLoggedIn, dispatch, logout]);

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
      localStorage.setItem("local-logout-flag", "true");
      logout();
      dispatch(clearUser());
    },
  };
};
