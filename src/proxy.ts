import { getSessionCookie } from "better-auth/cookies"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  if (getSessionCookie(request)) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL("/sign-in", request.url))
}

export const config = {
  matcher: ["/services/:id"],
}
