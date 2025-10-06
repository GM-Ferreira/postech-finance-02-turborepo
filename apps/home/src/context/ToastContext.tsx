"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

interface ToastContextType {
  showSlowApiToast: boolean;
  setShowSlowApiToast: (show: boolean) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [showSlowApiToast, setShowSlowApiToastState] = useState(false);

  const setShowSlowApiToast = useCallback((show: boolean) => {
    setShowSlowApiToastState(show);
  }, []);

  return (
    <ToastContext.Provider value={{ showSlowApiToast, setShowSlowApiToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast deve ser usado dentro de um ToastProvider");
  }
  return context;
};
