// Base types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  data?: any;
}

// User related types
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
}

export interface CreateUserResponse {
  message: string;
  result: {
    id: string;
    username: string;
    email: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  result: {
    token: string;
  };
}

export interface GetUserAccountResponse {
  message: string;
  result: {
    userInfo: {
      username: string;
      email: string;
    };
    account: [
      {
        id: string;
        type: string;
        userId: string;
      },
    ];
    transactions: [
      {
        id: string;
        accountId: string;
        type: string;
        value: number;
        date: string;
      },
    ];
    cards: [
      {
        id: string;
        accountId: string;
        type: string;
        is_blocked: boolean;
        number: string;
        dueDate: string;
        functions: string;
        cvc: string;
        paymentDate: null;
        name: string;
      },
    ];
  };
}

// Transaction related types

export type TransactionType = "Deposit" | "Transfer" | "Payment";

export const transactionTypeDisplayNames: { [key in TransactionType]: string } =
  {
    Deposit: "Depósito",
    Transfer: "Transferência",
    Payment: "Pagamento",
  };

export const transactionSelectOptions = [
  { value: "Deposit", label: "Depósito" },
  { value: "Transfer", label: "Transferência" },
  { value: "Payment", label: "Pagamento" },
];

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  value: number;
  date: string;
  description?: string;
}

export interface GetTransactionsResponse {
  message: string;
  result: {
    transactions: Transaction[];
  };
}

export interface CreateTransactionRequest {
  accountId: string;
  type: TransactionType;
  value: number;
  description?: string;
}

export interface CreateTransactionResponse {
  message: string;
  result: {
    transaction: Transaction;
  };
}

export interface UpdateTransactionRequest {
  type?: TransactionType;
  value?: number;
  description?: string;
}

export interface UpdateTransactionResponse {
  message: string;
  result: {
    transaction: Transaction;
  };
}

export interface DeleteTransactionResponse {
  message: string;
  result: {
    deleted: boolean;
    transactionId: string;
  };
}
