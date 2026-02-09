"use client";

import {
  FactorialLegalEntity,
  FactorialRole,
  FactorialEmployee,
  FactorialContractType,
  FactorialLevel,
} from "@/types";

const FACTORIAL_API_BASE = "https://api.factorialhr.com/api/2026-01-01/resources";

/**
 * Obtiene la API key de Factorial desde las variables de entorno públicas
 */
function getFactorialApiKey(): string {
  const apiKey = process.env.NEXT_PUBLIC_FACTORIAL_API_KEY;
  if (!apiKey) {
    throw new Error(
      "API key de Factorial no configurada. Configura NEXT_PUBLIC_FACTORIAL_API_KEY en las variables de entorno."
    );
  }
  return apiKey;
}

/**
 * Función genérica para obtener datos de Factorial
 */
async function fetchFactorialData<T>(endpoint: string): Promise<T[]> {
  const apiKey = getFactorialApiKey();

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      mode: "cors", // Permitir CORS explícitamente
      credentials: "omit", // No enviar cookies
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error en endpoint ${endpoint}:`, response.status, errorText);
      throw new Error(
        `Error al obtener datos de Factorial: ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();

    // La API de Factorial puede devolver los datos en diferentes formatos
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === "object" && "data" in data && Array.isArray(data.data)) {
      return data.data;
    } else if (data && typeof data === "object" && "results" in data && Array.isArray(data.results)) {
      return data.results;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching Factorial data:", error);
    throw error;
  }
}

/**
 * Obtiene las entidades legales de Factorial
 */
export async function getLegalEntities(): Promise<FactorialLegalEntity[]> {
  return fetchFactorialData<FactorialLegalEntity>(
    `${FACTORIAL_API_BASE}/companies/legal_entities`
  );
}

/**
 * Obtiene los roles de Factorial
 */
export async function getRoles(): Promise<FactorialRole[]> {
  return fetchFactorialData<FactorialRole>(`${FACTORIAL_API_BASE}/job_catalog/roles`);
}

/**
 * Obtiene los empleados activos de Factorial
 */
export async function getEmployees(): Promise<FactorialEmployee[]> {
  return fetchFactorialData<FactorialEmployee>(
    `${FACTORIAL_API_BASE}/employees/employees?only_active=true`
  );
}

/**
 * Obtiene los tipos de contrato de Factorial
 */
export async function getContractTypes(): Promise<FactorialContractType[]> {
  return fetchFactorialData<FactorialContractType>(
    `${FACTORIAL_API_BASE}/contracts/spanish_contract_types`
  );
}

/**
 * Obtiene los niveles de Factorial
 */
export async function getLevels(): Promise<FactorialLevel[]> {
  return fetchFactorialData<FactorialLevel>(`${FACTORIAL_API_BASE}/job_catalog/levels`);
}

/**
 * Obtiene todos los datos de Factorial en paralelo
 */
export async function getAllFactorialData(): Promise<{
  legalEntities: FactorialLegalEntity[];
  roles: FactorialRole[];
  employees: FactorialEmployee[];
  contractTypes: FactorialContractType[];
  levels: FactorialLevel[];
}> {
  const [legalEntities, roles, employees, contractTypes, levels] = await Promise.all([
    getLegalEntities(),
    getRoles(),
    getEmployees(),
    getContractTypes(),
    getLevels(),
  ]);

  return {
    legalEntities,
    roles,
    employees,
    contractTypes,
    levels,
  };
}

