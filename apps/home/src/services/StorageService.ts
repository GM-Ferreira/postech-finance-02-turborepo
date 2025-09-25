export class StorageService {
  public static readonly AUTH_KEY = "bytebank_auth_user";
  public static readonly USERS_KEY = "bytebank_users_list";

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
}
