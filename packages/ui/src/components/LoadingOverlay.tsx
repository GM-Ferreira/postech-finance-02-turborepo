"use client";

import React from "react";

export interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  submessage?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = "Processando...",
  submessage = "Aguarde um momento",
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-xl text-center max-w-sm mx-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-6"></div>

        <h3 className="text-lg font-semibold text-gray-800 mb-2">{message}</h3>

        <p className="text-gray-600 text-sm">{submessage}</p>
      </div>
    </div>
  );
};
