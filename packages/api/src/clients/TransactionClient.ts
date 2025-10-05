import { BaseApiClient } from "./BaseApiClient";
import type {
  ApiResponse,
  GetTransactionsResponse,
  CreateTransactionRequest,
  CreateTransactionResponse,
  UpdateTransactionRequest,
  UpdateTransactionResponse,
  DeleteTransactionResponse,
} from "../types";

export class TransactionClient extends BaseApiClient {
  constructor(baseURL?: string, getTokenFn?: () => string | null, onUnauthorized?: () => void) {
    super(baseURL, getTokenFn, onUnauthorized);
  }

  /**
   * Get account transactions (statement)
   * GET /account/{accountId}/statement
   */
  async getTransactions(
    accountId: string
  ): Promise<ApiResponse<GetTransactionsResponse>> {
    return this.get<GetTransactionsResponse>(`/account/${accountId}/statement`);
  }

  /**
   * Create a new transaction
   * POST /account/{accountId}/transaction
   */
  async createTransaction(
    accountId: string,
    transactionData: Omit<CreateTransactionRequest, "accountId">
  ): Promise<ApiResponse<CreateTransactionResponse>> {
    return this.post<CreateTransactionResponse>(`/account/transaction`, {
      ...transactionData,
      accountId,
    });
  }

  /**
   * Update an existing transaction
   * PUT /account/{accountId}/transaction/{transactionId}
   */
  async updateTransaction(
    accountId: string,
    transactionId: string,
    transactionData: UpdateTransactionRequest
  ): Promise<ApiResponse<UpdateTransactionResponse>> {
    return this.put<UpdateTransactionResponse>(
      `/account/${accountId}/transaction/${transactionId}`,
      transactionData
    );
  }

  /**
   * Delete a transaction
   * DELETE /account/{accountId}/transaction/{transactionId}
   */
  async deleteTransaction(
    accountId: string,
    transactionId: string
  ): Promise<ApiResponse<DeleteTransactionResponse>> {
    return this.delete<DeleteTransactionResponse>(
      `/account/${accountId}/transaction/${transactionId}`
    );
  }
}
