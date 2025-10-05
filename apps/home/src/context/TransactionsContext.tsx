"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useCallback,
} from "react";

import { useTransactions } from "@/hooks/useTransactions";
import { useAuth } from "@/hooks/useAuth";

type TransactionsContextType = ReturnType<typeof useTransactions>;

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined
);

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const { logout } = useAuth();

  const handleTokenExpired = useCallback(() => {
    console.warn("Token expirou durante operação de transação");
    logout();
  }, [logout]);

  const transactionsData = useTransactions(handleTokenExpired);

  return (
    <TransactionsContext.Provider value={transactionsData}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactionsContext = () => {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error(
      "useTransactionsContext deve ser usado dentro de um TransactionsProvider"
    );
  }
  return context;
};
