import { UserClient } from "../clients/UserClient";
import {
  CreateUserRequest,
  LoginRequest,
  ApiResponse,
  CreateUserResponse,
  LoginResponse,
  GetUserAccountResponse,
} from "../types";

export class AuthService {
  private userClient: UserClient;

  constructor(getTokenFn?: () => string | null, onUnauthorized?: () => void) {
    this.userClient = new UserClient(undefined, getTokenFn, onUnauthorized);
  }

  /**
   * Register a new user
   */
  async registerUser(
    userData: CreateUserRequest
  ): Promise<ApiResponse<CreateUserResponse>> {
    try {
      const response = await this.userClient.register(userData);

      if (response.error) {
        return response;
      }

      return {
        data: response.data,
        status: response.status,
        message: "User registered successfully",
      };
    } catch (error) {
      return {
        error: "Registration failed. Please try again.",
        status: 500,
      };
    }
  }

  /**
   * Login user - returns API response only
   */
  async loginUser(
    credentials: LoginRequest
  ): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await this.userClient.login(credentials);
      return response;
    } catch (error) {
      return {
        error: "Login failed. Please check your credentials.",
        status: 401,
      };
    }
  }

  /**
   * Get user account data using Bearer token
   */
  async getUserAccount(): Promise<ApiResponse<GetUserAccountResponse>> {
    try {
      const response = await this.userClient.getUserAccount();
      return response;
    } catch (error) {
      return {
        error: "Failed to fetch user account data.",
        status: 500,
      };
    }
  }
}
