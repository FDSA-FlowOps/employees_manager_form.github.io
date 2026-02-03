import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authSession = cookieStore.get("auth-session");

    return NextResponse.json({
      authenticated: authSession?.value === "authenticated",
    });
  } catch (error) {
    return NextResponse.json(
      {
        authenticated: false,
        error:
          error instanceof Error
            ? error.message
            : "Error al verificar autenticación",
      },
      { status: 500 }
    );
  }
}

