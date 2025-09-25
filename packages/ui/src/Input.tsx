"use client";

import React, { forwardRef } from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`
          mt-1 block w-full rounded-md border-zinc-500 shadow-sm h-12 px-4 
          bg-white text-zinc-500
          focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50
          ${className} 
        `}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
