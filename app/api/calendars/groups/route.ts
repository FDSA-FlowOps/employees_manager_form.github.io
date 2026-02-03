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
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener calendarios: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching calendars:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al obtener calendarios" },
      { status: 500 }
    );
  }
}

