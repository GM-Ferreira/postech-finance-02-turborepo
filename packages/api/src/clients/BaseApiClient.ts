import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

import { ApiResponse, ApiError } from "../types";

declare module "axios" {
  export interface InternalAxiosRequestConfig {
    requestId?: string;
  }
}

export class BaseApiClient {
  protected client: AxiosInstance;
  protected baseURL: string;
  private getTokenFn?: () => string | null;
  private onUnauthorized?: () => void;
  private onSlowRequest?: (show: boolean) => void;
  private slowRequestTimers: Map<string, NodeJS.Timeout> = new Map();

  constructor(
    baseURL: string = "https://postech-finance-02-api.onrender.com", // TODO - adicionar variável de ambiente
    getTokenFn?: () => string | null,
    onUnauthorized?: () => void,
    onSlowRequest?: (show: boolean) => void
  ) {
    this.baseURL = baseURL;
    this.getTokenFn = getTokenFn;
    this.onUnauthorized = onUnauthorized;
    this.onSlowRequest = onSlowRequest;

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 50000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config: any) => {
        const token = this.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        const requestId = Math.random().toString(36).substring(7);
        config.requestId = requestId;

        const timer = setTimeout(() => {
          if (this.onSlowRequest) {
            this.onSlowRequest(true);
          }
        }, 6000);

        this.slowRequestTimers.set(requestId, timer);

        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        const requestId = response.config.requestId;

        if (requestId && this.slowRequestTimers.has(requestId)) {
          clearTimeout(this.slowRequestTimers.get(requestId));
          this.slowRequestTimers.delete(requestId);

          if (this.slowRequestTimers.size === 0 && this.onSlowRequest) {
            this.onSlowRequest(false);
          }
        }

        return response;
      },
      (error: any) => {
        const requestId = error.config?.requestId;

        if (requestId && this.slowRequestTimers.has(requestId)) {
          clearTimeout(this.slowRequestTimers.get(requestId));
          this.slowRequestTimers.delete(requestId);

          if (this.slowRequestTimers.size === 0 && this.onSlowRequest) {
            this.onSlowRequest(false);
          }
        }

        if (error.response?.status === 401) {
          console.warn("Token expirado - fazendo logout automático");
          this.onUnauthorized?.();
        }

        const apiError: ApiError = {
          message:
            error.response?.data?.message ||
            error.message ||
            "Unknown error occurred",
          status: error.response?.status || 500,
          data: error.response?.data,
        };
        return Promise.reject(apiError);
      }
    );
  }

  protected getAuthToken(): string | null {
    if (this.getTokenFn) {
      return this.getTokenFn();
    }

    if (typeof window === "undefined") return null;
    return localStorage.getItem("@bytebank/auth-token");
  }

  protected async request<T>(
    config: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.request<T>(config);

      return {
        data: response.data,
        status: response.status,
        message: "Success",
      };
    } catch (error) {
      const apiError = error as ApiError;

      return {
        error: apiError.message,
        status: apiError.status,
        data: apiError.data,
      };
    }
  }

  protected async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "GET", url });
  }

  protected async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "POST", url, data });
  }

  protected async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "PUT", url, data });
  }

  protected async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "PATCH", url, data });
  }

  protected async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: "DELETE", url });
  }
}
