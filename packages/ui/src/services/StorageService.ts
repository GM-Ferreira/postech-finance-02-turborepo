export class StorageService {
  private static readonly USER_DATA_KEY = "@bytebank/user-data";
  private static readonly AUTH_TOKEN_KEY = "@bytebank/auth-token";
  private static readonly SHOW_BALANCE_KEY = "@bytebank/show-balance";
  private static readonly THEME_KEY = "@bytebank/theme";
  private static readonly LOCAL_LOGOUT_FLAG = "local-logout-flag";
  private static readonly EXTERNAL_LOGOUT_FLAG = "external-logout-flag";

  public setItem<T>(key: string, value: T): void {
    if (typeof window === "undefined") {
      return;
    }
    try {
      const serializedValue = JSON.stringify(value);
      window.localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Erro ao salvar no localStorage (chave: ${key}):`, error);
    }
  }

  public getItem<T>(key: string): T | null {
    if (typeof window === "undefined") {
      return null;
    }
    try {
      const serializedValue = window.localStorage.getItem(key);
      if (serializedValue === null) {
        return null;
      }
      return JSON.parse(serializedValue) as T;
    } catch (error) {
      console.error(`Erro ao obter do localStorage (chave: ${key}):`, error);
      return null;
    }
  }

  public removeItem(key: string): void {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.removeItem(key);
  }

  public setUserData(userData: {
    name: string;
    email: string;
    accountId: string;
  }): void {
    this.setItem(StorageService.USER_DATA_KEY, userData);
  }

  public getUserData(): {
    name: string;
    email: string;
    accountId: string;
  } | null {
    return this.getItem<{ name: string; email: string; accountId: string }>(
      StorageService.USER_DATA_KEY
    );
  }

  public clearUserData(): void {
    this.removeItem(StorageService.USER_DATA_KEY);
  }

  public setAuthToken(token: string): void {
    this.setItem(StorageService.AUTH_TOKEN_KEY, token);
  }

  public getAuthToken(): string | null {
    return this.getItem<string>(StorageService.AUTH_TOKEN_KEY);
  }

  public clearAuthToken(): void {
    this.removeItem(StorageService.AUTH_TOKEN_KEY);
  }

  public isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  public setShowBalance(show: boolean): void {
    this.setItem(StorageService.SHOW_BALANCE_KEY, show);
  }

  public getShowBalance(): boolean {
    return this.getItem<boolean>(StorageService.SHOW_BALANCE_KEY) ?? true;
  }

  public setTheme(theme: "light" | "dark"): void {
    this.setItem(StorageService.THEME_KEY, theme);
  }

  public getTheme(): "light" | "dark" | null {
    return this.getItem<"light" | "dark">(StorageService.THEME_KEY);
  }

  public clearAllUserData(): void {
    this.clearAuthToken();
    this.clearUserData();
    this.removeItem(StorageService.SHOW_BALANCE_KEY);
  }

  /** Sync Flags for Cross-App Communication */
  public setLocalLogoutFlag(): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(StorageService.LOCAL_LOGOUT_FLAG, "true");
  }

  public clearLocalLogoutFlag(): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(StorageService.LOCAL_LOGOUT_FLAG);
  }

  public hasLocalLogoutFlag(): boolean {
    if (typeof window === "undefined") return false;
    return (
      window.localStorage.getItem(StorageService.LOCAL_LOGOUT_FLAG) === "true"
    );
  }

  public setExternalLogoutFlag(): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(StorageService.EXTERNAL_LOGOUT_FLAG, "true");
  }

  public clearExternalLogoutFlag(): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(StorageService.EXTERNAL_LOGOUT_FLAG);
  }

  public hasExternalLogoutFlag(): boolean {
    if (typeof window === "undefined") return false;
    return (
      window.localStorage.getItem(StorageService.EXTERNAL_LOGOUT_FLAG) ===
      "true"
    );
  }
}
