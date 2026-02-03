"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

// Credenciales hardcodeadas (solo para GitHub Pages estático)
// En producción real, esto debería estar en variables de entorno del cliente
// o mejor aún, usar un servicio de autenticación externo
const AUTH_USERNAME = process.env.NEXT_PUBLIC_AUTH_USERNAME || "";
const AUTH_PASSWORD = process.env.NEXT_PUBLIC_AUTH_PASSWORD || "";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Verificar autenticación al cargar
    const checkAuth = () => {
      const authSession = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-session="))
        ?.split("=")[1];

      const isAuth = authSession === "authenticated";
      setIsAuthenticated(isAuth);
      setIsLoading(false);

      // Redirigir si no está autenticado y no está en login
      if (!isAuth && pathname !== "/login") {
        router.push("/login");
      }

      // Redirigir si está autenticado y está en login
      if (isAuth && pathname === "/login") {
        router.push("/");
      }
    };

    checkAuth();
  }, [pathname, router]);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Verificar credenciales
    if (username === AUTH_USERNAME && password === AUTH_PASSWORD) {
      // Establecer cookie del cliente
      document.cookie = `auth-session=authenticated; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 días
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    // Eliminar cookie
    document.cookie = "auth-session=; path=/; max-age=0";
    setIsAuthenticated(false);
    router.push("/login");
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}

