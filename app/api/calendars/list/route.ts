import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const webhookUrl = process.env.N8N_CALENDARS_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { error: "URL del webhook de calendarios no configurada. Configura N8N_CALENDARS_WEBHOOK_URL en las variables de entorno." },
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
      throw new Error(`Error al obtener calendarios: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const responseText = await response.text();

    if (!responseText || responseText.trim().length === 0) {
      return NextResponse.json([]);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      throw new Error(`Error al parsear respuesta JSON: ${parseError instanceof Error ? parseError.message : "Error desconocido"}`);
    }
    
    // Si la respuesta es un mensaje de confirmación de n8n, devolver array vacío
    if (data?.message && data.message.includes("Workflow was started")) {
      return NextResponse.json([]);
    }
    
    // PRIORIDAD 1: Si es un array que contiene un objeto con items (formato del webhook: respuesta[0].items)
    if (Array.isArray(data) && data.length > 0) {
      const firstElement = data[0];
      if (firstElement && firstElement.items && Array.isArray(firstElement.items)) {
        return NextResponse.json(firstElement.items);
      }
      // Si es un array directo de calendarios (sin items), devolverlo
      return NextResponse.json(data);
    }
    
    // Si tiene items en el objeto raíz, extraer el array de items
    if (data?.items && Array.isArray(data.items)) {
      return NextResponse.json(data.items);
    }
    
    // Si tiene algún formato inesperado, devolver array vacío
    return NextResponse.json([]);
  } catch (error) {
    console.error("Error al obtener calendarios:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al obtener calendarios" },
      { status: 500 }
    );
  }
}

