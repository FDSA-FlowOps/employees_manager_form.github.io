import { useState, useEffect } from "react";

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  displayName: string;
}

interface UseGoogleUsersReturn {
  users: GoogleUser[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGoogleUsers(): UseGoogleUsersReturn {
  const [users, setUsers] = useState<GoogleUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/n8n/google-users");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al cargar usuarios de Google");
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido al cargar usuarios de Google");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    isLoading,
    error,
    refetch: fetchUsers,
  };
}

