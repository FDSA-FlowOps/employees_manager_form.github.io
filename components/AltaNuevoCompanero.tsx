"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import EmployeeForm from "@/components/EmployeeForm";
import Modal from "@/components/Modal";
import ResultsModal from "@/components/ResultsModal";
import { EmployeeFormData } from "@/types";
import { useFactorialData } from "@/hooks/useFactorialData";
import { useMasters } from "@/hooks/useMasters";
import { Sparkles, Loader2 } from "lucide-react";

const employeeSchema = z.object({
  nombre: z
    .string({ required_error: "El nombre es obligatorio" })
    .min(1, "El nombre es obligatorio"),
  primerApellido: z
    .string({ required_error: "El primer apellido es obligatorio" })
    .min(1, "El primer apellido es obligatorio"),
  segundoApellido: z.string().optional(),
  email: z
    .string({ required_error: "El email es obligatorio" })
    .min(1, "El email es obligatorio")
    .email("Por favor, introduce un email válido"),
  entidadLegal: z
    .string({ required_error: "La entidad legal es obligatoria" })
    .min(1, "Debes seleccionar una entidad legal"),
  nacionalidad: z.string().optional(),
  genero: z.string().optional(),
  rol: z
    .string({ required_error: "El rol es obligatorio" })
    .min(1, "Debes seleccionar un rol"),
  jobLevelId: z.string().optional(),
  responsableEquipo: z
    .string({ required_error: "El responsable de equipo es obligatorio" })
    .min(1, "Debes seleccionar un responsable de equipo"),
  manager_mail: z
    .string()
    .refine(
      (val) => !val || val === "" || z.string().email().safeParse(val).success,
      { message: "Por favor, introduce un email válido" }
    )
    .optional(),
  tutor: z.string().optional(),
  tutor_mail: z
    .string()
    .refine(
      (val) => !val || val === "" || z.string().email().safeParse(val).success,
      { message: "Por favor, introduce un email válido" }
    )
    .optional(),
  inicioContrato: z
    .string({ required_error: "La fecha de inicio del contrato es obligatoria" })
    .min(1, "Debes seleccionar una fecha de inicio del contrato"),
  tienePeriodoPrueba: z.boolean().default(false),
  importeSalario: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) {
        return undefined;
      }
      const num = typeof val === "string" ? parseFloat(val) : val;
      return isNaN(Number(num)) ? undefined : Number(num);
    },
    z
      .number({
        required_error: "El importe del salario es obligatorio",
        invalid_type_error: "El salario debe ser un número válido",
      })
      .min(0, "El salario debe ser mayor o igual a 0")
  ),
  tipoContrato: z
    .string({ required_error: "El tipo de contrato es obligatorio" })
    .min(1, "Debes seleccionar un tipo de contrato"),
  usernameGoogle: z
    .string({ required_error: "El username de Google es obligatorio" })
    .min(1, "El username de Google es obligatorio"),
  perfil: z
    .string({ required_error: "El perfil es obligatorio" })
    .min(1, "Debes seleccionar un perfil")
    .refine(
      (val) => ["Compañero FDSA", "Freelance", "Global Talent"].includes(val),
      {
        message: "Debes seleccionar un perfil válido",
      }
    ) as z.ZodType<"Compañero FDSA" | "Freelance" | "Global Talent">,
  team: z.enum(["AMS", "Webbeds", "Expansion"]).optional(),
  teamMail: z.string().optional(),
  calendars: z.array(z.string()).optional(),
  groups: z.array(z.string()).optional(),
  custom_phrase: z.string().optional(),
  image: z.string().optional(),
});

