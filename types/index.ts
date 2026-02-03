export interface EmployeeFormData {
  nombre: string;
  primerApellido: string;
  segundoApellido: string;
  email: string;
  entidadLegal: string;
  nacionalidad?: string;
  genero?: string;
  rol: string;
  jobLevelId?: string;
  responsableEquipo: string;
  manager_mail?: string;
  tutor?: string;
  tutor_mail?: string;
  inicioContrato: string;
  tienePeriodoPrueba: boolean;
  importeSalario: number;
  tipoContrato: string;
  usernameGoogle: string;
  perfil: "Empleado FDSA" | "Freelance" | "Global Talent";
  team?: "AMS" | "Webbeds" | "Expansion";
  teamMail?: string;
  calendars?: string[];
  groups?: string[];
  custom_phrase?: string;
  image?: string; // Base64 encoded image
}

export interface EmployeeExitFormData {
  employeeId: string;
  perfil: "Empleado FDSA" | "Freelance" | "Global Talent";
  usuarioGoogle: string;
  usuarioJira: string;
  responsableTraspaso?: string;
  fechaFinalizacion: string;
}

export interface FactorialLegalEntity {
  id: number;
  legal_name: string;
}

export interface FactorialRole {
  id: number;
  name: string;
}

export interface FactorialEmployee {
  id: number;
  full_name: string;
}

export interface FactorialContractType {
  id: number;
  name: string;
}

export interface FactorialOnboardingSpace {
  id: number;
  name: string;
}

export interface FactorialLevel {
  id: number;
  name: string;
}

export interface Calendar {
  kind: string;
  etag: string;
  id: string;
  summary: string;
  timeZone: string;
  dataOwner: string;
  summaryOverride?: string;
  colorId: string;
  backgroundColor: string;
  foregroundColor: string;
  accessRole: string;
  defaultReminders: any[];
  conferenceProperties: {
    allowedConferenceSolutionTypes: string[];
  };
}

export interface CalendarListResponse {
  kind: string;
  etag: string;
  nextSyncToken: string;
  items: Calendar[];
}

export interface Group {
  kind: string;
  id: string;
  etag: string;
  email: string;
  name: string;
  directMembersCount: string;
  description: string;
  adminCreated: boolean;
}
