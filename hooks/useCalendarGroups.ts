"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/types";

interface UseCalendarsReturn {
  calendars: Calendar[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCalendars(): UseCalendarsReturn {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/calendars/list");

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Error desconocido" }));
        throw new Error(errorData.error || "Error al cargar calendarios");
      }

      const data = await response.json();
      // Asegurar que siempre sea un array
      const calendarsArray = Array.isArray(data) ? data : [];
      setCalendars(calendarsArray);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error("Error fetching calendars:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    calendars,
    isLoading,
    error,
    refetch: fetchData,
  };
}

