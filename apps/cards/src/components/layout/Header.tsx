"use client";

import { SharedHeader } from "@repo/ui";
import { useAppSelector, clearUser, useAppDispatch } from "@repo/ui";

const useCardsHeaderData = () => {
  const reduxUser = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  return {
    isLoggedIn: reduxUser.isLoggedIn,
    currentUser: reduxUser.name ? { name: reduxUser.name } : null,
    isLoading: false,
    onLogin: () => {
      window.location.href = "/home";
    },
    onSignUp: () => {
      window.location.href = "/home";
    },
    onLogout: () => {
      dispatch(clearUser());

      setTimeout(() => {
        window.location.href = "/home";
      }, 100);
    },
  };
};

const CardsHeader = () => {
  const headerData = useCardsHeaderData();

  return <SharedHeader {...headerData} logoHref="/home" />;
};

export default CardsHeader;
