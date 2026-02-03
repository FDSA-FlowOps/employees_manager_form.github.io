"use client";

import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { EmployeeExitFormData } from "@/types";
import FormField from "./FormField";
import SelectField from "./SelectField";
import SearchableSelectField from "./SearchableSelectField";
import SearchableSelectFieldWithSubtitle from "./SearchableSelectFieldWithSubtitle";
import { useActiveEmployees } from "@/hooks/useActiveEmployees";
import { useMasters } from "@/hooks/useMasters";
import { User, Briefcase, Mail, Calendar } from "lucide-react";

interface EmployeeExitFormProps {
  register: UseFormRegister<EmployeeExitFormData>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: FieldErrors<EmployeeExitFormData>;
  watch: UseFormWatch<EmployeeExitFormData>;
  setValue: UseFormSetValue<EmployeeExitFormData>;
  isSubmitting: boolean;
}

export default function EmployeeExitForm({
  register,
  handleSubmit,
  errors,
  watch,
  setValue,
  isSubmitting,
}: EmployeeExitFormProps) {
  const { employees, isLoading: isLoadingEmployees, error: errorEmployees } = useActiveEmployees();
  const { usuariosGoogle, usuariosJira, isLoading: isLoadingMasters } = useMasters();

  // Preparar opciones para los selectores
  const employeeOptions = employees.map((emp) => ({
    id: emp.id,
    name: emp.full_name,
  }));

  const googleUserOptions = usuariosGoogle.map((user) => ({
    id: user.id,
    name: user.name || user.displayName,
    subtitle: user.email,
  }));

  const jiraUserOptions = usuariosJira.map((user) => ({
    id: user.accountId,
    name: user.displayName,
  }));

  const perfilOptions = [
    { id: "Empleado FDSA", name: "Empleado FDSA" },
    { id: "Freelance", name: "Freelance" },
    { id: "Global Talent", name: "Global Talent" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información del Empleado */}
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-xl font-semibold text-secondary mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Información del Empleado
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SearchableSelectField
            label="Empleado"
            required
            error={errors.employeeId?.message}
            tooltip="Selecciona el empleado que va a salir"
            value={watch("employeeId") || ""}
            onChange={(value) => setValue("employeeId", value)}
            options={employeeOptions}
            isLoading={isLoadingEmployees}
            placeholder="Buscar empleado..."
            searchPlaceholder="Buscar por nombre..."
            displayField="name"
          />
        </div>
      </div>

      {/* Información de Perfil y Usuarios */}
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-xl font-semibold text-secondary mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Perfil y Usuarios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectField
            label="Perfil"
            required
            error={errors.perfil?.message}
            tooltip="Tipo de perfil del empleado"
            value={watch("perfil") || ""}
            onChange={(value) => setValue("perfil", value as "Empleado FDSA" | "Freelance" | "Global Talent")}
            options={perfilOptions}
            placeholder="Selecciona un perfil"
          />

          <SearchableSelectFieldWithSubtitle
            label="Usuario Google"
            required
            error={errors.usuarioGoogle?.message}
            tooltip="Selecciona el usuario de Google asociado"
            value={watch("usuarioGoogle") || ""}
            onChange={(value) => setValue("usuarioGoogle", value)}
            options={googleUserOptions}
            isLoading={isLoadingMasters}
            placeholder="Buscar usuario de Google..."
            searchPlaceholder="Buscar por nombre o email..."
            displayField="name"
            subtitleField="subtitle"
          />

          <SearchableSelectField
            label="Usuario Jira"
            required
            error={errors.usuarioJira?.message}
            tooltip="Selecciona el usuario de Jira asociado"
            value={watch("usuarioJira") || ""}
            onChange={(value) => setValue("usuarioJira", value)}
            options={jiraUserOptions}
            isLoading={isLoadingMasters}
            placeholder="Buscar usuario de Jira..."
            searchPlaceholder="Buscar por nombre..."
            displayField="name"
          />

          <SearchableSelectFieldWithSubtitle
            label="Responsable del Traspaso"
            error={errors.responsableTraspaso?.message}
            tooltip="Selecciona el responsable del traspaso del empleado"
            value={watch("responsableTraspaso") || ""}
            onChange={(value) => setValue("responsableTraspaso", value)}
            options={googleUserOptions}
            isLoading={isLoadingMasters}
            placeholder="Buscar responsable del traspaso..."
            searchPlaceholder="Buscar por nombre o email..."
            displayField="name"
            subtitleField="subtitle"
          />

          <FormField
            label="Fecha de Finalización"
            required
            tooltip="Fecha de finalización del contrato del empleado"
            error={errors.fechaFinalizacion?.message}
            description="Formato: DD/MM/AAAA"
          >
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                {...register("fechaFinalizacion")}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary transition-colors ${
                  errors.fechaFinalizacion
                    ? "border-red-500"
                    : "border-gray-300 hover:border-secondary-light"
                }`}
              />
            </div>
          </FormField>
        </div>
      </div>

      {/* Botón de envío */}
      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-6 py-3 text-secondary border-2 border-secondary rounded-lg hover:bg-secondary hover:text-white transition-colors font-medium"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isLoadingEmployees || isLoadingMasters}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin">⏳</span>
              Procesando...
            </>
          ) : (
            "Procesar Salida"
          )}
        </button>
      </div>
    </form>
  );
}

