import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, isRole, resolveAccess } from "@/lib/auth";

/**
 * Proteksi route per role di server (bukan hanya menyembunyikan menu).
 * Ini cek optimistik; be-bsd tetap penentu akses data.
 */
export function proxy(request: NextRequest) {
  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  const decision = resolveAccess(request.nextUrl.pathname, isRole(cookie) ? cookie : null);

  if (decision.type === "login") {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", decision.next);
    return NextResponse.redirect(url);
  }
  if (decision.type === "redirect") {
    return NextResponse.redirect(new URL(decision.to, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/nasabah/:path*", "/petugas/:path*", "/admin/:path*"],
};
