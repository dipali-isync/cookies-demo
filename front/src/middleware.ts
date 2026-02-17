import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("refreshToken")?.value;

  // Restrict login/register if already authenticated
  if (
    accessToken &&
    (req.nextUrl.pathname === "/" || req.nextUrl.pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Protect dashboard if not authenticated
  if (!accessToken && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Apply middleware only to specific routes
export const config = {
  matcher: ["/", "/register", "/dashboard/:path*"],
};
