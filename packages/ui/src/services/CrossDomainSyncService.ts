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
  private static isSyncing = false;

  private static isDevelopment(): boolean {
    if (typeof window === "undefined") return false;
    return window.location.hostname === "localhost";
  }

  private static getAllowedOrigins(): string[] {
    const homeUrl = process.env.NEXT_PUBLIC_HOME_URL || "http://localhost:3000";
    const investmentsUrl =
      process.env.NEXT_PUBLIC_INVESTMENTS_URL || "http://localhost:3001";

    const origins = [homeUrl, investmentsUrl];
    const isDev = this.isDevelopment();

    console.log("Allowed origins config:", {
      environment: isDev ? "development" : "production",
      homeUrl,
      investmentsUrl,
      origins,
    });

    return origins;
  }

  private static getOtherAppUrl(): string | null {
    if (typeof window === "undefined") return null;

    const currentUrl = window.location.origin;
    const homeUrl = process.env.NEXT_PUBLIC_HOME_URL || "http://localhost:3000";
    const investmentsUrl =
      process.env.NEXT_PUBLIC_INVESTMENTS_URL || "http://localhost:3001";

    console.log("Cross-domain URLs:", {
      current: currentUrl,
      home: homeUrl,
      investments: investmentsUrl,
    });

    if (currentUrl === homeUrl) {
      console.log("Current app: HOME → Target: INVESTMENTS");
      return investmentsUrl;
    }

    if (currentUrl === investmentsUrl) {
      console.log("Current app: INVESTMENTS → Target: HOME");
      return homeUrl;
    }

    console.warn("App não reconhecido para cross-domain sync:", currentUrl);
    return null;
  }

  public static sendSyncData(syncData: SyncData): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("Window não disponível"));
        return;
      }

      if (this.isSyncing) {
        console.log("Sync já em andamento, ignorando call adicional");
        resolve();
        return;
      }

      this.isSyncing = true;

      const otherAppUrl = this.getOtherAppUrl();
      if (!otherAppUrl) {
        console.warn("URL do outro app não encontrada - Sync ignorado");
        resolve();
        return;
      }

      console.log(
        `Iniciando sincronização ${syncData.action} para ${otherAppUrl}`
      );

      try {
        const iframe = document.createElement("iframe");
        iframe.src = `${otherAppUrl}/sync`;
        iframe.style.display = "none";
        iframe.style.width = "1px";
        iframe.style.height = "1px";

        console.log(`Criando iframe para: ${iframe.src}`);
        document.body.appendChild(iframe);

        const timeout = setTimeout(() => {
          iframe.remove();
          this.isSyncing = false;
          reject(new Error("Timeout na sincronização"));
        }, 10000);

        iframe.onload = () => {
          console.log("Iframe carregado, aguardando inicialização...");

          setTimeout(() => {
            try {
              if (iframe.contentWindow) {
                console.log(
                  `Enviando PostMessage para: ${otherAppUrl}`,
                  syncData
                );
                iframe.contentWindow.postMessage(syncData, otherAppUrl);
                console.log("Dados enviados via PostMessage:", syncData.action);
              } else {
                console.warn("iframe.contentWindow não disponível");
              }

              setTimeout(() => {
                clearTimeout(timeout);
                iframe.remove();
                this.isSyncing = false;
                resolve();
              }, 3000);
            } catch (error) {
              clearTimeout(timeout);
              iframe.remove();
              this.isSyncing = false;
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
        console.warn("Erro ao criar iframe de sincronização:", error);
        reject(error);
      }
    });
  }

  public static setupMessageListener(
    onSync: (syncData: SyncData) => void
  ): () => void {
    if (typeof window === "undefined") {
      return () => {};
    }

    console.log("Configurando listener PostMessage...");

    const handleMessage = (event: MessageEvent) => {
      console.log("PostMessage recebido:", {
        origin: event.origin,
        data: event.data,
        currentUrl: window.location.origin,
      });

      const allowedOrigins = this.getAllowedOrigins();
      console.log("Origens permitidas:", allowedOrigins);

      if (!allowedOrigins.includes(event.origin)) {
        console.warn("PostMessage de origem não confiável:", event.origin);
        console.warn("Origens permitidas eram:", allowedOrigins);
        return;
      }

      const data = event.data as SyncData;
      if (!data || !data.action || !["login", "logout"].includes(data.action)) {
        console.warn("Dados de sincronização inválidos:", data);
        return;
      }

      console.log("Processando PostMessage válido:", data.action);
      onSync(data);
    };

    window.addEventListener("message", handleMessage);
    console.log("Event listener PostMessage registrado");

    return () => {
      console.log("Removendo event listener PostMessage");
      window.removeEventListener("message", handleMessage);
    };
  }

  private static handleLocalSync(syncData: SyncData): void {
    if (syncData.action === "logout") {
      localStorage.setItem("external-logout-flag", "true");
    } else if (syncData.action === "login") {
      localStorage.removeItem("external-logout-flag");
    }
  }

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

  public static syncLogout(): Promise<void> {
    return this.sendSyncData({
      action: "logout",
    });
  }
}
