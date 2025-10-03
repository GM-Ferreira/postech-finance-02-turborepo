"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";

import type {
  Transaction,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  TransactionType,
} from "@repo/api";
import { StorageService } from "@repo/ui";

import { useApiTransactions } from "./useApiTransactions";
import { useAuth } from "./useAuth";

export const useTransactions = () => {
  const { isLoggedIn, currentUser } = useAuth();
  const {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    isLoading: apiLoading,
  } = useApiTransactions();

  const storageService = useMemo(() => new StorageService(), []);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lastFetchRef = useRef<number>(0);
  const hasInitializedRef = useRef<boolean>(false);

  const [showBalance, setShowBalance] = useState(() =>
    storageService.getShowBalance()
  );

  const balance = useMemo(() => {
    return transactions.reduce((sum, transaction) => {
      return sum + transaction.value;
    }, 0);
  }, [transactions]);

  const fetchTransactions = useCallback(
    async (force = false) => {
      const now = Date.now();

      if (!force && now - lastFetchRef.current < 1000) {
        console.warn("Skipping fetch due to throttle");
        return;
      }

      setIsLoading(true);
      setError(null);
      lastFetchRef.current = now;

      try {
        const response = await getTransactions();

        if (response.data?.result?.transactions) {
          const transactions = response.data.result.transactions;
          setTransactions(transactions);
        } else if (response.error) {
          console.error("Error in fetchTransactions:", response.error);
          setError(response.error);
        }
      } catch (err) {
        const errorMsg = "Erro ao carregar transações";
        setError(errorMsg);
        console.error({ errorMsg, err });
      } finally {
        setIsLoading(false);
      }
    },
    [getTransactions]
  );

  useEffect(() => {
    if (!isLoggedIn) {
      setTransactions([]);
      setError(null);
    }

    hasInitializedRef.current = false;
    lastFetchRef.current = 0;
  }, [isLoggedIn, currentUser]);

  useEffect(() => {
    if (!hasInitializedRef.current && isLoggedIn && currentUser) {
      hasInitializedRef.current = true;
      fetchTransactions(true);
    }
  }, [fetchTransactions, isLoggedIn, currentUser]);

  const handleSetShowBalance = useCallback(
    (value: boolean) => {
      setShowBalance(value);
      storageService.setShowBalance(value);
    },
    [storageService]
  );

  const addTransaction = useCallback(
    async (type: TransactionType, value: number, date: Date) => {
      const data: Omit<CreateTransactionRequest, "accountId"> = {
        type,
        value,
        description: `${type} - ${value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} - ${date.toISOString().split("T")[0]}`,
        date: date.toISOString(),
      };

      try {
        const response = await createTransaction(data);
        if (response.data) {
          await fetchTransactions(true);
        }

        return response;
      } catch (err) {
        console.error("Erro ao criar transação:", err);
        throw err;
      }
    },
    [createTransaction, fetchTransactions]
  );

  const editTransaction = useCallback(
    async (
      transactionId: string,
      data: {
        type: TransactionType;
        value: number;
        date: Date;
      }
    ) => {
      const updateData: UpdateTransactionRequest = {
        type: data.type,
        value: data.value,
        description: `${data.type} - ${data.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`,
        date: data.date.toISOString(),
      };

      try {
        const response = await updateTransaction(transactionId, updateData);

        if (response.data) {
          await fetchTransactions(true);
        } else if (response.error) {
          console.error("Erro ao editar transação:", response.error);
        }

        return response;
      } catch (err) {
        console.error("Erro ao editar transação:", err);
        throw err;
      }
    },
    [updateTransaction, fetchTransactions]
  );

  const removeTransactionInternal = useCallback(
    async (transactionId: string) => {
      const response = await deleteTransaction(transactionId);
      if (response.error) {
        console.error("Erro ao deletar transação:", response.error);
        throw new Error(
          `Erro ao deletar transação ${transactionId}: ${response.error}`
        );
      }
      return response;
    },
    [deleteTransaction]
  );

  const removeTransaction = useCallback(
    async (transactionId: string) => {
      try {
        const response = await removeTransactionInternal(transactionId);

        if (response.data) {
          await fetchTransactions(true);
        }

        return response;
      } catch (err) {
        console.error("Erro ao deletar transação:", err);
        throw err;
      }
    },
    [removeTransactionInternal, fetchTransactions]
  );

  const deleteTransactions = useCallback(
    async (idsToDelete: string[]) => {
      try {
        const deletePromises = idsToDelete.map((id) =>
          removeTransactionInternal(id)
        );

        await Promise.all(deletePromises);

        await fetchTransactions(true);
      } catch (error) {
        console.error("Erro ao deletar transações:", error);
        throw error;
      }
    },
    [removeTransactionInternal, fetchTransactions]
  );

  const clearTransactions = useCallback(() => {
    setTransactions([]);
    setError(null);
    hasInitializedRef.current = false;
    lastFetchRef.current = 0;
  }, []);

  return {
    transactions,
    balance,
    isLoading: isLoading || apiLoading,
    error,

    showBalance,
    setShowBalance: handleSetShowBalance,

    fetchTransactions,
    addTransaction,
    editTransaction,
    removeTransaction,
    deleteTransactions,
    clearTransactions,
  };
};
