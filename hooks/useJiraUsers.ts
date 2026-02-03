import { useState, useEffect } from "react";

export interface JiraUser {
  accountId: string;
  displayName: string;
}

interface UseJiraUsersReturn {
  users: JiraUser[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useJiraUsers(): UseJiraUsersReturn {
  const [users, setUsers] = useState<JiraUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/n8n/jira-users");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al cargar usuarios de Jira");
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido al cargar usuarios de Jira");
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

