import { NextRequest, NextResponse } from "next/server";
import { getEmployees } from "@/lib/factorial";

// Durante el build estático, estas rutas no se pueden ejecutar
// Se devuelve un array vacío para evitar errores de prerendering
export async function GET(request: NextRequest) {
  // Prioridad: NEXT_PUBLIC_FACTORIAL_API_KEY > FACTORIAL_API_KEY
  // Nota: Estas rutas no se usan en GitHub Pages (se usa n8n como proxy), pero se mantienen para desarrollo local
  // Durante el build estático, no intentamos acceder a request.headers para evitar errores
  const apiKey = process.env.NEXT_PUBLIC_FACTORIAL_API_KEY || process.env.FACTORIAL_API_KEY;

  if (!apiKey) {
    // Durante el build estático, devolver array vacío en lugar de error
    return NextResponse.json([]);
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

