import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;
    const role = token?.role;

    // Admin-only zone
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      if (role === "RECRUTEUR") return NextResponse.redirect(new URL("/recruteur/dashboard", req.url));
      return NextResponse.redirect(new URL("/student/dashboard", req.url));
    }

    // Student-only zone
    if (pathname.startsWith("/student")) {
      if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", req.url));
      if (role === "RECRUTEUR") return NextResponse.redirect(new URL("/recruteur/dashboard", req.url));
    }

    // Recruiter-only zone
    if (pathname.startsWith("/recruteur")) {
      if (role === "ADMIN") return NextResponse.redirect(new URL("/admin", req.url));
      if (role === "STUDENT") return NextResponse.redirect(new URL("/student/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        if (
          pathname.startsWith("/admin") ||
          pathname.startsWith("/student") ||
          pathname.startsWith("/recruteur")
        ) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/student/:path*", "/recruteur/:path*"],
};
