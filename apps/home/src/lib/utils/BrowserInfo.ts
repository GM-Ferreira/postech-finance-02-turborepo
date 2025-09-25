import Bowser from "bowser";

export interface DeviceInfo {
  os: string;
  browser: string;
}

/**
 * Obtém informações do sistema operacional e navegador do usuário
 * usando a biblioteca Bowser para máxima compatibilidade.
 */
export function getDeviceInfo(): DeviceInfo {
  const result = Bowser.parse(window.navigator.userAgent);

  const os = result.os.name || "Desconhecido";
  const browser = result.browser.name || "Desconhecido";

  return { os, browser };
}
