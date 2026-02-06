import { NextRequest, NextResponse } from "next/server";
import { getLevels } from "@/lib/factorial";

export async function GET(request: NextRequest) {
  // Prioridad: NEXT_PUBLIC_FACTORIAL_API_KEY > FACTORIAL_API_KEY > header
  // Durante el build estático, solo usar variable de entorno (request.headers no está disponible)
  const apiKey = process.env.NEXT_PUBLIC_FACTORIAL_API_KEY || process.env.FACTORIAL_API_KEY || (request?.headers?.get("x-api-key") ?? null);

  if (!apiKey) {
    return NextResponse.json(
      { error: "API key requerida. Configura FACTORIAL_API_KEY en las variables de entorno o envía x-api-key en el header." },
      { status: 401 }
    );
  }

  try {
    const levels = await getLevels(apiKey);
    return NextResponse.json(levels);
  } catch (error) {
    console.error("Error fetching levels:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al obtener niveles" },
      { status: 500 }
    );
  }
}

