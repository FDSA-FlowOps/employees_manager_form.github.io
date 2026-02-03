import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("auth-session");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en logout:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error al cerrar sesión",
      },
      { status: 500 }
    );
  }
}

