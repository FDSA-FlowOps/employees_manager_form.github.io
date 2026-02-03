import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const envUsername = process.env.AUTH_USERNAME;
    const envPassword = process.env.AUTH_PASSWORD;

    if (!envUsername || !envPassword) {
      return NextResponse.json(
        { error: "Credenciales no configuradas en el servidor" },
        { status: 500 }
      );
    }

    // Verificar credenciales
    if (username === envUsername && password === envPassword) {
      // Crear cookie de sesión
      const cookieStore = await cookies();
      cookieStore.set("auth-session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 días
        path: "/",
      });

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Usuario o contraseña incorrectos" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error al procesar el inicio de sesión",
      },
      { status: 500 }
    );
  }
}

