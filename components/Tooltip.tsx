"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children || <HelpCircle className="w-4 h-4 text-gray-400" />}
      </div>
      {isVisible && (
        <div className="absolute z-50 w-64 p-2 text-sm text-white bg-secondary-dark rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2">
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-secondary-dark"></div>
          </div>
        </div>
      )}
    </div>
  );
}

