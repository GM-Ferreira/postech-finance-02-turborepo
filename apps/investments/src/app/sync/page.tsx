"use client";

import { useEffect } from "react";

import { CrossDomainSyncService, StorageService } from "@repo/ui";

export default function SyncPage() {
  useEffect(() => {
    const storageService = new StorageService();

    const cleanup = CrossDomainSyncService.setupMessageListener((syncData) => {
      if (syncData.action === "login") {
        if (syncData.token) {
          storageService.setAuthToken(syncData.token);
        }
        if (syncData.userData) {
          storageService.setUserData(syncData.userData);
        }
        storageService.clearExternalLogoutFlag();

        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else if (syncData.action === "logout") {
        storageService.clearAllUserData();
        storageService.setExternalLogoutFlag();

        setTimeout(() => {
          const homeUrl =
            process.env.NEXT_PUBLIC_HOME_URL || "http://localhost:3000";
          window.location.href = homeUrl;
        }, 1000);
      }
    });

    return cleanup;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-success mx-auto mb-6"></div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Sincronizando dados...
        </h2>
        <p className="text-gray-500">
          Aguarde enquanto sincronizamos suas informações entre os aplicativos.
        </p>
        <div className="mt-4 text-sm text-gray-400">
          Esta página será fechada automaticamente.
        </div>
      </div>
    </div>
  );
}
