import { NextResponse } from "next/server";

export function middleware(request) {
  //simple cookie authenication check for ux purpose
  const isAuthenticated = request.cookies.get("isAuth");

  if (isAuthenticated) {
    return NextResponse.next();
  }

  // Redirect to login page if not authenticated
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: "/",
};
