"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useCallback,
} from "react";

import { useToast } from "@/context/ToastContext";

import { useTransactions } from "@/hooks/useTransactions";
import { useAuth } from "@/hooks/useAuth";

type TransactionsContextType = ReturnType<typeof useTransactions>;

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined
);

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const { logout } = useAuth();
  const { setShowSlowApiToast } = useToast();

  const handleTokenExpired = useCallback(() => {
    console.warn("Token expirou durante operação de transação");
    logout();
  }, [logout]);

  const handleSlowRequest = useCallback(
    (show: boolean) => {
      setShowSlowApiToast(show);
    },
    [setShowSlowApiToast]
  );

  const transactionsData = useTransactions(
    handleTokenExpired,
    handleSlowRequest
  );

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
