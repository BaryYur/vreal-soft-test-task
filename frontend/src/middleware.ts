import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { routes } from "@/config/routes";

const publicRoutes = [routes.signIn, routes.signUp];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("accessToken")?.value;

  const isPublicRoute = publicRoutes.some(
    (route) => pathname === `/${route}` || pathname.startsWith(`/${route}/`),
  );

  const isProtectedRoute = pathname.startsWith(
    `/${routes.storageDashboard.index}`,
  );

  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${routes.signIn}`, request.url));
  }

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL(`/${routes.signIn}`, request.url));
  }

  if (token && isPublicRoute) {
    return NextResponse.redirect(
      new URL(`/${routes.storageDashboard.index}`, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images).*)"],
};
