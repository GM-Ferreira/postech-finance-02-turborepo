import { TransactionClient } from "../clients/TransactionClient";
import type {
  ApiResponse,
  GetTransactionsResponse,
  CreateTransactionRequest,
  CreateTransactionResponse,
  UpdateTransactionRequest,
  UpdateTransactionResponse,
  DeleteTransactionResponse,
} from "../types";

export class TransactionService {
  private transactionClient: TransactionClient;

  constructor(getTokenFn?: () => string | null, onUnauthorized?: () => void) {
    this.transactionClient = new TransactionClient(
      undefined,
      getTokenFn,
      onUnauthorized
    );
  }

  /**
   * Get account transactions with error handling
   */
  async getTransactions(
    accountId: string
  ): Promise<ApiResponse<GetTransactionsResponse>> {
    try {
      const response = await this.transactionClient.getTransactions(accountId);
      return response;
    } catch (error) {
      return {
        error: "Failed to fetch transactions.",
        status: 500,
      };
    }
  }

  /**
   * Create a new transaction with error handling
   */
  async createTransaction(
    accountId: string,
    transactionData: Omit<CreateTransactionRequest, "accountId">
  ): Promise<ApiResponse<CreateTransactionResponse>> {
    try {
      const response = await this.transactionClient.createTransaction(
        accountId,
        transactionData
      );
      return response;
    } catch (error) {
      return {
        error: "Failed to create transaction.",
        status: 500,
      };
    }
  }

  /**
   * Update a transaction with error handling
   */
  async updateTransaction(
    accountId: string,
    transactionId: string,
    transactionData: UpdateTransactionRequest
  ): Promise<ApiResponse<UpdateTransactionResponse>> {
    try {
      const response = await this.transactionClient.updateTransaction(
        accountId,
        transactionId,
        transactionData
      );
      return response;
    } catch (error) {
      return {
        error: "Failed to update transaction.",
        status: 500,
      };
    }
  }

  /**
   * Delete a transaction with error handling
   */
  async deleteTransaction(
    accountId: string,
    transactionId: string
  ): Promise<ApiResponse<DeleteTransactionResponse>> {
    try {
      const response = await this.transactionClient.deleteTransaction(
        accountId,
        transactionId
      );
      return response;
    } catch (error) {
      return {
        error: "Failed to delete transaction.",
        status: 500,
      };
    }
  }
}
