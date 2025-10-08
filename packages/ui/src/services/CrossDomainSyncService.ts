/**
 * Serviço para sincronização de dados entre apps em domínios diferentes
 * Usa PostMessage API para comunicação cross-domain segura
 */

interface SyncData {
  action: "login" | "logout";
  token?: string;
  userData?: {
    name: string;
    email: string;
    accountId: string;
  };
}

export class CrossDomainSyncService {
  private static readonly ALLOWED_ORIGINS = {
    development: ["http://localhost:3000", "http://localhost:3001"],
    production: [
      process.env.NEXT_PUBLIC_HOME_URL || "",
      process.env.NEXT_PUBLIC_INVESTMENTS_URL || "",
    ].filter(Boolean),
  };

  /**
   * Verifica se estamos em ambiente de desenvolvimento
   */
  private static isDevelopment(): boolean {
    if (typeof window === "undefined") return false;
    return window.location.hostname === "localhost";
  }

  /**
   * Obtém as origens permitidas baseado no ambiente
   */
  private static getAllowedOrigins(): string[] {
    return this.isDevelopment()
      ? this.ALLOWED_ORIGINS.development
      : this.ALLOWED_ORIGINS.production;
  }

  /**
   * Obtém a URL do outro app para comunicação
   */
  private static getOtherAppUrl(): string | null {
    if (typeof window === "undefined") return null;

    const currentUrl = window.location.origin;
    const homeUrl = process.env.NEXT_PUBLIC_HOME_URL || "http://localhost:3000";
    const investmentsUrl =
      process.env.NEXT_PUBLIC_INVESTMENTS_URL || "http://localhost:3001";

    if (currentUrl === homeUrl) {
      return investmentsUrl;
    }

    if (currentUrl === investmentsUrl) {
      return homeUrl;
    }

    return null;
  }

  /**
   * Envia dados para o outro app via PostMessage
   */
  public static sendSyncData(syncData: SyncData): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("Window não disponível"));
        return;
      }

      const otherAppUrl = this.getOtherAppUrl();
      if (!otherAppUrl) {
        console.warn("URL do outro app não encontrada");
        resolve();
        return;
      }

      try {
        const iframe = document.createElement("iframe");
        iframe.src = `${otherAppUrl}/sync`;
        iframe.style.display = "none";
        iframe.style.width = "1px";
        iframe.style.height = "1px";

        document.body.appendChild(iframe);

        const timeout = setTimeout(() => {
          iframe.remove();
          reject(new Error("Timeout na sincronização"));
        }, 10000);

        iframe.onload = () => {
          setTimeout(() => {
            try {
              if (iframe.contentWindow) {
                iframe.contentWindow.postMessage(syncData, otherAppUrl);
              } else {
                console.error("iframe.contentWindow não disponível");
              }

              setTimeout(() => {
                clearTimeout(timeout);
                iframe.remove();
                resolve();
              }, 3000);
            } catch (error) {
              clearTimeout(timeout);
              iframe.remove();
              reject(error);
            }
          }, 1000);
        };

        iframe.onerror = () => {
          clearTimeout(timeout);
          iframe.remove();
          reject(new Error("Erro ao carregar iframe de sincronização"));
        };
      } catch (error) {
        console.error("Erro ao criar iframe de sincronização:", error);
        reject(error);
      }
    });
  }

  /**
   * Configura o listener para receber dados via PostMessage
   */
  public static setupMessageListener(
    onSync: (syncData: SyncData) => void
  ): () => void {
    if (typeof window === "undefined") {
      return () => {};
    }

    const handleMessage = (event: MessageEvent) => {
      const allowedOrigins = this.getAllowedOrigins();

      if (!allowedOrigins.includes(event.origin)) {
        return;
      }

      const data = event.data as SyncData;
      if (!data || !data.action || !["login", "logout"].includes(data.action)) {
        console.warn("Dados de sincronização inválidos:", data);
        return;
      }

      onSync(data);
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }

  /**
   * Handle sync em desenvolvimento (localStorage compartilhado)
   */
  private static handleLocalSync(syncData: SyncData): void {
    if (syncData.action === "logout") {
      localStorage.setItem("external-logout-flag", "true");
    } else if (syncData.action === "login") {
      localStorage.removeItem("external-logout-flag");
    }
  }

  /**
   * Sincroniza login entre apps
   */
  public static syncLogin(
    token: string,
    userData: SyncData["userData"]
  ): Promise<void> {
    return this.sendSyncData({
      action: "login",
      token,
      userData,
    });
  }

  /**
   * Sincroniza logout entre apps
   */
  public static syncLogout(): Promise<void> {
    return this.sendSyncData({
      action: "logout",
    });
  }
}
