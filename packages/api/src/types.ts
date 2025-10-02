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