export default function AltaNuevoCompanero() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [isSubmittingToN8N, setIsSubmittingToN8N] = useState(false);
  const [formData, setFormData] = useState<EmployeeFormData | null>(null);
  const [results, setResults] = useState<{
    empleado_creado?: boolean;
    mail_creado?: boolean;
    grupos_asignados?: boolean;
    calendarios_asignados?: boolean;
    jira_gestionado?: boolean;
    mail_acceso_enviado?: boolean;
    registrada_nueva_incorporacion?: boolean;
  }>({});
  const { legalEntities, roles, employees, contractTypes, levels } = useFactorialData();
  const { calendarios, grupos, isLoading: isLoadingMasters } = useMasters();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      tienePeriodoPrueba: false,
    },
  });

  const autoFillForm = async () => {
    // Verificar si los datos están cargando
    if (isLoadingMasters) {
      toast.error("Espera a que se carguen los datos antes de auto-rellenar");
      return;
    }
    
    // Asegurar que los arrays estén disponibles
    const groupsArray = Array.isArray(grupos) ? grupos : [];
    const calendarsArray = Array.isArray(calendarios) ? calendarios : [];
    
    console.log("🔍 Grupos disponibles:", groupsArray.length, groupsArray.map(g => ({ name: g.name, email: g.email })));
    console.log("🔍 Calendarios disponibles:", calendarsArray.length, calendarsArray.map(c => ({ summary: c.summary })));
    
    // Buscar IDs por nombre (búsqueda case-insensitive y parcial)
    const findLegalEntity = (name: string) => {
      const entity = legalEntities.find((e) =>
        e.legal_name.toLowerCase().includes(name.toLowerCase())
      );
      return entity?.id.toString() || "";
    };

    const findRole = (name: string) => {
      const role = roles.find((r) =>
        r.name.toLowerCase().includes(name.toLowerCase())
      );
      return role?.id.toString() || "";
    };

    const findEmployee = (name: string) => {
      const employee = employees.find((e) =>
        e.full_name.toLowerCase().includes(name.toLowerCase())
      );
      return employee?.id.toString() || "";
    };

    const findContractType = (name: string) => {
      const contractType = contractTypes.find((c) =>
        c.name.toLowerCase().includes(name.toLowerCase())
      );
      return contractType?.id.toString() || "";
    };

    const findLevel = (name: string) => {
      const level = levels.find((l) =>
        l.name.toLowerCase().includes(name.toLowerCase())
      );
      return level?.id.toString() || "";
    };

    const findCalendar = (name: string) => {
      const calendar = calendarsArray.find((c) =>
        c.summary.toLowerCase().includes(name.toLowerCase())
      );
      if (calendar) {
        console.log(`✅ Calendario encontrado: "${name}" -> ${calendar.summary} (${calendar.id})`);
      } else {
        console.log(`❌ Calendario no encontrado: "${name}"`);
      }
      return calendar?.id || "";
    };

    const findGroup = (name: string) => {
      const group = groupsArray.find((g) =>
        g.name.toLowerCase().includes(name.toLowerCase())
      );
      if (group) {
        console.log(`✅ Grupo encontrado: "${name}" -> ${group.name} (${group.id})`);
      } else {
        console.log(`❌ Grupo no encontrado: "${name}"`);
      }
      return group?.id || "";
    };

    const findGroupByEmail = (email: string) => {
      const group = groupsArray.find((g) =>
        g.email.toLowerCase() === email.toLowerCase()
      );
      if (group) {
        console.log(`✅ Grupo por email encontrado: "${email}" -> ${group.email}`);
      } else {
        console.log(`❌ Grupo por email no encontrado: "${email}"`);
      }
      return group?.email || "";
    };

    // Formatear fecha: 16/01/2026 -> 2026-01-16
    const formatDate = (dateStr: string) => {
      const [day, month, year] = dateStr.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    };

    // Rellenar campos
    setValue("nombre", "Ilas");
    setValue("primerApellido", "Echeandia");
    setValue("segundoApellido", "");
    setValue("email", "ilas@prueba.es");
    setValue("nacionalidad", "Española");
    setValue("genero", "Femenino");
    setValue("entidadLegal", findLegalEntity("FDSA DESAROLLO SL"));
    setValue("rol", findRole("Desarrollador"));
    setValue("jobLevelId", findLevel("Mid II"));
    setValue("responsableEquipo", findEmployee("Fernando Campos Segura"));
    setValue("manager_mail", "fernando.campos@fdsa.es");
    setValue("tutor", findEmployee("Fernando Campos Segura"));
    setValue("tutor_mail", "fernando.campos@fdsa.es");
    setValue("inicioContrato", formatDate("16/01/2026"));
    setValue("tienePeriodoPrueba", true);
    setValue("importeSalario", 30000);
    setValue("tipoContrato", findContractType("Indefinido"));
    setValue("usernameGoogle", "ilass.echeandia");
    setValue("perfil", "Compañero FDSA");
    setValue("team", "AMS");
    
    // Mail del Equipo: buscar por email
    const teamMailValue = findGroupByEmail("ams@fdsa.es");
    setValue("teamMail", teamMailValue);
    console.log("📧 Mail del Equipo asignado:", teamMailValue);
    
    // Calendarios: Equipo FDSA y Ausencias AMS
    const calendarIds: string[] = [];
    const equipoFDSA = findCalendar("Equipo FDSA");
    const ausenciasAMS = findCalendar("Ausencias AMS");
    if (equipoFDSA) calendarIds.push(equipoFDSA);
    if (ausenciasAMS) calendarIds.push(ausenciasAMS);
    setValue("calendars", calendarIds);
    console.log("📅 Calendarios asignados:", calendarIds);
    
    // Grupos: Equipo y AMS
    const groupIds: string[] = [];
    const grupoEquipo = findGroup("Equipo");
    const grupoAMS = findGroup("AMS");
    if (grupoEquipo) groupIds.push(grupoEquipo);
    if (grupoAMS) groupIds.push(grupoAMS);
    setValue("groups", groupIds);
    console.log("👥 Grupos asignados:", groupIds);

    toast.success("Formulario auto-rellenado con datos de prueba");
  };

  const onSubmit = (data: EmployeeFormData) => {
    // Validar que si el rol es Desarrollador/a, el nivel sea obligatorio
    const rolNombre = roles.find((r) => r.id.toString() === data.rol)?.name || "";
    if (rolNombre.toLowerCase().includes("desarrollador") && !data.jobLevelId) {
      toast.error("El nivel es obligatorio para el rol de Desarrollador/a");
      return;
    }

    setFormData(data);
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    if (!formData) return;

    setShowConfirmModal(false);
    setIsSubmittingToN8N(true);

    try {
      // Llamar directamente a n8n desde el cliente
      const { sendEmployeeToN8N } = await import("@/lib/n8n-client");
      const result = await sendEmployeeToN8N(formData, employees);
      
      // Extraer los resultados de la respuesta
      const responseResults = {
        empleado_creado: result.empleado_creado,
        mail_creado: result.mail_creado,
        grupos_asignados: result.grupos_asignados,
        calendarios_asignados: result.calendarios_asignados,
        jira_gestionado: result.jira_gestionado,
        mail_acceso_enviado: result.mail_acceso_enviado,
        registrada_nueva_incorporacion: result.registrada_nueva_incorporacion,
      };
      
      setResults(responseResults);
      setShowResultsModal(true);
      reset();
      setFormData(null);
    } catch (error) {
      console.error("Error al dar de alta el empleado:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al dar de alta el empleado";
      toast.error(errorMessage);
    } finally {
      setIsSubmittingToN8N(false);
    }
  };

  return (
    <>
      {/* Loading Overlay */}
      {isSubmittingToN8N && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-8 flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-gray-700 font-medium text-lg">
              Procesando solicitud en n8n...
            </p>
            <p className="text-gray-500 text-sm">
              Por favor, espera mientras se completa el proceso
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-2xl font-bold text-secondary mb-2">
                Alta de Nuevo Empleado
              </h2>
              <p className="text-gray-600">
                Completa el formulario para dar de alta a un nuevo empleado en el sistema
              </p>
            </div>
            <button
              type="button"
              onClick={autoFillForm}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors text-sm font-medium"
              title="Auto-rellenar formulario con datos de prueba"
            >
              <Sparkles className="w-4 h-4" />
              Auto-rellenar
            </button>
          </div>
        </div>

        <EmployeeForm
          register={register}
          handleSubmit={handleSubmit(onSubmit)}
          errors={errors}
          watch={watch}
          setValue={setValue}
          isSubmitting={isSubmitting}
        />
      </div>

      {/* Modal de confirmación */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
        title="Confirmar Alta de Empleado"
        message={`¿Estás seguro de que deseas dar de alta a ${formData?.nombre} ${formData?.primerApellido}?`}
        confirmText="Confirmar"
        cancelText="Cancelar"
      />

      {/* Modal de resultados */}
      <ResultsModal
        isOpen={showResultsModal}
        onClose={() => setShowResultsModal(false)}
        results={results}
      />
    </>
  );
}

