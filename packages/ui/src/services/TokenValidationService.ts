import { AuthService } from "@repo/api";

interface UserData {
  id: string;
  username: string;
  email: string;
}

export class TokenValidationService {
  private static readonly VALIDATION_CACHE_KEY =
    "@bytebank/last-token-validation";
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  /**
   * Valida o token no servidor com cache
   */
  static async validateTokenWithCache(authService: AuthService): Promise<{
    isValid: boolean;
    userData?: UserData;
    shouldLogout?: boolean;
  }> {
    try {
      const lastValidation = this.getLastValidationTime();
      const now = Date.now();

      if (lastValidation && now - lastValidation < this.CACHE_DURATION) {
        return { isValid: true };
      }

      const response = await authService.validateToken();

      if (response.data?.result?.valid) {
        this.setLastValidationTime(now);

        return {
          isValid: true,
          userData: response.data.result.user,
        };
      } else {
        this.clearValidationCache();
        return {
          isValid: false,
          shouldLogout: true,
        };
      }
    } catch (error) {
      console.warn("Erro na validação do token:", error);

      return { isValid: true };
    }
  }

  /**
   * Força validação no servidor (sem cache)
   */
  static async forceValidateToken(authService: AuthService): Promise<{
    isValid: boolean;
    userData?: UserData;
    shouldLogout?: boolean;
  }> {
    try {
      const response = await authService.validateToken();

      if (response.data?.result?.valid) {
        this.setLastValidationTime(Date.now());

        return {
          isValid: true,
          userData: response.data.result.user,
        };
      } else {
        this.clearValidationCache();
        return {
          isValid: false,
          shouldLogout: true,
        };
      }
    } catch (error) {
      console.warn("Erro na validação forçada do token:", error);
      return {
        isValid: false,
        shouldLogout: true,
      };
    }
  }

  /**
   * Fazer logout no servidor
   */
  static async logoutOnServer(authService: AuthService): Promise<boolean> {
    try {
      const response = await authService.logout();

      if (response.data || response.status === 200) {
        this.clearValidationCache();
        return true;
      }

      return false;
    } catch (error) {
      console.warn("Erro no logout do servidor:", error);
      this.clearValidationCache();
      return false;
    }
  }

  /**
   * Obter tempo da última validação
   */
  private static getLastValidationTime(): number | null {
    if (typeof window === "undefined") return null;

    const stored = localStorage.getItem(this.VALIDATION_CACHE_KEY);
    return stored ? parseInt(stored, 10) : null;
  }

  /**
   * Definir tempo da última validação
   */
  private static setLastValidationTime(timestamp: number): void {
    if (typeof window === "undefined") return;

    localStorage.setItem(this.VALIDATION_CACHE_KEY, timestamp.toString());
  }

  /**
   * Limpar cache de validação
   */
  private static clearValidationCache(): void {
    if (typeof window === "undefined") return;

    localStorage.removeItem(this.VALIDATION_CACHE_KEY);
  }

  /**
   * Verificar se precisa validar (cache expirado)
   */
  static needsValidation(): boolean {
    const lastValidation = this.getLastValidationTime();
    const now = Date.now();

    return !lastValidation || now - lastValidation >= this.CACHE_DURATION;
  }
}
