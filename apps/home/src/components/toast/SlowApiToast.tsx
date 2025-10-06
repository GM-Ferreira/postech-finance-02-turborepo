"use client";

import React from "react";

import { useToast } from "@/context/ToastContext";

const SlowApiToast: React.FC = () => {
  const { showSlowApiToast } = useToast();

  if (!showSlowApiToast) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-in-out">
      <div className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg max-w-md mx-auto">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>

          <div className="flex-1">
            <p className="text-sm font-medium">
              API estava em modo economia...
            </p>
            <p className="text-xs opacity-90 mt-1">
              Pode levar até 50s para retornar sua solicitação, por favor
              aguarde
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlowApiToast;
