"use client";

import React, { forwardRef } from "react";

export type SelectOption = {
  value: string;
  label: string;
};

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, ...props }, ref) => {
    return (
      <select
        className={`
            block w-full rounded-lg border border-primary bg-white px-4 py-3 shadow-sm focus:border-success 
            focus:ring focus:ring-primary focus:ring-opacity-50 text-gray-700 
            ${className}`}
        ref={ref}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

Select.displayName = "Select";

export { Select };
