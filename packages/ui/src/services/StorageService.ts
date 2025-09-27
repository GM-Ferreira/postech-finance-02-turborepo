export class StorageService {
  public static readonly USER_DATA_KEY = "@bytebank/user-data";

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

  public setUserData(userData: { name: string; email: string }): void {
    this.setItem(StorageService.USER_DATA_KEY, userData);
  }

  public getUserData(): { name: string; email: string } | null {
    return this.getItem<{ name: string; email: string }>(
      StorageService.USER_DATA_KEY
    );
  }

  public clearUserData(): void {
    this.removeItem(StorageService.USER_DATA_KEY);
  }
}
