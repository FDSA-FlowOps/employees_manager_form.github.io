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
      // Llamar directamente a Factorial desde el cliente
      const { getEmployees } = await import("@/lib/factorial-client");
      const employeesData = await getEmployees();
      
      // Mapear solo los campos que necesitamos: id y full_name
      const mappedEmployees = employeesData.map((emp: any) => ({
        id: emp.id,
        full_name: emp.full_name,
      }));
      
      setEmployees(mappedEmployees);
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

