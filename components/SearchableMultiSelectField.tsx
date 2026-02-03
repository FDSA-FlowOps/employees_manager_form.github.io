"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, Check, ChevronDown } from "lucide-react";
import FormField from "./FormField";

interface SearchableMultiSelectFieldProps {
  label: string;
  required?: boolean;
  tooltip?: string;
  description?: string;
  error?: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: Array<{ id: string; name: string; email?: string; [key: string]: any }>;
  isLoading?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  displayField?: string;
}

export default function SearchableMultiSelectField({
  label,
  required = false,
  tooltip,
  description,
  error,
  value = [],
  onChange,
  options,
  isLoading = false,
  placeholder = "Selecciona opciones",
  searchPlaceholder = "Buscar...",
  displayField = "name",
}: SearchableMultiSelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  function toggleOption(optionId: string) {
    if (value.includes(optionId)) {
      onChange(value.filter((id) => id !== optionId));
    } else {
      onChange([...value, optionId]);
    }
  }

  const filteredOptions = options.filter((option) => {
    if (!searchTerm) return true;
    const displayValue = option[displayField] || option.name || String(option.id);
    const email = option.email || "";
    return (
      displayValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const selectedOptions = value
    .map((id) => options.find((opt) => opt.id === id))
    .filter((opt): opt is NonNullable<typeof opt> => Boolean(opt));

  return (
    <FormField
      label={label}
      required={required}
      tooltip={tooltip}
      description={description}
      error={error}
    >
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`min-h-[42px] w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary transition-colors flex items-center justify-between ${
            error
              ? "border-red-500"
              : "border-gray-300 hover:border-secondary-light"
          } ${isLoading ? "bg-gray-100" : "bg-white"}`}
          disabled={isLoading}
        >
          <div className="flex-1 text-left">
            {value.length === 0 ? (
              <span className="text-gray-400">{placeholder}</span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedOptions.map((option) => {
                  const displayValue = option[displayField] || option.name || String(option.id);
                  return (
                    <span
                      key={option.id}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-white rounded text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOption(option.id);
                      }}
                    >
                      {displayValue}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleOption(option.id);
                        }}
                        className="hover:bg-secondary-dark rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </button>
        {isOpen && !isLoading && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            <div className="max-h-60 overflow-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-2 text-gray-500 text-sm">
                  {searchTerm ? "No se encontraron resultados" : "No hay opciones disponibles"}
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = value.includes(option.id);
                  const displayValue = option[displayField] || option.name || String(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => toggleOption(option.id)}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center justify-between ${
                        isSelected ? "bg-secondary-light text-white" : ""
                      }`}
                    >
                      <div>
                        <div className="font-medium">{displayValue}</div>
                        {option.email && (
                          <div className={`text-xs ${isSelected ? "text-white" : "text-gray-500"}`}>
                            {option.email}
                          </div>
                        )}
                      </div>
                      {isSelected && <Check className="w-4 h-4" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </FormField>
  );
}


