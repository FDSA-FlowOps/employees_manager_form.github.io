import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const webhookUrl = process.env.N8N_GROUPS_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { error: "URL del webhook de grupos no configurada. Configura N8N_GROUPS_WEBHOOK_URL en las variables de entorno." },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "Next.js-FDSA-App",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener grupos: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    
    // Si la respuesta es un mensaje de confirmación de n8n, devolver array vacío
    if (data?.message && data.message.includes("Workflow was started")) {
      return NextResponse.json([]);
    }
    
    // Si es un array, devolverlo directamente
    if (Array.isArray(data)) {
      return NextResponse.json(data);
    }
    
    // Si tiene algún formato inesperado, devolver array vacío
    return NextResponse.json([]);
  } catch (error) {
    console.error("Error al obtener grupos:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al obtener grupos" },
      { status: 500 }
    );
  }
}

