import { NextRequest, NextResponse } from "next/server";

// Marcar como dinámica para evitar pre-renderizado en build estático
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const webhookUrl = process.env.N8N_GOOGLE_USERS_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Webhook URL no configurada. Configura N8N_GOOGLE_USERS_WEBHOOK_URL en las variables de entorno." },
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
      throw new Error(`Error al obtener usuarios de Google: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();

    // La respuesta puede venir en diferentes formatos
    let users = [];
    if (Array.isArray(data)) {
      users = data;
    } else if (data && typeof data === 'object' && 'data' in data && Array.isArray(data.data)) {
      users = data.data;
    } else if (data && typeof data === 'object' && 'results' in data && Array.isArray(data.results)) {
      users = data.results;
    }

    // Mapear los campos que necesitamos: id, name.fullName, primaryEmail
    const mappedUsers = users.map((user: any) => ({
      id: user.id,
      name: user.name?.fullName || user.name?.fullname || user.name || "",
      email: user.primaryEmail || user.email || "",
      displayName: `${user.name?.fullName || user.name?.fullname || user.name || ""}${user.primaryEmail || user.email ? ` (${user.primaryEmail || user.email})` : ""}`,
    }));

    return NextResponse.json(mappedUsers);
  } catch (error) {
    console.error("Error fetching Google users:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al obtener usuarios de Google" },
      { status: 500 }
    );
  }
}

