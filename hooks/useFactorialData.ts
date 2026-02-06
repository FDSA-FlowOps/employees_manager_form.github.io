"use client";

import { useState, useEffect } from "react";
import {
  FactorialLegalEntity,
  FactorialRole,
  FactorialEmployee,
  FactorialContractType,
  FactorialLevel,
} from "@/types";

interface UseFactorialDataReturn {
  legalEntities: FactorialLegalEntity[];
  roles: FactorialRole[];
  employees: FactorialEmployee[];
  contractTypes: FactorialContractType[];
  levels: FactorialLevel[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFactorialData(): UseFactorialDataReturn {
  const [legalEntities, setLegalEntities] = useState<FactorialLegalEntity[]>([]);
  const [roles, setRoles] = useState<FactorialRole[]>([]);
  const [employees, setEmployees] = useState<FactorialEmployee[]>([]);
  const [contractTypes, setContractTypes] = useState<FactorialContractType[]>([]);
  const [levels, setLevels] = useState<FactorialLevel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Llamar directamente a Factorial desde el cliente
      const { getAllFactorialData } = await import("@/lib/factorial-client");
      const data = await getAllFactorialData();

      setLegalEntities(data.legalEntities);
      setRoles(data.roles);
      setEmployees(data.employees);
      setContractTypes(data.contractTypes);
      setLevels(data.levels);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error("Error fetching Factorial data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Solo ejecutar en el cliente, no durante el build estático
    if (typeof window !== 'undefined') {
      fetchData();
    }
  }, []);

  return {
    legalEntities,
    roles,
    employees,
    contractTypes,
    levels,
    isLoading,
    error,
    refetch: fetchData,
  };
}

