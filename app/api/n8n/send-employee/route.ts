import { NextRequest, NextResponse } from "next/server";
import { transformToN8NPayload, sendToN8N } from "@/lib/n8n";
import { EmployeeFormData, FactorialEmployee } from "@/types";
import { getEmployees } from "@/lib/factorial";

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

    // Obtener la lista de empleados para buscar el nombre completo del tutor
    const apiKey = process.env.FACTORIAL_API_KEY || request.headers.get("x-api-key");
    let employees: FactorialEmployee[] = [];
    if (apiKey) {
      try {
        employees = await getEmployees(apiKey);
      } catch (error) {
        console.error("Error al obtener empleados para el tutor:", error);
        // Continuamos sin la lista de empleados, el tutor será undefined
      }
    }

    // Transformar los datos al formato de n8n
    const payload = transformToN8NPayload(formData, employees);

    // Enviar a n8n y obtener la respuesta completa
    const n8nResponse = await sendToN8N(n8nUrl, payload);

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

