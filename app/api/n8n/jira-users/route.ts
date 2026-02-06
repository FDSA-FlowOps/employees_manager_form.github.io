import { NextRequest, NextResponse } from "next/server";

// Marcar como dinámica para evitar pre-renderizado en build estático
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const webhookUrl = process.env.N8N_JIRA_USERS_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Webhook URL no configurada. Configura N8N_JIRA_USERS_WEBHOOK_URL en las variables de entorno." },
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
      throw new Error(`Error al obtener usuarios de Jira: ${response.status} ${response.statusText} - ${errorText}`);
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

    // Mapear los campos que necesitamos: accountId, displayName
    const mappedUsers = users.map((user: any) => ({
      accountId: user.accountId || user.account_id || user.id,
      displayName: user.displayName || user.display_name || user.name || "",
    }));

    return NextResponse.json(mappedUsers);
  } catch (error) {
    console.error("Error fetching Jira users:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al obtener usuarios de Jira" },
      { status: 500 }
    );
  }
}

