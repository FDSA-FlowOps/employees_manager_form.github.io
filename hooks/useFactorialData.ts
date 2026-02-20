"use client";

import { useState, useEffect } from "react";
import {
  FactorialLegalEntity,
  FactorialRole,
  FactorialEmployee,
  FactorialContractType,
  FactorialLevel,
  FactorialTeam,
} from "@/types";

interface UseFactorialDataReturn {
  legalEntities: FactorialLegalEntity[];
  roles: FactorialRole[];
  employees: FactorialEmployee[];
  contractTypes: FactorialContractType[];
  levels: FactorialLevel[];
  teams: FactorialTeam[];
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
  const [teams, setTeams] = useState<FactorialTeam[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Llamar a n8n como proxy de Factorial (evita problemas de CORS)
      const { getAllFactorialDataFromN8N } = await import("@/lib/n8n-client");
      const data = await getAllFactorialDataFromN8N();

      setLegalEntities(data.legalEntities);
      setRoles(data.roles);
      setEmployees(data.employees);
      setContractTypes(data.contractTypes);
      setLevels(data.levels);
      setTeams(data.teams ?? []);
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
    teams,
    isLoading,
    error,
    refetch: fetchData,
  };
}

