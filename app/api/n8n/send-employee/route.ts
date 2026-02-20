import { NextRequest, NextResponse } from "next/server";
import { transformToN8NPayload, sendToN8N } from "@/lib/n8n";
import { EmployeeFormData, FactorialEmployee, FactorialTeam } from "@/types";
import { getEmployees, getTeams } from "@/lib/factorial";

export async function POST(request: NextRequest) {
  try {
    const n8nUrl = process.env.N8N_WEBHOOK_URL;

    if (!n8nUrl) {
      return NextResponse.json(
        { error: "URL de n8n no configurada. Configura N8N_WEBHOOK_URL en las variables de entorno." },
        { status: 500 }
      );
    }

    const formData: EmployeeFormData = await request.json();

    // Obtener la lista de empleados y equipos de Factorial
    const apiKey = process.env.FACTORIAL_API_KEY || request.headers.get("x-api-key");
    let employees: FactorialEmployee[] = [];
    let teams: FactorialTeam[] = [];
    if (apiKey) {
      try {
        [employees, teams] = await Promise.all([
          getEmployees(apiKey),
          getTeams(apiKey),
        ]);
      } catch (error) {
        console.error("Error al obtener datos de Factorial:", error);
        // Continuamos sin empleados/teams; el tutor y team_id serán undefined
      }
    }

    // Transformar los datos al formato de n8n
    const payload = transformToN8NPayload(formData, employees, teams);

    // Obtener el JWT token de las variables de entorno
    const jwtToken = process.env.N8N_JWT_TOKEN;

    // Enviar a n8n y obtener la respuesta completa
    const n8nResponse = await sendToN8N(n8nUrl, payload, jwtToken);

    // Devolver la respuesta completa de n8n
    return NextResponse.json(n8nResponse);
  } catch (error) {
    console.error("Error al enviar datos a n8n:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Error desconocido al enviar datos a n8n",
      },
      { status: 500 }
    );
  }
}

