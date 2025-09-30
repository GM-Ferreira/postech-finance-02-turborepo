export class UrlUtils {
  static getHomeUrl(): string {
    return process.env.NEXT_PUBLIC_HOME_URL || "http://localhost:3000";
  }

  static getInvestmentsUrl(): string {
    return process.env.NEXT_PUBLIC_INVESTMENTS_URL || "http://localhost:3001";
  }

  static getAppUrl(app: "home" | "investments"): string {
    switch (app) {
      case "home":
        return this.getHomeUrl();
      case "investments":
        return this.getInvestmentsUrl();
      default:
        return this.getHomeUrl();
    }
  }

  static isProduction(): boolean {
    return process.env.NODE_ENV === "production";
  }

  static getCurrentAppUrl(): string {
    if (typeof window === "undefined") return "";
    return window.location.origin;
  }
}
