import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Secret key for JWT verification. MUST match the one in login/route.ts
const JWT_SECRET = new TextEncoder().encode('SUPER_SECRET_AEROSPACE_ENCRYPTION_KEY_2026');

export async function proxy(request: NextRequest) {
  // If the user is trying to access the dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('auth_token');
    
    // If no token at all, bounce
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Mathematically verify the signature and expiration of the JWT
      // If it's forged, modified, or expired, this throws an error.
      const { payload } = await jwtVerify(token.value, JWT_SECRET);
      
      // RBAC: Check clearance level for restricted routes
      const clearance = payload.clearance as number;
      const restrictedRoutes = ['/dashboard/settings', '/dashboard/roster'];
      
      if (restrictedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
        if (clearance < 5) {
          // If a Level 1 analyst tries to access Level 5 pages, block them!
          return NextResponse.redirect(new URL('/dashboard?error=insufficient_clearance', request.url));
        }
      }
      
      // If we got here, the token is perfectly valid and clearance is verified!
      return NextResponse.next();
      
    } catch (error) {
      // Token is invalid/expired
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('auth_token'); // Clear the bad cookie
      return response;
    }
  }

  // If already logged in and visiting home or login, bounce to dashboard
  if (request.nextUrl.pathname === '/' || request.nextUrl.pathname === '/login') {
    const token = request.cookies.get('auth_token');
    if (token) {
      try {
        await jwtVerify(token.value, JWT_SECRET);
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch (e) {
        // Just let them go to login if token is bad
        return NextResponse.next();
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|textures).*)'],
};
