import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "super-secret-admin-token-nambi-portfolio-2026"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public paths that do not require authentication
  const isPublicPath = 
    pathname === '/login' || 
    pathname.startsWith('/api/auth');
    
  const sessionCookie = request.cookies.get('admin-session')?.value;
  
  if (isPublicPath) {
    if (sessionCookie && pathname === '/login') {
      try {
        await jwtVerify(sessionCookie, JWT_SECRET);
        return NextResponse.redirect(new URL('/', request.url));
      } catch {
        // Token is invalid, let them log in again
      }
    }
    return NextResponse.next();
  }
  
  // Protected paths: redirect to /login if no valid token
  if (!sessionCookie) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  try {
    await jwtVerify(sessionCookie, JWT_SECRET);
    return NextResponse.next();
  } catch {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('admin-session');
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
