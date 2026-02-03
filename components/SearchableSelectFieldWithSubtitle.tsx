"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Loader2, X } from "lucide-react";
import FormField from "./FormField";

interface SelectOption {
  id: number | string;
  name?: string;
  subtitle?: string;
  [key: string]: any;
}

interface SearchableSelectFieldWithSubtitleProps {
  label: string;
  required?: boolean;
  tooltip?: string;
  description?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  isLoading?: boolean;
  placeholder?: string;
  displayField?: string;
  subtitleField?: string;
  searchPlaceholder?: string;
}

export default function SearchableSelectFieldWithSubtitle({
  label,
  required = false,
  tooltip,
  description,
  error,
  value,
  onChange,
  options,
  isLoading = false,
  placeholder = "Selecciona una opción",
  displayField = "name",
  subtitleField = "subtitle",
  searchPlaceholder = "Buscar...",
}: SearchableSelectFieldWithSubtitleProps) {
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

  const filteredOptions = options.filter((option) => {
    if (!searchTerm) return true;
    const displayValue = option[displayField] || option.name || String(option.id);
    const subtitleValue = option[subtitleField] || option.subtitle || "";
    const searchText = `${displayValue} ${subtitleValue}`.toLowerCase();
    return searchText.includes(searchTerm.toLowerCase());
  });

  const selectedOption = options.find((opt) => String(opt.id) === value);

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
          <div className="flex flex-col items-start flex-1 text-left">
            {selectedOption ? (
              <>
                <span className="text-gray-900">
                  {selectedOption[displayField] || selectedOption.name || String(selectedOption.id)}
                </span>
                {selectedOption[subtitleField] || selectedOption.subtitle ? (
                  <span className="text-xs text-gray-500">
                    {selectedOption[subtitleField] || selectedOption.subtitle}
                  </span>
                ) : null}
              </>
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </div>
          <div className="flex items-center gap-2 ml-2">
            {isLoading && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isOpen ? "transform rotate-180" : ""
              }`}
            />
          </div>
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
                  const optionDisplayValue =
                    option[displayField] || option.name || String(option.id);
                  const optionSubtitle = option[subtitleField] || option.subtitle || "";
                  const isSelected = String(option.id) === value;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        onChange(String(option.id));
                        setIsOpen(false);
                        setSearchTerm("");
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors ${
                        isSelected ? "bg-secondary-light text-white" : ""
                      }`}
                    >
                      <div className="flex flex-col">
                        <span>{optionDisplayValue}</span>
                        {optionSubtitle && (
                          <span className={`text-xs ${isSelected ? "text-white/80" : "text-gray-500"}`}>
                            {optionSubtitle}
                          </span>
                        )}
                      </div>
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

