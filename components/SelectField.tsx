"use client";

import { Loader2 } from "lucide-react";
import FormField from "./FormField";

interface SelectOption {
  id: number | string;
  name?: string;
  [key: string]: any;
}

interface SelectFieldProps {
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
}

export default function SelectField({
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
}: SelectFieldProps) {
  return (
    <FormField
      label={label}
      required={required}
      tooltip={tooltip}
      description={description}
      error={error}
    >
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary transition-colors ${
            error
              ? "border-red-500"
              : "border-gray-300 hover:border-secondary-light"
          } ${isLoading ? "bg-gray-100" : "bg-white"}`}
          disabled={isLoading}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => {
            const displayValue = option[displayField] || option.name || String(option.id);
            return (
              <option key={option.id} value={option.id}>
                {displayValue}
              </option>
            );
          })}
        </select>
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
        )}
      </div>
    </FormField>
  );
}

