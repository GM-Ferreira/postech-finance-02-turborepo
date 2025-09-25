"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  SetStateAction,
} from "react";

import { useAuth } from "@/hooks/useAuth";

import { AccountService } from "@/services/AccountService";
import { Account } from "@/models/Account";
import { TransactionType } from "@/models/Transaction";
import { getDeviceInfo } from "@/lib/utils/BrowserInfo";
import { TransactionFormData } from "@/lib/schemas/transactionSchema";

type AccountContextType = {
  account: Account | null;
  showBalance: boolean;
  setShowBalance: (value: SetStateAction<boolean>) => void;
  addTransaction: (type: TransactionType, amount: number, date: Date) => void;
  deleteTransactions: (idsToDelete: string[]) => void;
  updateTransaction: (transactionId: string, data: TransactionFormData) => void;
};

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useAuth();

  const [account, setAccount] = useState<Account | null>(null);
  const [showBalance, setShowBalance] = useState(true);
  const [accountService, setAccountService] = useState<AccountService | null>(
    null
  );

  useEffect(() => {
    if (currentUser) {
      const service = new AccountService(currentUser.email);
      setAccountService(service);
      setAccount(service.getAccountData());
    } else {
      setAccountService(null);
      setAccount(null);
    }
  }, [currentUser]);

  const addTransaction = (
    type: TransactionType,
    amount: number,
    date: Date
  ) => {
    if (!accountService) return;
    const deviceInfo = getDeviceInfo();
    const description = `Adicionado via ${deviceInfo.os} - ${deviceInfo.browser}`;

    const updatedAccount = accountService.addTransaction(
      type,
      amount,
      date,
      description
    );

    setAccount(
      new Account(updatedAccount.balance, updatedAccount.transactions)
    );
  };

  const deleteTransactions = (idsToDelete: string[]) => {
    if (!accountService) return;
    const updatedAccount = accountService.deleteTransactions(idsToDelete);

    if (updatedAccount) {
      setAccount(
        new Account(updatedAccount.balance, updatedAccount.transactions)
      );
    }
  };

  const updateTransaction = (
    transactionId: string,
    data: TransactionFormData
  ) => {
    if (!accountService) return;
    const amountAsNumber = parseFloat(data.amount.replace(",", "."));

    const newData = {
      type: data.type,
      amount: amountAsNumber,
      date: data.date,
    };

    const updatedAccount = accountService.updateTransaction(
      transactionId,
      newData
    );

    if (updatedAccount) {
      setAccount(
        new Account(updatedAccount.balance, updatedAccount.transactions)
      );
    }
  };

  const value = {
    account,
    showBalance,
    setShowBalance,
    addTransaction,
    deleteTransactions,
    updateTransaction,
  };

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);

  if (context === undefined) {
    throw new Error("useAccount deve ser usado dentro de um AccountProvider");
  }
  return context;
};
