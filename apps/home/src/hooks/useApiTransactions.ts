"use client";

import { useState, useCallback, useMemo } from "react";

import { TransactionService } from "@repo/api";
import { StorageService } from "@repo/ui";
import type {
  ApiResponse,
  GetTransactionsResponse,
  CreateTransactionRequest,
  CreateTransactionResponse,
  UpdateTransactionRequest,
  UpdateTransactionResponse,
  DeleteTransactionResponse,
} from "@repo/api";

export const useApiTransactions = (
  onTokenExpired?: () => void,
  onSlowRequest?: (show: boolean) => void
) => {
  const [isLoading, setIsLoading] = useState(false);

  const storageService = useMemo(() => new StorageService(), []);

  const transactionService = useMemo(
    () =>
      new TransactionService(
        () => storageService.getAuthToken(),
        onTokenExpired,
        onSlowRequest
      ),
    [storageService, onTokenExpired, onSlowRequest]
  );

  const getTransactions = useCallback(async (): Promise<
    ApiResponse<GetTransactionsResponse>
  > => {
    setIsLoading(true);
    try {
      const userAccount = storageService.getUserData();

      if (userAccount) {
        const accountId = userAccount.accountId;
        const response = await transactionService.getTransactions(accountId);
        return response;
      }

      return {
        data: undefined,
        error: "User account not found",
        status: 404,
      };
    } finally {
      setIsLoading(false);
    }
  }, [transactionService, storageService]);

  const createTransaction = useCallback(
    async (
      transactionData: Omit<CreateTransactionRequest, "accountId">
    ): Promise<ApiResponse<CreateTransactionResponse>> => {
      setIsLoading(true);
      try {
        const userAccount = storageService.getUserData();

        if (userAccount) {
          const accountId = userAccount.accountId;
          const response = await transactionService.createTransaction(
            accountId,
            transactionData
          );
          return response;
        }

        return {
          data: undefined,
          error: "User account not found",
          status: 404,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [transactionService, storageService]
  );

  const updateTransaction = useCallback(
    async (
      transactionId: string,
      transactionData: UpdateTransactionRequest
    ): Promise<ApiResponse<UpdateTransactionResponse>> => {
      setIsLoading(true);
      try {
        const userAccount = storageService.getUserData();

        if (userAccount) {
          const accountId = userAccount.accountId;
          const response = await transactionService.updateTransaction(
            accountId,
            transactionId,
            transactionData
          );
          return response;
        }

        return {
          data: undefined,
          error: "User account not found",
          status: 404,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [transactionService, storageService]
  );

  const deleteTransaction = useCallback(
    async (
      transactionId: string
    ): Promise<ApiResponse<DeleteTransactionResponse>> => {
      setIsLoading(true);
      try {
        const userAccount = storageService.getUserData();

        if (userAccount) {
          const accountId = userAccount.accountId;
          const response = await transactionService.deleteTransaction(
            accountId,
            transactionId
          );
          return response;
        }

        return {
          data: undefined,
          error: "User account not found",
          status: 404,
        };
      } finally {
        setIsLoading(false);
      }
    },
    [transactionService, storageService]
  );

  return useMemo(
    () => ({
      getTransactions,
      createTransaction,
      updateTransaction,
      deleteTransaction,
      isLoading,
    }),
    [
      getTransactions,
      createTransaction,
      updateTransaction,
      deleteTransaction,
      isLoading,
    ]
  );
};
