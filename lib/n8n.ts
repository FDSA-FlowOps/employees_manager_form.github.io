import { EmployeeFormData, FactorialEmployee, FactorialTeam, Group } from "@/types";

export interface N8NPayload {
  first_name: string;
  last_name: string;
  email: string;
  company_id: number;
  legal_entity_id: number;
  nationality?: string;
  gender?: string;
  role: number;
  job_level_id?: number;
  manager_id: number;
  timeoff_manager_id: number;
  manager_mail?: string;
  tutor?: string;
  tutor_mail?: string;
  contract_starts_on: string;
  has_trial_period: boolean;
  trial_period_ends_on?: string;
  salary_amount: number;
  es_contract_type_id: number;
  username: string;
  profile: string;
  team?: string;
  team_id?: number;
  team_mail?: string;
  calendars?: string[];
  groups?: string[];
  custom_phrase?: string;
  image?: string; // Base64 encoded image
}

/**
 * Capitaliza la primera letra y convierte el resto a minúsculas
 */
function capitalizeFirst(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Normaliza el género a "male" o "female", o undefined si no es uno de esos valores
 */
function normalizeGender(gender?: string): "male" | "female" | undefined {
  if (!gender) return undefined;
  
  const normalized = gender.toLowerCase().trim();
  if (normalized === "masculino" || normalized === "male") {
    return "male";
  }
  if (normalized === "femenino" || normalized === "female") {
    return "female";
  }
  
  // Cualquier otro valor (Otro, Prefiero no decir, etc.) no se envía
  return undefined;
}

/**
 * Formatea una fecha al formato YYYY-MM-DD
 */
export function formatDateToYYYYMMDD(dateInput: string): string {
  if (!dateInput) return "";
  
  // Si ya está en formato YYYY-MM-DD, lo usamos directamente
  if (dateInput.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateInput;
  }
  
  // Intentar parsear la fecha
  const date = new Date(dateInput);
  if (!isNaN(date.getTime())) {
    // Obtener año, mes y día en formato YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  
  return "";
}

/**
 * Obtiene team_id (número) y nombre del equipo a partir del team_id del formulario y la lista de equipos
 */
function resolveTeamFromId(
  teamId: string | undefined,
  teams: FactorialTeam[] | undefined
): { team_id?: number; team?: string } {
  if (!teamId || !teams?.length) return {};
  const id = parseInt(teamId, 10);
  if (Number.isNaN(id)) return {};
  const team = teams.find((t) => t.id === id);
  return team ? { team_id: team.id, team: team.name } : {};
}

/**
 * Transforma los datos del formulario al formato requerido por n8n
 */
export function transformToN8NPayload(
  data: EmployeeFormData,
  employees?: FactorialEmployee[],
  teams?: FactorialTeam[]
): N8NPayload {
  // first_name: primera letra mayúscula, resto minúscula
  const first_name = capitalizeFirst(data.nombre);

  // last_name: dos apellidos separados por espacio, primera letra mayúscula
  const apellidos = [data.primerApellido, data.segundoApellido]
    .filter(Boolean)
    .map(capitalizeFirst);
  const last_name = apellidos.join(" ");

  // Formatear fecha al formato YYYY-MM-DD
  const contract_starts_on = formatDateToYYYYMMDD(data.inicioContrato);

  const companyId = parseInt(data.entidadLegal);
  const { team_id: resolvedTeamId, team: resolvedTeamName } = resolveTeamFromId(
    data.team_id,
    teams
  );

  return {
    first_name,
    last_name,
    email: data.email,
    company_id: companyId,
    legal_entity_id: companyId, // Mismo que company_id
    nationality: data.nacionalidad || undefined,
    gender: normalizeGender(data.genero),
    role: parseInt(data.rol),
    job_level_id: data.jobLevelId ? parseInt(data.jobLevelId) : undefined,
    manager_id: parseInt(data.responsableEquipo),
    timeoff_manager_id: parseInt(data.responsableEquipo), // Mismo que manager_id
    manager_mail: data.manager_mail || undefined,
    tutor: data.tutor && employees
      ? employees.find((e) => e.id.toString() === data.tutor)?.full_name || undefined
      : undefined,
    tutor_mail: data.tutor_mail || undefined,
    contract_starts_on,
    has_trial_period: data.tienePeriodoPrueba,
    trial_period_ends_on: data.trialPeriodoPruebaEndsOn
      ? formatDateToYYYYMMDD(data.trialPeriodoPruebaEndsOn)
      : undefined,
    salary_amount: data.importeSalario,
    es_contract_type_id: parseInt(data.tipoContrato),
    username: data.usernameGoogle,
    profile: data.perfil,
    team: resolvedTeamName,
    team_id: resolvedTeamId,
    team_mail: data.teamMail || undefined,
    calendars: data.calendars && data.calendars.length > 0 ? data.calendars : undefined,
    groups: data.groups && data.groups.length > 0 ? data.groups : undefined,
    custom_phrase: data.custom_phrase || undefined,
    image: data.image || undefined,
  };
}

/**
 * Envía los datos a n8n
 */
export async function sendToN8N(
  url: string,
  payload: N8NPayload,
  jwtToken?: string
): Promise<any> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Agregar JWT si está disponible
  if (jwtToken) {
    headers["Authorization"] = `Bearer ${jwtToken}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Error al enviar datos a n8n: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  // Devolver la respuesta completa de n8n
  return await response.json();
}

