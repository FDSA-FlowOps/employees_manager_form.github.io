"use client";

import { X, CheckCircle, XCircle } from "lucide-react";

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  results: {
    empleado_creado?: boolean;
    mail_creado?: boolean;
    grupos_asignados?: boolean;
    calendarios_asignados?: boolean;
    jira_gestionado?: boolean;
    mail_acceso_enviado?: boolean;
    registrada_nueva_incorporacion?: boolean;
    google_gestionado?: boolean;
    factorial_gestionado?: boolean;
  };
}

export default function ResultsModal({
  isOpen,
  onClose,
  title,
  results,
}: ResultsModalProps) {
  if (!isOpen) return null;

  // Detectar el tipo de flujo basándose en los campos presentes
  const isExitFlow = results.google_gestionado !== undefined;
  const isEntryFlow = results.mail_creado !== undefined || results.empleado_creado !== undefined;

  // Definir items según el tipo de flujo
  let allItems: Array<{ label: string; value: boolean | undefined }> = [];

  if (isExitFlow) {
    // Items para salida de empleado - factorial_gestionado debe aparecer primero
    allItems = [
      {
        label: "Usuario Factorial Gestionado",
        value: results.factorial_gestionado,
      },
      {
        label: "Usuario de Google Eliminado",
        value: results.google_gestionado,
      },
      {
        label: "Usuario de Jira Eliminado",
        value: results.jira_gestionado,
      },
    ];
  } else if (isEntryFlow) {
    // Items para alta de empleado - empleado_creado debe aparecer primero
    allItems = [
      {
        label: "Empleado Creado en Factorial",
        value: results.empleado_creado,
      },
      {
        label: "Cuenta de mail creada con éxito",
        value: results.mail_creado,
      },
      {
        label: "Grupos Asignados",
        value: results.grupos_asignados,
      },
      {
        label: "Calendarios Asignados",
        value: results.calendarios_asignados,
      },
      {
        label: "Invitación a Jira",
        value: results.jira_gestionado,
      },
      {
        label: "Mail de Acceso Enviado",
        value: results.mail_acceso_enviado,
      },
      {
        label: "Nueva Incorporación Registrada",
        value: results.registrada_nueva_incorporacion,
      },
    ];
  }

  // Filtrar solo los items que tienen valor definido (no undefined)
  const items = allItems.filter(item => item.value !== undefined);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-secondary">
            {title || "Resultados del Proceso"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-3 mb-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span className="text-gray-700 font-medium">{item.label}:</span>
              <div className="flex items-center gap-2">
                {item.value === true ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-600 font-semibold">Sí</span>
                  </>
                ) : item.value === false ? (
                  <>
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span className="text-red-600 font-semibold">No</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-500 font-semibold">N/A</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}


