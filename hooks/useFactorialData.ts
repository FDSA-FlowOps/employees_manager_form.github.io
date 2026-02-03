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
      // Las llamadas ahora se hacen sin pasar la API key, el servidor la obtiene del entorno
      const [entitiesRes, rolesRes, employeesRes, contractTypesRes, levelsRes] =
        await Promise.all([
          fetch("/api/factorial/legal-entities"),
          fetch("/api/factorial/roles"),
          fetch("/api/factorial/employees"),
          fetch("/api/factorial/contract-types"),
          fetch("/api/factorial/levels"),
        ]);

      if (!entitiesRes.ok || !rolesRes.ok || !employeesRes.ok || !contractTypesRes.ok || !levelsRes.ok) {
        const errorData = await entitiesRes.json().catch(() => ({ error: "Error desconocido" }));
        throw new Error(errorData.error || "Error al cargar datos de Factorial");
      }

      const [entities, rolesData, employeesData, contractTypesData, levelsData] =
        await Promise.all([
          entitiesRes.json(),
          rolesRes.json(),
          employeesRes.json(),
          contractTypesRes.json(),
          levelsRes.json(),
        ]);

      setLegalEntities(entities);
      setRoles(rolesData);
      setEmployees(employeesData);
      setContractTypes(contractTypesData);
      setLevels(levelsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
      console.error("Error fetching Factorial data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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

