import { useState, useEffect } from "react";
import { FactorialEmployee } from "@/types";

interface UseActiveEmployeesReturn {
  employees: FactorialEmployee[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useActiveEmployees(): UseActiveEmployeesReturn {
  const [employees, setEmployees] = useState<FactorialEmployee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/factorial/active-employees");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al cargar empleados activos");
      }

      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido al cargar empleados activos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Solo ejecutar en el cliente, no durante el build estático
    if (typeof window !== 'undefined') {
      fetchEmployees();
    }
  }, []);

  return {
    employees,
    isLoading,
    error,
    refetch: fetchEmployees,
  };
}

