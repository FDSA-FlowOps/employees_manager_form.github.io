"use client";

import { EmployeeFormData, EmployeeExitFormData, FactorialEmployee } from "@/types";
import { transformToN8NPayload, formatDateToYYYYMMDD } from "@/lib/n8n";

/**
 * Obtiene el JWT token desde las variables de entorno públicas
 */
function getJWTToken(): string | undefined {
  return process.env.NEXT_PUBLIC_N8N_JWT_TOKEN;
}

/**
 * Obtiene los headers con autenticación JWT si está disponible
 */
function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const jwtToken = getJWTToken();
  if (jwtToken) {
    headers["Authorization"] = `Bearer ${jwtToken}`;
  }

  return headers;
}

/**
 * Obtiene los datos maestros directamente de n8n
 */
export async function fetchMastersFromN8N(): Promise<{
  calendarios: any[];
  grupos: any[];
  usuarios_google: Array<{ id: string; name: string; email: string; displayName: string }>;
  usuarios_jira: Array<{ accountId: string; displayName: string }>;
}> {
  const webhookUrl = process.env.NEXT_PUBLIC_N8N_MASTERS_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error(
      "Webhook URL no configurada. Configura NEXT_PUBLIC_N8N_MASTERS_WEBHOOK_URL en las variables de entorno."
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 segundos de timeout

  try {
    const response = await fetch(webhookUrl, {
      method: "GET",
      headers: getAuthHeaders(),
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error al obtener maestros: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();

    // Procesar calendarios
    let calendarios = [];
    if (data.calendarios) {
      if (Array.isArray(data.calendarios) && data.calendarios.length > 0) {
        if (data.calendarios[0]?.items && Array.isArray(data.calendarios[0].items)) {
          calendarios = data.calendarios[0].items;
        } else {
          calendarios = data.calendarios;
        }
      } else if (data.calendarios.items && Array.isArray(data.calendarios.items)) {
        calendarios = data.calendarios.items;
      } else if (Array.isArray(data.calendario)) {
        calendarios = data.calendario;
      }
    }

    // Procesar grupos
    const grupos = Array.isArray(data.grupos)
      ? data.grupos
      : Array.isArray(data.grupo)
      ? data.grupo
      : [];

    // Procesar usuarios de Google
    let usuariosGoogle: Array<{ id: string; name: string; email: string; displayName: string }> = [];
    const googleData = data.usuarios_google || data.usuariosGoogle || data.google_users || data.googleUsers;

    if (googleData) {
      let users = [];

      if (Array.isArray(googleData) && googleData.length > 0 && googleData[0]?.users && Array.isArray(googleData[0].users)) {
        users = googleData[0].users;
      } else if (Array.isArray(googleData)) {
        users = googleData;
      } else if (googleData.users && Array.isArray(googleData.users)) {
        users = googleData.users;
      } else if (googleData.data && Array.isArray(googleData.data)) {
        users = googleData.data;
      } else if (googleData.results && Array.isArray(googleData.results)) {
        users = googleData.results;
      }

      usuariosGoogle = users
        .filter((user: any) => user && (user.id || user.primaryEmail || user.email || (user.name && (user.name.fullName || user.name.fullname))))
        .map((user: any) => ({
          id: user.id || "",
          name: user.name?.fullName || user.name?.fullname || user.name || "",
          email: user.primaryEmail || user.email || "",
          displayName: `${user.name?.fullName || user.name?.fullname || user.name || ""}${user.primaryEmail || user.email ? ` (${user.primaryEmail || user.email})` : ""}`,
        }));
    }

    // Procesar usuarios de Jira
    const usuariosJira = Array.isArray(data.usuarios_jira)
      ? data.usuarios_jira
      : Array.isArray(data.usuariosJira)
      ? data.usuariosJira
      : Array.isArray(data.jira_users)
      ? data.jira_users
      : Array.isArray(data.jiraUsers)
      ? data.jiraUsers
      : [];

    return {
      calendarios,
      grupos,
      usuarios_google: usuariosGoogle,
      usuarios_jira: usuariosJira,
    };
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Envía los datos de alta de empleado directamente a n8n
 */
export async function sendEmployeeToN8N(
  formData: EmployeeFormData,
  employees?: FactorialEmployee[]
): Promise<any> {
  const n8nUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;

  if (!n8nUrl) {
    throw new Error(
      "URL de n8n no configurada. Configura NEXT_PUBLIC_N8N_WEBHOOK_URL en las variables de entorno."
    );
  }

  // Transformar los datos al formato de n8n
  const payload = transformToN8NPayload(formData, employees);

  const response = await fetch(n8nUrl, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Error al enviar datos a n8n: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return await response.json();
}

/**
 * Envía los datos de salida de empleado directamente a n8n
 */
export async function sendEmployeeExitToN8N(
  formData: EmployeeExitFormData,
  googleUsers: Array<{ id: string; email: string }>
): Promise<any> {
  const n8nUrl = process.env.NEXT_PUBLIC_N8N_EMPLOYEE_EXIT_WEBHOOK_URL;

  if (!n8nUrl) {
    throw new Error(
      "Webhook URL no configurada. Configura NEXT_PUBLIC_N8N_EMPLOYEE_EXIT_WEBHOOK_URL en las variables de entorno."
    );
  }

  // Buscar el email del usuario de Google
  const usuarioGoogle = googleUsers.find((u) => u.id === formData.usuarioGoogle);

  if (!usuarioGoogle || !usuarioGoogle.email) {
    throw new Error("No se pudo encontrar el email del usuario de Google seleccionado");
  }

  const responsableTraspaso = formData.responsableTraspaso
    ? googleUsers.find((u) => u.id === formData.responsableTraspaso)
    : null;

  if (formData.responsableTraspaso && (!responsableTraspaso || !responsableTraspaso.email)) {
    throw new Error("No se pudo encontrar el email del responsable del traspaso seleccionado");
  }

  // Formatear la fecha de finalización al formato YYYY-MM-DD
  const terminated_on = formatDateToYYYYMMDD(formData.fechaFinalizacion);

  const payload = {
    id_factorial: formData.employeeId,
    userKey: usuarioGoogle.email,
    manager_mail: responsableTraspaso?.email || undefined,
    accountId: formData.usuarioJira,
    terminated_on,
  };

  const response = await fetch(n8nUrl, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Error al enviar datos a n8n: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return await response.json();
}

/**
 * Tipos de recursos de Factorial que se pueden obtener a través de n8n
 */
export type FactorialResourceType =
  | "legal_entities"
  | "roles"
  | "employees"
  | "contract_types"
  | "levels"
  | "active_employees";

/**
 * Mapeo de recursos a URLs de Factorial
 */
const FACTORIAL_ENDPOINTS: Record<FactorialResourceType, string> = {
  legal_entities: "https://api.factorialhr.com/api/2026-01-01/resources/companies/legal_entities",
  roles: "https://api.factorialhr.com/api/2026-01-01/resources/job_catalog/roles",
  employees: "https://api.factorialhr.com/api/2026-01-01/resources/employees/employees",
  contract_types: "https://api.factorialhr.com/api/2026-01-01/resources/contracts/spanish_contract_types",
  levels: "https://api.factorialhr.com/api/2026-01-01/resources/job_catalog/levels",
  active_employees: "https://api.factorialhr.com/api/2026-01-01/resources/employees/employees?only_active=true",
};

/**
 * Llama a Factorial a través de n8n (proxy genérico)
 * @param method Método HTTP (GET, POST, etc.)
 * @param url URL completa de la API de Factorial
 * @returns Respuesta de Factorial
 */
export async function callFactorialViaN8N(
  method: string = "GET",
  url: string
): Promise<any> {
  const webhookUrl = process.env.NEXT_PUBLIC_N8N_FACTORIAL_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error(
      "Webhook URL de Factorial no configurada. Configura NEXT_PUBLIC_N8N_FACTORIAL_WEBHOOK_URL en las variables de entorno."
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos de timeout

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        method,
        url,
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error al llamar a Factorial: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();

    // n8n puede devolver los datos en diferentes formatos
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === "object" && "data" in data && Array.isArray(data.data)) {
      return data.data;
    } else if (data && typeof data === "object" && "results" in data && Array.isArray(data.results)) {
      return data.results;
    } else {
      return data;
    }
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Timeout al llamar a Factorial`);
    }
    throw error;
  }
}

/**
 * Obtiene datos de Factorial a través de n8n (proxy genérico)
 * @param resource Tipo de recurso a obtener
 * @returns Array de datos del recurso solicitado
 */
export async function fetchFactorialDataFromN8N<T>(
  resource: FactorialResourceType
): Promise<T[]> {
  const url = FACTORIAL_ENDPOINTS[resource];
  if (!url) {
    throw new Error(`Resource desconocido: ${resource}`);
  }

  const data = await callFactorialViaN8N("GET", url);
  
  // Asegurar que devolvemos un array
  if (Array.isArray(data)) {
    return data;
  } else {
    console.warn(`Formato de respuesta inesperado para ${resource}:`, data);
    return [];
  }
}

/**
 * Obtiene todos los datos de Factorial en paralelo a través de n8n
 */
export async function getAllFactorialDataFromN8N(): Promise<{
  legalEntities: any[];
  roles: any[];
  employees: any[];
  contractTypes: any[];
  levels: any[];
}> {
  const [legalEntities, roles, employees, contractTypes, levels] = await Promise.all([
    fetchFactorialDataFromN8N("legal_entities"),
    fetchFactorialDataFromN8N("roles"),
    fetchFactorialDataFromN8N("employees"),
    fetchFactorialDataFromN8N("contract_types"),
    fetchFactorialDataFromN8N("levels"),
  ]);

  return {
    legalEntities,
    roles,
    employees,
    contractTypes,
    levels,
  };
}

