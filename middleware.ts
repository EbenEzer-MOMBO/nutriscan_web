import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes publiques qui ne nécessitent pas d'authentification
const publicRoutes = ['/', '/login'];

// Routes protégées qui nécessitent une authentification
const protectedRoutes = ['/dashboard', '/journal', '/scan', '/trends', '/settings', '/onboarding-profile', '/add'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Vérifier si c'est une route protégée
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Récupérer le token depuis les cookies
  const token = request.cookies.get('auth_token')?.value;

  // Si c'est une route protégée et qu'il n'y a pas de token
  if (isProtectedRoute && !token) {
    // Rediriger vers la page de login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si l'utilisateur est authentifié et essaie d'accéder à / ou /login
  if ((pathname === '/' || pathname === '/login') && token) {
    // Rediriger vers le dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configuration du middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, manifest, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json|js)$).*)',
  ],
};
