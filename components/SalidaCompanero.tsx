"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import EmployeeExitForm from "@/components/EmployeeExitForm";
import Modal from "@/components/Modal";
import ResultsModal from "@/components/ResultsModal";
import { EmployeeExitFormData } from "@/types";
import { Loader2 } from "lucide-react";
import { useMasters } from "@/hooks/useMasters";

const employeeExitSchema = z.object({
  employeeId: z
    .string({ required_error: "El empleado es obligatorio" })
    .min(1, "Debes seleccionar un empleado"),
  perfil: z
    .string({ required_error: "El perfil es obligatorio" })
    .min(1, "Debes seleccionar un perfil")
    .refine(
      (val) => ["Compañero FDSA", "Freelance", "Global Talent"].includes(val),
      {
        message: "Debes seleccionar un perfil válido",
      }
    ) as z.ZodType<"Compañero FDSA" | "Freelance" | "Global Talent">,
  usuarioGoogle: z
    .string({ required_error: "El usuario de Google es obligatorio" })
    .min(1, "Debes seleccionar un usuario de Google"),
  usuarioJira: z
    .string({ required_error: "El usuario de Jira es obligatorio" })
    .min(1, "Debes seleccionar un usuario de Jira"),
  responsableTraspaso: z
    .string()
    .optional(),
  fechaFinalizacion: z
    .string({ required_error: "La fecha de finalización es obligatoria" })
    .min(1, "Debes seleccionar una fecha de finalización"),
  termination_reason: z
    .string()
    .optional(),
});

export default function SalidaCompanero() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [isSubmittingToN8N, setIsSubmittingToN8N] = useState(false);
  const [formData, setFormData] = useState<EmployeeExitFormData | null>(null);
  const [results, setResults] = useState<{
    factorial_gestionado?: boolean;
    google_gestionado?: boolean;
    jira_gestionado?: boolean;
  }>({});
  const { usuariosGoogle } = useMasters();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<EmployeeExitFormData>({
    resolver: zodResolver(employeeExitSchema),
  });

  const onSubmit = (data: EmployeeExitFormData) => {
    setFormData(data);
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    if (!formData) return;

    setShowConfirmModal(false);
    setIsSubmittingToN8N(true);

    try {
      // Convertir usuarios de Google al formato esperado
      const googleUsers = usuariosGoogle.map((user) => ({
        id: user.id,
        email: user.email,
      }));

      // Llamar directamente a n8n desde el cliente
      const { sendEmployeeExitToN8N } = await import("@/lib/n8n-client");
      const result = await sendEmployeeExitToN8N(formData, googleUsers);
      
      // Extraer los resultados de la respuesta de n8n
      const responseResults = {
        factorial_gestionado: result.factorial_gestionado,
        google_gestionado: result.google_gestionado,
        jira_gestionado: result.jira_gestionado,
      };
      
      setResults(responseResults);
      setShowResultsModal(true);
      reset();
      setFormData(null);
      toast.success("Proceso de salida completado");
    } catch (error) {
      console.error("Error al procesar la salida del empleado:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al procesar la salida del empleado";
      toast.error(errorMessage);
    } finally {
      setIsSubmittingToN8N(false);
    }
  };

  // Obtener el nombre del empleado para el modal
  const employeeName = formData?.employeeId || "";

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
          <h2 className="text-2xl font-bold text-secondary mb-2">
            Salida de Compañero
          </h2>
          <p className="text-gray-600">
            Completa el formulario para procesar la salida de un empleado del sistema
          </p>
        </div>

        <EmployeeExitForm
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
        title="Confirmar Salida de Empleado"
        message={`¿Estás seguro de que deseas procesar la salida del empleado seleccionado?`}
        confirmText="Confirmar"
        cancelText="Cancelar"
      />

      {/* Modal de resultados */}
      <ResultsModal
        isOpen={showResultsModal}
        onClose={() => setShowResultsModal(false)}
        title="Resultados de la Salida"
        results={results}
      />
    </>
  );
}

