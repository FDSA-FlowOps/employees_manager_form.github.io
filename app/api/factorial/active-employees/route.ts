import { NextRequest, NextResponse } from "next/server";

const FACTORIAL_API_BASE = "https://api.factorialhr.com/api/2026-01-01/resources";

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
    const response = await fetch(
      `${FACTORIAL_API_BASE}/employees/employees?only_active=true`,
      {
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener empleados activos: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();

    // Extraer el array de datos
    let employees = [];
    if (Array.isArray(data)) {
      employees = data;
    } else if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
      employees = data.data;
    } else if (data && typeof data === 'object' && 'results' in data && Array.isArray(data.results)) {
      employees = data.results;
    }

    // Mapear solo los campos que necesitamos: id y full_name
    const mappedEmployees = employees.map((emp: any) => ({
      id: emp.id,
      full_name: emp.full_name,
    }));

    return NextResponse.json(mappedEmployees);
  } catch (error) {
    console.error("Error fetching active employees:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al obtener empleados activos" },
      { status: 500 }
    );
  }
}

