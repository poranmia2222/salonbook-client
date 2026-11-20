import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect only /services/[id]
  const isPrivateRoute = /^\/services\/[^/]+$/.test(pathname);

  if (isPrivateRoute && !getSessionCookie(request)) {
    const url = new URL("/sign-in", request.url);

    url.searchParams.set(
      "callbackUrl",
      pathname + request.nextUrl.search
    );

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/services/:path*"],
};