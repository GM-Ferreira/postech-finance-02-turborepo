import { BaseApiClient } from "./BaseApiClient";
import {
  CreateUserRequest,
  CreateUserResponse,
  LoginRequest,
  LoginResponse,
  GetUserAccountResponse,
  ApiResponse,
} from "../types";

export class UserClient extends BaseApiClient {
  constructor(
    baseURL?: string,
    getTokenFn?: () => string | null,
    onUnauthorized?: () => void,
    onSlowRequest?: (show: boolean) => void
  ) {
    super(baseURL, getTokenFn, onUnauthorized, onSlowRequest);
  }

  /**
   * Register a new user
   * POST /user
   */
  async register(
    userData: CreateUserRequest
  ): Promise<ApiResponse<CreateUserResponse>> {
    return this.post<CreateUserResponse>("/user", userData);
  }

  /**
   * Login user
   * POST /user/auth
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.post<LoginResponse>("/user/auth", credentials);
  }

  /**
   * Get user account data using Bearer token
   * GET /account
   */
  async getUserAccount(): Promise<ApiResponse<GetUserAccountResponse>> {
    return this.get<GetUserAccountResponse>("/account");
  }
}
