"use client";

import React, { forwardRef } from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, isLoading, ...props }, ref) => {
    return (
      <button
        className={`
            flex items-center justify-center rounded-lg px-6 py-3 font-bold text-white 
            transition-colors bg-primary hover:opacity-90
            disabled:cursor-not-allowed disabled:opacity-50 ${className}
            `}
        disabled={isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? "Carregando..." : children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
