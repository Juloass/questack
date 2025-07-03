import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  (await cookies()).set("session", "", {
    maxAge: 0,
    path: "/",
  });

  return NextResponse.redirect(new URL("/login", req.url));
}
