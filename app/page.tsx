"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";
import Tabs from "@/components/Tabs";
import AltaNuevoCompanero from "@/components/AltaNuevoCompanero";
import SalidaCompanero from "@/components/SalidaCompanero";

export default function Home() {
  const [activeTab, setActiveTab] = useState("alta");
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Error al cerrar sesión");
      }

      toast.success("Sesión cerrada correctamente");
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión");
    }
  };

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
