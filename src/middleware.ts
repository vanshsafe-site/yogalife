import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define which routes need authentication
const protectedRoutes = ['/dashboard', '/admin'];
const authRoutes = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get auth cookie
  const authCookie = request.cookies.get('auth');
  const isAuthenticated = !!authCookie?.value;
  
  // For debugging in Vercel logs
  console.log(`Middleware: Path ${pathname}, Auth: ${isAuthenticated}`);
  
  // Check if user is trying to access protected routes without authentication
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !isAuthenticated) {
    console.log('Middleware: Redirecting unauthenticated user to login');
    // Redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If user is authenticated and trying to access auth routes, redirect to dashboard
  if (authRoutes.some(route => pathname.startsWith(route)) && isAuthenticated) {
    try {
      const userData = JSON.parse(authCookie.value);
      console.log('Middleware: Redirecting authenticated user to appropriate dashboard');
      
      // Check if user is admin
      if (userData.isAdmin) {
        return NextResponse.redirect(new URL('/admin', request.url));
      } else {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch (error) {
      console.error('Middleware: Error parsing auth cookie', error);
      // If there's an error parsing the cookie, clear it and continue
      const response = NextResponse.next();
      response.cookies.delete('auth');
      return response;
    }
  }
  
  return NextResponse.next();
}

// Configure the matcher for the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes (except auth/logout)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/(?!auth/logout)).*)',
  ],
}; 