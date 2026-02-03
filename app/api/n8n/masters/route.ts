import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const webhookUrl = process.env.N8N_MASTERS_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Webhook URL no configurada. Configura N8N_MASTERS_WEBHOOK_URL en las variables de entorno." },
      { status: 500 }
    );
  }

  try {
    // Aumentar el timeout para esperar a que el workflow termine
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 segundos de timeout

    console.log("Llamando a webhook:", webhookUrl);
    
    const response = await fetch(webhookUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      cache: "no-store", // Deshabilitar cache para obtener siempre datos frescos
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log("Status de respuesta:", response.status);
    console.log("Headers de respuesta:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al obtener maestros: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const responseText = await response.text();
    console.log("Respuesta texto cruda:", responseText.substring(0, 500)); // Primeros 500 caracteres
    
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Error parseando JSON:", e);
      console.error("Respuesta completa:", responseText);
      throw new Error(`Error al parsear respuesta de n8n: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
    
    console.log("Respuesta cruda de n8n:", JSON.stringify(data, null, 2));
    console.log("Claves del objeto data:", Object.keys(data));

    // Verificar si el workflow está respondiendo con un mensaje de inicio en lugar de datos
    if (data.message === "Workflow was started") {
      console.error("El webhook de n8n está respondiendo inmediatamente sin esperar al workflow.");
      console.error("Por favor, configura el webhook en n8n para que espere a que el workflow termine antes de responder.");
      throw new Error("El workflow de n8n está configurado para ejecutarse de forma asíncrona. El webhook debe estar configurado para esperar a que el workflow termine (modo síncrono) y devolver los datos directamente.");
    }

    // La respuesta ahora viene directamente como un objeto con cada uno de los nodos de los listados
    // Procesar calendarios - viene como array con un objeto que contiene items
    let calendarios = [];
    if (data.calendarios) {
      if (Array.isArray(data.calendarios) && data.calendarios.length > 0) {
        // Si el primer elemento tiene items, extraerlos
        if (data.calendarios[0] && data.calendarios[0].items && Array.isArray(data.calendarios[0].items)) {
          calendarios = data.calendarios[0].items;
        } else {
          // Si no tiene items, usar el array directamente
          calendarios = data.calendarios;
        }
      } else if (data.calendarios.items && Array.isArray(data.calendarios.items)) {
        // Si viene como objeto con items (formato de Google Calendar API)
        calendarios = data.calendarios.items;
      } else if (Array.isArray(data.calendario)) {
        calendarios = data.calendario;
      }
    }
    
    // Procesar grupos
    const grupos = Array.isArray(data.grupos) ? data.grupos : 
                  Array.isArray(data.grupo) ? data.grupo : [];
    
    // Procesar usuarios de Google - viene como array con un objeto que contiene users
    let usuariosGoogle = [];
    const googleData = data.usuarios_google || data.usuariosGoogle || data.google_users || data.googleUsers;
    
    if (googleData) {
      let users = [];
      
      // Caso 1: Array con un objeto que tiene propiedad users (formato de Google Admin API)
      if (Array.isArray(googleData) && googleData.length > 0 && googleData[0]?.users && Array.isArray(googleData[0].users)) {
        users = googleData[0].users;
      }
      // Caso 2: Array directo de usuarios
      else if (Array.isArray(googleData)) {
        users = googleData;
      }
      // Caso 3: Objeto con propiedad users
      else if (googleData.users && Array.isArray(googleData.users)) {
        users = googleData.users;
      }
      // Caso 4: Objeto con propiedad data
      else if (googleData.data && Array.isArray(googleData.data)) {
        users = googleData.data;
      }
      // Caso 5: Objeto con propiedad results
      else if (googleData.results && Array.isArray(googleData.results)) {
        users = googleData.results;
      }
      
      // Mapear los usuarios de Google al formato esperado
      // Los usuarios vienen con estructura: { id, primaryEmail, name: { fullName, givenName, familyName } }
      usuariosGoogle = users
        .filter((user: any) => user && (user.id || user.primaryEmail || user.email || (user.name && (user.name.fullName || user.name.fullname))))
        .map((user: any) => ({
          id: user.id || "",
          name: user.name?.fullName || user.name?.fullname || user.name || "",
          email: user.primaryEmail || user.email || "",
          displayName: `${user.name?.fullName || user.name?.fullname || user.name || ""}${user.primaryEmail || user.email ? ` (${user.primaryEmail || user.email})` : ""}`,
        }));
    }
    
    // Procesar usuarios de Jira
    const usuariosJira = Array.isArray(data.usuarios_jira) ? data.usuarios_jira : 
                        Array.isArray(data.usuariosJira) ? data.usuariosJira :
                        Array.isArray(data.jira_users) ? data.jira_users :
                        Array.isArray(data.jiraUsers) ? data.jiraUsers : [];
    
    console.log("Calendarios procesados:", calendarios.length);
    console.log("Grupos procesados:", grupos.length);
    console.log("Usuarios Google procesados:", usuariosGoogle.length);
    console.log("Usuarios Jira procesados:", usuariosJira.length);

    // Deshabilitar cache en la respuesta
    return NextResponse.json({
      calendarios,
      grupos,
      usuarios_google: usuariosGoogle,
      usuarios_jira: usuariosJira,
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error("Error fetching masters:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al obtener maestros" },
      { status: 500 }
    );
  }
}

