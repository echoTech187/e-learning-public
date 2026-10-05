import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

declare global {
  var __platformStatus: { is_suspended: number; expiresAt: number } | undefined;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/maintenance" ||
    pathname === "/platform-status.json"
  ) {
    return NextResponse.next();
  }

  const now = Date.now();
  let isSuspended = 0;

  if (globalThis.__platformStatus && globalThis.__platformStatus.expiresAt > now) {
    isSuspended = globalThis.__platformStatus.is_suspended;
  } else {
    try {
      const res = await fetch(new URL("/platform-status.json", request.url));
      if (res.ok) {
        const data = await res.json();
        isSuspended = data.is_suspended === 1 ? 1 : 0;
        globalThis.__platformStatus = {
          is_suspended: isSuspended,
          expiresAt: now + 60000,
        };
      }
    } catch (e) {
      // Default to active on error
    }
  }

  if (isSuspended === 1) {
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
