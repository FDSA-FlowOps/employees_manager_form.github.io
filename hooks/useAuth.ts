"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

// Credenciales hardcodeadas (solo para GitHub Pages estático)
// IMPORTANTE: Estas variables se inyectan en tiempo de build
// Si están vacías, la autenticación no funcionará
// Configúralas en GitHub Secrets como NEXT_PUBLIC_AUTH_USERNAME y NEXT_PUBLIC_AUTH_PASSWORD
const AUTH_USERNAME = process.env.NEXT_PUBLIC_AUTH_USERNAME || "";
const AUTH_PASSWORD = process.env.NEXT_PUBLIC_AUTH_PASSWORD || "";

// Debug: Verificar si las variables están disponibles (solo en desarrollo)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('Auth config:', { 
    hasUsername: !!AUTH_USERNAME, 
    hasPassword: !!AUTH_PASSWORD 
  });
}

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
    // Si las variables están vacías, usar valores por defecto para desarrollo
    const validUsername = AUTH_USERNAME || process.env.NEXT_PUBLIC_AUTH_USERNAME || "";
    const validPassword = AUTH_PASSWORD || process.env.NEXT_PUBLIC_AUTH_PASSWORD || "";
    
    if (!validUsername || !validPassword) {
      console.error("⚠️ Las credenciales no están configuradas. Configura NEXT_PUBLIC_AUTH_USERNAME y NEXT_PUBLIC_AUTH_PASSWORD en GitHub Secrets.");
      return false;
    }
    
    if (username === validUsername && password === validPassword) {
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

