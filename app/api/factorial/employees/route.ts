import { NextRequest, NextResponse } from "next/server";
import { getEmployees } from "@/lib/factorial";

// Marcar como dinámica para evitar pre-renderizado en build estático
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // Prioridad: variable de entorno > header
  const apiKey = process.env.FACTORIAL_API_KEY || request.headers.get("x-api-key");

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key requerida. Configura FACTORIAL_API_KEY en las variables de entorno o envía x-api-key en el header." },
      { status: 401 }
    );
  }

  try {
    const employees = await getEmployees(apiKey);
    return NextResponse.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al obtener empleados" },
      { status: 500 }
    );
  }
}

