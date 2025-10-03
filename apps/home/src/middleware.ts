import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/investments")) {
    try {
      const response = await fetch("http://localhost:3001/investments", {
        method: "HEAD",
        headers: {
          Accept: "text/html,application/xhtml+xml,application/xml",
        },
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        return NextResponse.next();
      } else {
        return NextResponse.rewrite(new URL("/investments-unavailable", request.url));
      }
    } catch (error) {
      console.error("Investments service unavailable:", error);
      return NextResponse.rewrite(new URL("/investments-unavailable", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/investments/:path*"],
};
