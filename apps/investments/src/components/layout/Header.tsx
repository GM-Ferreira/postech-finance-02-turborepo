"use client";

import { SharedHeader } from "@repo/ui";
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
    onLogout: () => {
      dispatch(clearUser());

      setTimeout(() => {
        window.location.href = "/home";
      }, 100);
    },
  };
};

const InvestmentsHeader = () => {
  const headerData = useInvestmentsHeaderData();

  return <SharedHeader {...headerData} logoHref="/home" />;
};

export default InvestmentsHeader;
