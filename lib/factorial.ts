import {
  FactorialLegalEntity,
  FactorialRole,
  FactorialEmployee,
  FactorialContractType,
  FactorialLevel,
} from "@/types";

const FACTORIAL_API_BASE = "https://api.factorialhr.com/api/2026-01-01/resources";

export async function fetchFactorialData<T>(
  endpoint: string,
  apiKey: string
): Promise<T[]> {
  try {
    const response = await fetch(endpoint, {
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error en endpoint ${endpoint}:`, response.status, errorText);
      throw new Error(`Error al obtener datos de Factorial: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();

    // La API de Factorial puede devolver los datos en diferentes formatos
    // Intentamos extraer el array de datos
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
      return data.data;
    } else if (data && typeof data === 'object' && 'results' in data && Array.isArray(data.results)) {
      return data.results;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching Factorial data:", error);
    throw error;
  }
}

export async function getLegalEntities(apiKey: string): Promise<FactorialLegalEntity[]> {
  return fetchFactorialData<FactorialLegalEntity>(
    `${FACTORIAL_API_BASE}/companies/legal_entities`,
    apiKey
  );
}

export async function getRoles(apiKey: string): Promise<FactorialRole[]> {
  return fetchFactorialData<FactorialRole>(
    `${FACTORIAL_API_BASE}/job_catalog/roles`,
    apiKey
  );
}

export async function getEmployees(apiKey: string): Promise<FactorialEmployee[]> {
  return fetchFactorialData<FactorialEmployee>(
    `${FACTORIAL_API_BASE}/employees/employees?only_active=true`,
    apiKey
  );
}

export async function getContractTypes(apiKey: string): Promise<FactorialContractType[]> {
  return fetchFactorialData<FactorialContractType>(
    `${FACTORIAL_API_BASE}/contracts/spanish_contract_types`,
    apiKey
  );
}

export async function getLevels(apiKey: string): Promise<FactorialLevel[]> {
  return fetchFactorialData<FactorialLevel>(
    `${FACTORIAL_API_BASE}/job_catalog/levels`,
    apiKey
  );
}

