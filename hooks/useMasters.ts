"use client";

import { useState, useEffect } from "react";
import { Calendar, Group } from "@/types";

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  displayName: string;
}

export interface JiraUser {
  accountId: string;
  displayName: string;
}

interface MastersData {
  calendarios: Calendar[];
  grupos: Group[];
  usuarios_google: GoogleUser[];
  usuarios_jira: JiraUser[];
}

interface UseMastersReturn {
  calendarios: Calendar[];
  grupos: Group[];
  usuariosGoogle: GoogleUser[];
  usuariosJira: JiraUser[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useMasters(): UseMastersReturn {
  const [calendarios, setCalendarios] = useState<Calendar[]>([]);
  const [grupos, setGrupos] = useState<Group[]>([]);
  const [usuariosGoogle, setUsuariosGoogle] = useState<GoogleUser[]>([]);
  const [usuariosJira, setUsuariosJira] = useState<JiraUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMasters = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/n8n/masters");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al cargar maestros");
      }

      const data: MastersData = await response.json();

      // Asegurar que siempre sean arrays
      setCalendarios(Array.isArray(data.calendarios) ? data.calendarios : []);
      setGrupos(Array.isArray(data.grupos) ? data.grupos : []);
      setUsuariosGoogle(Array.isArray(data.usuarios_google) ? data.usuarios_google : []);
      setUsuariosJira(Array.isArray(data.usuarios_jira) ? data.usuarios_jira : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido al cargar maestros");
      console.error("Error fetching masters:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Solo ejecutar en el cliente, no durante el build estático
    if (typeof window !== 'undefined') {
      fetchMasters();
    }
  }, []);

  return {
    calendarios,
    grupos,
    usuariosGoogle,
    usuariosJira,
    isLoading,
    error,
    refetch: fetchMasters,
  };
}




