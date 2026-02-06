import { NextRequest, NextResponse } from "next/server";
import { EmployeeExitFormData } from "@/types";
import { formatDateToYYYYMMDD } from "@/lib/n8n";

export async function POST(request: NextRequest) {
  try {
    const n8nUrl = process.env.N8N_EMPLOYEE_EXIT_WEBHOOK_URL;

    if (!n8nUrl) {
      return NextResponse.json(
        { error: "Webhook URL no configurada. Configura N8N_EMPLOYEE_EXIT_WEBHOOK_URL en las variables de entorno." },
        { status: 500 }
      );
    }

    const formData: EmployeeExitFormData = await request.json();

    // Obtener los usuarios de Google para buscar los emails por ID
    let googleUsers: Array<{ id: string; email: string }> = [];
    try {
      // Construir la URL del endpoint de masters
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                     request.headers.get('host') ? 
                       `${request.headers.get('x-forwarded-proto') || 'http'}://${request.headers.get('host')}` :
                       'http://localhost:3000';
      
      const mastersResponse = await fetch(`${baseUrl}/api/n8n/masters`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (mastersResponse.ok) {
        const mastersData = await mastersResponse.json();
        googleUsers = (mastersData.usuarios_google || []).map((user: any) => ({
          id: user.id,
          email: user.email,
        }));
      }
    } catch (error) {
      console.error("Error al obtener usuarios de Google:", error);
      // Continuamos sin los usuarios, intentaremos usar los IDs directamente
    }

    // Transformar los datos al formato requerido por n8n
    const usuarioGoogle = googleUsers.find((u) => u.id === formData.usuarioGoogle);
    
    if (!usuarioGoogle || !usuarioGoogle.email) {
      return NextResponse.json(
        { error: "No se pudo encontrar el email del usuario de Google seleccionado" },
        { status: 400 }
      );
    }

    const responsableTraspaso = formData.responsableTraspaso
      ? googleUsers.find((u) => u.id === formData.responsableTraspaso)
      : null;

    if (formData.responsableTraspaso && (!responsableTraspaso || !responsableTraspaso.email)) {
      return NextResponse.json(
        { error: "No se pudo encontrar el email del responsable del traspaso seleccionado" },
        { status: 400 }
      );
    }

    // Formatear la fecha de finalización al formato YYYY-MM-DD
    const terminated_on = formatDateToYYYYMMDD(formData.fechaFinalizacion);

    const payload = {
      id_factorial: formData.employeeId,
      userKey: usuarioGoogle.email,
      manager_mail: responsableTraspaso?.email || undefined,
      accountId: formData.usuarioJira,
      terminated_on,
    };

    console.log("Payload enviado a n8n:", JSON.stringify(payload, null, 2));

    // Obtener el JWT token de las variables de entorno
    const jwtToken = process.env.N8N_JWT_TOKEN;

    // Preparar headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Agregar JWT si está disponible
    if (jwtToken) {
      headers["Authorization"] = `Bearer ${jwtToken}`;
    }

    // Enviar a n8n
    const response = await fetch(n8nUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error al enviar datos a n8n: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    // Devolver la respuesta completa de n8n
    const n8nResponse = await response.json();
    return NextResponse.json(n8nResponse);
  } catch (error) {
    console.error("Error al enviar datos de salida a n8n:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Error desconocido al enviar datos de salida a n8n",
      },
      { status: 500 }
    );
  }
}

