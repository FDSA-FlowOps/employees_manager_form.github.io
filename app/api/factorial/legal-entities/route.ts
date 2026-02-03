import { NextRequest, NextResponse } from "next/server";
import { getLegalEntities } from "@/lib/factorial";

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
    const entities = await getLegalEntities(apiKey);
    return NextResponse.json(entities);
  } catch (error) {
    console.error("Error fetching legal entities:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al obtener entidades legales" },
      { status: 500 }
    );
  }
}

