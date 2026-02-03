"use client";

import { useState } from "react";
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";
import toast from "react-hot-toast";
import { EmployeeFormData } from "@/types";
import FormField from "./FormField";
import SelectField from "./SelectField";
import SearchableSelectField from "./SearchableSelectField";
import MultiSelectField from "./MultiSelectField";
import SearchableMultiSelectField from "./SearchableMultiSelectField";
import { useFactorialData } from "@/hooks/useFactorialData";
import { useMasters } from "@/hooks/useMasters";
import { User, Mail, Building, Briefcase, Calendar, Euro, FileText, UserCircle, Globe, Users2, Image as ImageIcon, X } from "lucide-react";

interface EmployeeFormProps {
  register: UseFormRegister<EmployeeFormData>;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  errors: FieldErrors<EmployeeFormData>;
  watch: UseFormWatch<EmployeeFormData>;
  setValue: UseFormSetValue<EmployeeFormData>;
  isSubmitting: boolean;
}

export default function EmployeeForm({
  register,
  handleSubmit,
  errors,
  watch,
  setValue,
  isSubmitting,
}: EmployeeFormProps) {
  const { legalEntities, roles, employees, contractTypes, levels, isLoading, error } =
    useFactorialData();
  const { calendarios, grupos, isLoading: isLoadingMasters, error: errorMasters } = useMasters();

  const rolSeleccionado = watch("rol");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Verificar si el rol seleccionado es "Desarrollador/a"
  const rolNombre = roles.find((r) => r.id.toString() === rolSeleccionado)?.name || "";
  const mostrarNivel = rolNombre.toLowerCase().includes("desarrollador");

  // Función para manejar la selección de imagen
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImagePreview(null);
      setValue("image", "");
      return;
    }

    // Validar que sea una imagen
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecciona un archivo de imagen válido");
      e.target.value = "";
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no puede superar los 5MB");
      e.target.value = "";
      return;
    }

    // Convertir a base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setValue("image", base64String);
      setImagePreview(base64String);
    };
    reader.onerror = () => {
      toast.error("Error al leer el archivo de imagen");
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información Personal */}
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-xl font-semibold text-secondary mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Información Personal
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Nombre"
            required
            error={errors.nombre?.message}
            tooltip="Nombre de pila del empleado"
          >
            <input
              type="text"
              {...register("nombre")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary transition-colors ${
                errors.nombre ? "border-red-500" : "border-gray-300 hover:border-secondary-light"
              }`}
              placeholder="Ej: Juan"
            />
          </FormField>

          <FormField
            label="Primer Apellido"
            required
            error={errors.primerApellido?.message}
            tooltip="Primer apellido del empleado"
          >
            <input
              type="text"
              {...register("primerApellido")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary transition-colors ${
                errors.primerApellido
                  ? "border-red-500"
                  : "border-gray-300 hover:border-secondary-light"
              }`}
              placeholder="Ej: García"
            />
          </FormField>

          <FormField
            label="Segundo Apellido"
            error={errors.segundoApellido?.message}
            tooltip="Segundo apellido del empleado (opcional)"
          >
            <input
              type="text"
              {...register("segundoApellido")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary transition-colors ${
                errors.segundoApellido
                  ? "border-red-500"
                  : "border-gray-300 hover:border-secondary-light"
              }`}
              placeholder="Ej: López"
            />
          </FormField>

          <FormField
            label="Email"
            required
            error={errors.email?.message}
            tooltip="Dirección de correo electrónico corporativa"
            description="Se utilizará para accesos y comunicaciones oficiales"
          >
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                {...register("email")}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary transition-colors ${
                  errors.email
                    ? "border-red-500"
                    : "border-gray-300 hover:border-secondary-light"
                }`}
                placeholder="empleado@empresa.com"
              />
            </div>
          </FormField>

          <div className="md:col-span-2">
            <FormField
              label="Imagen"
              tooltip="Imagen del empleado (opcional)"
              error={errors.image?.message}
              description="Formato: JPG, PNG, GIF. Tamaño máximo: 5MB"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors cursor-pointer">
                    <ImageIcon className="w-5 h-5" />
                    <span>Seleccionar imagen</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setValue("image", "");
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Eliminar</span>
                    </button>
                  )}
                </div>
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Vista previa"
                      className="max-w-xs max-h-48 rounded-lg border border-gray-300 object-cover"
                    />
                  </div>
                )}
              </div>
            </FormField>
          </div>

          <FormField
            label="Nacionalidad"
            error={errors.nacionalidad?.message}
            tooltip="Nacionalidad del empleado"
          >
            <input
              type="text"
              {...register("nacionalidad")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary transition-colors ${
                errors.nacionalidad
                  ? "border-red-500"
                  : "border-gray-300 hover:border-secondary-light"
              }`}
              placeholder="Ej: Española"
            />
          </FormField>

          <FormField
            label="Género"
            error={errors.genero?.message}
            tooltip="Género del empleado (opcional)"
          >
            <select
              {...register("genero")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary transition-colors ${
                errors.genero
                  ? "border-red-500"
                  : "border-gray-300 hover:border-secondary-light"
              }`}
            >
              <option value="">Selecciona una opción</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
              <option value="Prefiero no decir">Prefiero no decir</option>
            </select>
          </FormField>

          <div className="md:col-span-2">
            <FormField
              label="Frase Personalizada"
              tooltip="Frase personalizada para el empleado (opcional)"
              error={errors.custom_phrase?.message}
              description="Mensaje o frase personalizada que se asociará al empleado"
            >
              <textarea
                {...register("custom_phrase")}
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary transition-colors resize-none ${
                  errors.custom_phrase
                    ? "border-red-500"
                    : "border-gray-300 hover:border-secondary-light"
                }`}
                placeholder="Ej: Bienvenido al equipo, estamos encantados de tenerte con nosotros..."
              />
            </FormField>
          </div>
        </div>
      </div>

      {/* Información Laboral */}
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-xl font-semibold text-secondary mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Información Laboral
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SearchableSelectField
            label="Entidad Legal"
            required
            tooltip="Entidad legal a la que pertenece el empleado"
            error={errors.entidadLegal?.message}
            value={watch("entidadLegal") || ""}
            onChange={(value) => setValue("entidadLegal", value)}
            options={legalEntities.map((e) => ({ id: e.id, name: e.legal_name }))}
            isLoading={isLoading}
            displayField="name"
          />

          <SearchableSelectField
            label="Rol"
            required
            tooltip="Rol o posición del empleado en la organización"
            error={errors.rol?.message}
            value={watch("rol") || ""}
            onChange={(value) => {
              setValue("rol", value);
              // Limpiar el nivel si se cambia el rol
              if (value !== rolSeleccionado) {
                setValue("jobLevelId", "");
              }
            }}
            options={roles}
            isLoading={isLoading}
          />

          {mostrarNivel && (
            <SearchableSelectField
              label="Nivel"
              required
              tooltip="Nivel del desarrollador en la organización"
              error={
                errors.jobLevelId?.message ||
                (!watch("jobLevelId") && mostrarNivel
                  ? "El nivel es obligatorio para el rol de Desarrollador/a"
                  : undefined)
              }
              value={watch("jobLevelId") || ""}
              onChange={(value) => setValue("jobLevelId", value)}
              options={levels}
              isLoading={isLoading}
              placeholder="Selecciona un nivel"
            />
          )}

          <FormField
            label="Inicio del Contrato"
            required
            tooltip="Fecha de inicio del contrato laboral"
            error={errors.inicioContrato?.message}
            description="Formato: DD/MM/AAAA"
          >
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                {...register("inicioContrato")}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary transition-colors ${
                  errors.inicioContrato
                    ? "border-red-500"
                    : "border-gray-300 hover:border-secondary-light"
                }`}
              />
            </div>
          </FormField>

          <FormField
            label="Tiene Periodo de Prueba"
            tooltip="Indica si el empleado tiene un periodo de prueba"
          >
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("tienePeriodoPrueba")}
                className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-secondary"
              />
              <span className="text-gray-700">
                El empleado tiene periodo de prueba
              </span>
            </label>
          </FormField>

          <FormField
            label="Importe Salario"
            required
            tooltip="Salario bruto anual del empleado"
            error={errors.importeSalario?.message}
            description="Importe en euros (bruto anual)"
          >
            <div className="relative">
              <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("importeSalario", { valueAsNumber: true })}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary transition-colors ${
                  errors.importeSalario
                    ? "border-red-500"
                    : "border-gray-300 hover:border-secondary-light"
                }`}
                placeholder="30000.00"
              />
            </div>
          </FormField>

          <SearchableSelectField
            label="Tipo de Contrato"
            required
            tooltip="Tipo de contrato laboral según la legislación española"
            error={errors.tipoContrato?.message}
            value={watch("tipoContrato") || ""}
            onChange={(value) => setValue("tipoContrato", value)}
            options={contractTypes}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Equipo, Calendarios y Grupos */}
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-xl font-semibold text-secondary mb-4 flex items-center gap-2">
          <Users2 className="w-5 h-5" />
          Equipo, Calendarios y Grupos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Equipo"
            tooltip="Equipo al que pertenece el empleado"
            error={errors.team?.message}
          >
            <select
              {...register("team")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary transition-colors ${
                errors.team
                  ? "border-red-500"
                  : "border-gray-300 hover:border-secondary-light"
              }`}
            >
              <option value="">Selecciona un equipo</option>
              <option value="AMS">AMS</option>
              <option value="Webbeds">Webbeds</option>
              <option value="Expansion">Expansion</option>
            </select>
          </FormField>

          <SearchableSelectField
            label="Mail del Equipo"
            tooltip="Dirección de correo electrónico del equipo"
            error={errors.teamMail?.message}
            description="Email del equipo al que pertenece el empleado"
            value={watch("teamMail") || ""}
            onChange={(value) => setValue("teamMail", value)}
            options={(Array.isArray(grupos) ? grupos : []).map((group) => ({
              id: group.email,
              name: group.email,
              email: group.email,
            }))}
            isLoading={isLoadingMasters}
            placeholder="Selecciona el mail del equipo"
            displayField="email"
          />

          <SearchableSelectField
            label="Responsable de Equipo"
            required
            tooltip="Persona responsable del equipo al que pertenece el empleado"
            error={errors.responsableEquipo?.message}
            value={watch("responsableEquipo") || ""}
            onChange={(value) => setValue("responsableEquipo", value)}
            options={employees.map((e) => ({ id: e.id, name: e.full_name }))}
            isLoading={isLoading}
            displayField="name"
          />

          <FormField
            label="Mail del Responsable"
            tooltip="Dirección de correo electrónico del responsable de equipo"
            error={errors.manager_mail?.message}
            description="Email del responsable de equipo"
          >
            <input
              type="email"
              {...register("manager_mail")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary transition-colors ${
                errors.manager_mail
                  ? "border-red-500"
                  : "border-gray-300 hover:border-secondary-light"
              }`}
              placeholder="ejemplo@fdsa.es"
            />
          </FormField>

          <SearchableSelectField
            label="Tutor"
            tooltip="Tutor asignado al nuevo empleado"
            error={errors.tutor?.message}
            value={watch("tutor") || ""}
            onChange={(value) => setValue("tutor", value)}
            options={employees.map((e) => ({ id: e.id, name: e.full_name }))}
            isLoading={isLoading}
            displayField="name"
          />

          <FormField
            label="Mail del Tutor"
            tooltip="Dirección de correo electrónico del tutor"
            error={errors.tutor_mail?.message}
            description="Email del tutor asignado"
          >
            <input
              type="email"
              {...register("tutor_mail")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary transition-colors ${
                errors.tutor_mail
                  ? "border-red-500"
                  : "border-gray-300 hover:border-secondary-light"
              }`}
              placeholder="ejemplo@fdsa.es"
            />
          </FormField>

          <SearchableMultiSelectField
            label="Calendarios"
            tooltip="Calendarios de Google Calendar a los que se añadirá el empleado"
            error={errors.calendars?.message}
            value={watch("calendars") || []}
            onChange={(value) => setValue("calendars", value)}
            options={(Array.isArray(calendarios) ? calendarios : []).map((calendar) => ({
              id: calendar.id,
              name: calendar.summary,
              email: calendar.dataOwner,
            }))}
            isLoading={isLoadingMasters}
            placeholder="Selecciona los calendarios"
            displayField="name"
          />

          <SearchableMultiSelectField
            label="Grupos"
            tooltip="Grupos de Google a los que se añadirá el empleado"
            error={errors.groups?.message}
            value={watch("groups") || []}
            onChange={(value) => setValue("groups", value)}
            options={(Array.isArray(grupos) ? grupos : []).map((group) => ({
              id: group.id,
              name: group.name,
              email: group.email,
            }))}
            isLoading={isLoadingMasters}
            placeholder="Selecciona los grupos"
            displayField="name"
          />
        </div>
        {errorMasters && (
          <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">
              Error al cargar maestros: {errorMasters}
            </p>
          </div>
        )}
      </div>

      {/* Accesos y Perfil */}
      <div className="pb-6">
        <h2 className="text-xl font-semibold text-secondary mb-4 flex items-center gap-2">
          <UserCircle className="w-5 h-5" />
          Accesos y Perfil
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Username de Google"
            required
            tooltip="Nombre de usuario de Google Workspace"
            error={errors.usernameGoogle?.message}
            description="Usuario sin el dominio @empresa.com"
          >
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                {...register("usernameGoogle")}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary transition-colors ${
                  errors.usernameGoogle
                    ? "border-red-500"
                    : "border-gray-300 hover:border-secondary-light"
                }`}
                placeholder="juan.garcia"
              />
            </div>
          </FormField>

          <FormField
            label="Perfil"
            required
            tooltip="Tipo de perfil del empleado en la organización"
            error={errors.perfil?.message}
          >
            <select
              {...register("perfil")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary transition-colors ${
                errors.perfil
                  ? "border-red-500"
                  : "border-gray-300 hover:border-secondary-light"
              }`}
            >
              <option value="">Selecciona un perfil</option>
              <option value="Empleado FDSA">Empleado FDSA</option>
              <option value="Freelance">Freelance</option>
              <option value="Global Talent">Global Talent</option>
            </select>
          </FormField>
        </div>
      </div>

      {/* Mensaje de error de Factorial */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">
            Error al cargar datos de Factorial: {error}
          </p>
        </div>
      )}

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
          disabled={isSubmitting || isLoading || !!error}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin">⏳</span>
              Procesando...
            </>
          ) : (
            "Dar de Alta Empleado"
          )}
        </button>
      </div>
    </form>
  );
}

