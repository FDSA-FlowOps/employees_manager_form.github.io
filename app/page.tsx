"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";
import Tabs from "@/components/Tabs";
import AltaNuevoCompanero from "@/components/AltaNuevoCompanero";
import SalidaCompanero from "@/components/SalidaCompanero";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const [activeTab, setActiveTab] = useState("alta");
  const router = useRouter();
  const { isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada correctamente");
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: "alta",
      label: "Alta Nuevo Compañero",
      content: <AltaNuevoCompanero />,
    },
    {
      id: "salida",
      label: "Salida Compañero",
      content: <SalidaCompanero />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-secondary mb-2">
                Gestión de Empleados
              </h1>
              <p className="text-gray-600">
                Selecciona la acción que deseas realizar
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-secondary border-2 border-secondary rounded-lg hover:bg-secondary hover:text-white transition-colors font-medium"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>
    </div>
  );
}
