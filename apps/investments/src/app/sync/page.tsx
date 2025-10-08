"use client";

import { useEffect } from "react";

import { CrossDomainSyncService, StorageService } from "@repo/ui";

export default function SyncPage() {
  useEffect(() => {
    console.log("Página /sync carregada - configurando listener...");
    console.log("URL atual:", window.location.origin);
    console.log("User Agent:", navigator.userAgent.substring(0, 50));

    const storageService = new StorageService();

    const cleanup = CrossDomainSyncService.setupMessageListener((syncData) => {
      console.log("SYNC: Dados recebidos no app investments:", {
        action: syncData?.action,
        hasToken: !!syncData?.token,
        hasUserData: !!syncData?.userData,
      });

      if (syncData.action === "login") {
        console.log("Processando login sync...");

        if (syncData.token) {
          storageService.setAuthToken(syncData.token);
          console.log("Token salvo no localStorage");

          const savedToken = storageService.getAuthToken();
          console.log("Verificação - Token recuperado:", !!savedToken);
        }
        if (syncData.userData) {
          storageService.setUserData(syncData.userData);
          console.log("User data salvo no localStorage");

          const savedUserData = storageService.getUserData();
          console.log("Verificação - UserData recuperado:", savedUserData);
        }
        storageService.clearExternalLogoutFlag();

        storageService.setSyncCompletedFlag();
        console.log("Flag de sync completado definida");

        console.log("Login sincronizado no app investments");

        setTimeout(() => {
          console.log("Redirecionando para /investments...");
          window.location.href = "/investments";
        }, 1000);
      } else if (syncData.action === "logout") {
        console.log("Processando logout sync...");

        storageService.clearAllUserData();
        storageService.setExternalLogoutFlag();

        console.log("Logout sincronizado no app investments");

        setTimeout(() => {
          const homeUrl =
            process.env.NEXT_PUBLIC_HOME_URL || "http://localhost:3000";
          window.location.href = homeUrl;
        }, 1000);
      } else {
        console.log("Action desconhecida recebida:", syncData?.action);
      }
    });

    console.log("Cleanup function criado:", typeof cleanup);

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
