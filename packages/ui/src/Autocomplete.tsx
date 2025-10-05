"use client";

import React, { useState, useRef, useEffect, forwardRef } from "react";

export interface AutocompleteOption {
  value: string;
  label: string;
}

export interface AutocompleteProps {
  options: AutocompleteOption[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  className?: string;
  error?: boolean;
  disabled?: boolean;
  name?: string;
}

export const Autocomplete = forwardRef<HTMLInputElement, AutocompleteProps>(
  (
    {
      options,
      value,
      placeholder = "Digite para buscar...",
      onChange,
      onBlur,
      className = "",
      error = false,
      disabled = false,
      name,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const containerRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    const selectedOption = options.find((option) => option.value === value);

    useEffect(() => {
      if (selectedOption) {
        setInputValue(selectedOption.label);
      } else if (value === "") {
        setInputValue("");
      }
    }, [selectedOption, value]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
          setHighlightedIndex(-1);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      setIsOpen(true);
      setHighlightedIndex(-1);

      if (newValue === "") {
        onChange?.("");
        return;
      }

      const exactMatch = options.find(
        (option) => option.label.toLowerCase() === newValue.toLowerCase()
      );

      if (exactMatch) {
        onChange?.(exactMatch.value);
      } else {
        onChange?.("");
      }
    };

    const handleOptionClick = (option: AutocompleteOption) => {
      setInputValue(option.label);
      onChange?.(option.value);
      setIsOpen(false);
      setHighlightedIndex(-1);
    };

    const handleInputFocus = () => {
      setIsOpen(true);
    };

    const handleInputBlur = () => {
      const matchedOption = options.find(
        (option) => option.label.toLowerCase() === inputValue.toLowerCase()
      );

      if (matchedOption) {
        setInputValue(matchedOption.label);
        onChange?.(matchedOption.value);
      } else if (inputValue && !selectedOption) {
        setInputValue("");
        onChange?.("");
      } else if (selectedOption) {
        setInputValue(selectedOption.label);
      }

      onBlur?.();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          setIsOpen(true);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
            handleOptionClick(filteredOptions[highlightedIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
      }
    };

    const baseInputStyles = `
      w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 
      transition-colors duration-200 bg-white text-gray-900 placeholder-gray-500
      ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
      ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300"}
    `.trim();

    return (
      <div ref={containerRef} className={`relative ${className}`}>
        <input
          ref={ref}
          type="text"
          name={name}
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          className={baseInputStyles}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />

        {isOpen && filteredOptions.length > 0 && (
          <div
            className="absolute top-full left-0 right-0 z-50 
                mt-1 bg-white border border-gray-300 rounded-lg shadow-lg 
                max-h-60 overflow-y-auto"
          >
            {filteredOptions.map((option, index) => (
              <div
                key={option.value}
                className={`
                  px-4 py-3 cursor-pointer transition-colors duration-150
                  ${
                    index === highlightedIndex
                      ? "bg-blue-50 text-blue-900"
                      : "hover:bg-gray-50"
                  }
                  ${
                    option.value === value
                      ? "bg-blue-100 text-blue-900 font-medium"
                      : "text-gray-900"
                  }
                `.trim()}
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
                onClick={() => handleOptionClick(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}

        {isOpen && filteredOptions.length === 0 && inputValue && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="px-4 py-3 text-gray-500 text-center">
              Nenhuma opção encontrada
            </div>
          </div>
        )}
      </div>
    );
  }
);

Autocomplete.displayName = "Autocomplete";
