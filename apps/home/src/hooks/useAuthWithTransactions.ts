"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useTransactionsContext } from "@/context/TransactionsContext";

export const useAuthWithTransactions = () => {
  const authContext = useContext(AuthContext);
  const { clearTransactions } = useTransactionsContext();

  if (authContext === undefined) {
    throw new Error(
      "useAuthWithTransactions deve ser usado dentro de um AuthProvider"
    );
  }

  const logout = () => {
    clearTransactions();
    authContext.logout();
  };

  return {
    ...authContext,
    logout,
  };
};
