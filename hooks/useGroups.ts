"use client";

import { useState, useEffect } from "react";
import { Group } from "@/types";

interface UseGroupsReturn {
  groups: Group[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGroups(): UseGroupsReturn {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/groups/list");

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Error desconocido" }));
        throw new Error(errorData.error || "Error al cargar grupos");
      }

      const data = await response.json();
      // Asegurar que siempre sea un array
      const groupsArray = Array.isArray(data) ? data : [];
      setGroups(groupsArray);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error("Error fetching groups:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    groups,
    isLoading,
    error,
    refetch: fetchData,
  };
}

