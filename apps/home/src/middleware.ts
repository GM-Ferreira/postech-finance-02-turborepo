import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/cards')) {
    try {
      const response = await fetch('http://localhost:3001/cards', {
        method: 'HEAD',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml',
        },
        signal: AbortSignal.timeout(3000),
      });

      if (response.ok) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL('/cards-unavailable', request.url));
      }
    } catch (error) {
      console.log('Cards service unavailable:', error);
      return NextResponse.redirect(new URL('/cards-unavailable', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/cards/:path*'],
};