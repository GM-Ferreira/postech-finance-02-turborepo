interface UserData {
  name: string;
  email: string;
  accountId: string;
}

export class HashAuthService {
  /**
   * Extrai dados de autenticação do hash da URL
   */
  static extractAuthFromHash(): { token: string; userData: UserData } | null {
    if (typeof window === "undefined") return null;

    const hash = window.location.hash;
    if (!hash || hash.length < 2) return null;

    try {
      const hashContent = hash.substring(1);
      const authMatch = hashContent.match(/auth=([^&]+)/);

      if (authMatch && authMatch[1]) {
        const authData = decodeURIComponent(authMatch[1]);
        const parsedAuth = JSON.parse(authData);

        if (parsedAuth.token && parsedAuth.userData) {
          return {
            token: parsedAuth.token,
            userData: parsedAuth.userData,
          };
        }
      }

      const tokenMatch = hashContent.match(/token=([^&]+)/);
      const userMatch = hashContent.match(/user=([^&]+)/);

      if (tokenMatch && tokenMatch[1] && userMatch && userMatch[1]) {
        return {
          token: decodeURIComponent(tokenMatch[1]),
          userData: JSON.parse(decodeURIComponent(userMatch[1])),
        };
      }

      return null;
    } catch (error) {
      console.warn("Erro ao extrair dados de autenticação do hash:", error);
      return null;
    }
  }

  /**
   * Cria uma URL com dados de autenticação no hash
   */
  static createAuthUrl(
    baseUrl: string,
    token: string,
    userData: UserData
  ): string {
    try {
      const authData = {
        token,
        userData,
      };

      const encodedAuth = encodeURIComponent(JSON.stringify(authData));
      return `${baseUrl}#auth=${encodedAuth}`;
    } catch (error) {
      console.warn("Erro ao criar URL com autenticação:", error);
      return baseUrl;
    }
  }

  /**
   * Limpa o hash de autenticação da URL atual
   */
  static clearAuthHash(): void {
    if (typeof window === "undefined") return;

    try {
      const hash = window.location.hash;
      if (!hash) return;

      let newHash = hash
        .replace(/[#&]?auth=[^&]*/, "")
        .replace(/[#&]?token=[^&]*/, "")
        .replace(/[#&]?user=[^&]*/, "")
        .replace(/[#&]?logout=true/, "");

      newHash = newHash.replace(/^[#&]+/, "");

      const newUrl =
        window.location.pathname +
        window.location.search +
        (newHash ? "#" + newHash : "");
      window.history.replaceState({}, "", newUrl);
    } catch (error) {
      console.warn("Erro ao limpar hash de autenticação:", error);
    }
  }

  /**
   * Redireciona para outra aplicação com dados de autenticação
   */
  static redirectWithAuth(
    targetUrl: string,
    token: string,
    userData: UserData
  ): void {
    const authUrl = this.createAuthUrl(targetUrl, token, userData);
    window.location.href = authUrl;
  }

  /**
   * Verifica se há dados de autenticação no hash atual
   */
  static hasAuthInHash(): boolean {
    if (typeof window === "undefined") return false;

    const hash = window.location.hash;
    return (
      hash.includes("auth=") ||
      (hash.includes("token=") && hash.includes("user="))
    );
  }

  /**
   * Cria uma URL com indicação de logout
   */
  static createLogoutUrl(baseUrl: string): string {
    return `${baseUrl}#logout=true`;
  }

  /**
   * Verifica se há indicação de logout no hash atual
   */
  static hasLogoutInHash(): boolean {
    if (typeof window === "undefined") return false;

    const hash = window.location.hash;
    return hash.includes("logout=true");
  }

  /**
   * Redireciona para outra aplicação com indicação de logout
   */
  static redirectWithLogout(targetUrl: string): void {
    const logoutUrl = this.createLogoutUrl(targetUrl);
    window.location.href = logoutUrl;
  }

  /**
   * Limpa o hash de logout da URL atual
   */
  static clearLogoutHash(): void {
    if (typeof window === "undefined") return;

    try {
      const hash = window.location.hash;
      if (!hash) return;

      let newHash = hash.replace(/[#&]?logout=true/, "");
      newHash = newHash.replace(/^[#&]+/, "");

      const newUrl =
        window.location.pathname +
        window.location.search +
        (newHash ? "#" + newHash : "");
      window.history.replaceState({}, "", newUrl);
    } catch (error) {
      console.warn("Erro ao limpar hash de logout:", error);
    }
  }
}
