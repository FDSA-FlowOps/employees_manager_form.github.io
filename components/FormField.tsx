"use client";

import { ReactNode } from "react";
import Tooltip from "./Tooltip";

interface FormFieldProps {
  label: string;
  required?: boolean;
  tooltip?: string;
  error?: string;
  children: ReactNode;
  description?: string;
}

export default function FormField({
  label,
  required = false,
  tooltip,
  error,
  children,
  description,
}: FormFieldProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-secondary mb-2">
        <span className="flex items-center gap-2">
          {label}
          {required && <span className="text-primary">*</span>}
          {tooltip && <Tooltip content={tooltip} />}
        </span>
      </label>
      {description && (
        <p className="text-xs text-gray-500 mb-2">{description}</p>
      )}
      {children}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

