"use client";

import React, { createContext, useContext, ReactNode } from "react";

import { useTransactions } from "@/hooks/useTransactions";

type TransactionsContextType = ReturnType<typeof useTransactions>;

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined
);

export const TransactionsProvider = ({ children }: { children: ReactNode }) => {
  const transactionsData = useTransactions();

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
