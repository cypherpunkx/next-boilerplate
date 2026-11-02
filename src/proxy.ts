import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_PAGES = ["/login", "/register", "/forgot-password"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_access_token")?.value;

  const isAuthPage = AUTH_PAGES.some((page) => pathname.startsWith(page));

  // 1. Jika pengguna sudah login tapi mencoba mengakses halaman login/register
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2. Jika pengguna belum login dan mencoba mengakses rute terproteksi
  if (!token && !isAuthPage) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes (/api/*)
     * - static files (_next/static, _next/image, favicon.ico, images)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|mockServiceWorker.js).*)",
  ],
};
