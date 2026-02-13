import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ⚠️ SIMPLIFIÉ: Vérification UNIQUEMENT basée sur les cookies
  // Ne pas appeler supabase.auth.getSession() - cause AbortError
  const hasAuthCookie = request.cookies.has('sb-hfrmctsvpszqdizritoe-auth-token') ||
                        request.cookies.has('sb-hfrmctsvpszqdizritoe-auth-token.0') ||
                        request.cookies.has('supabase-auth-token');

  // Routes publiques (accessibles sans authentification)
  const publicRoutes = [
    '/',
    '/auth/connexion',
    '/auth/inscription',
    '/auth/mot-de-passe-oublie',
    '/auth/reset-password',
    '/auth/verify-email',
    '/auth/confirm-email',
  ];

  // Routes d'authentification (rediriger si déjà connecté)
  const authRoutes = [
    '/auth/connexion',
    '/auth/inscription',
  ];

  // Routes protégées nécessitant une authentification
  const protectedRoutes = [
    '/home',
    '/dashboard',
    '/profile',
    '/missions',
    '/demandes',
    '/messages',
    '/notifications',
    '/parametres',
  ];

  // Vérifier si la route est publique
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Si l'utilisateur a un cookie auth et essaie d'accéder à une page d'auth
  if (hasAuthCookie && isAuthRoute) {
    console.log('🔄 Cookie détecté - Redirection vers /dashboard/client');
    return NextResponse.redirect(new URL('/dashboard/client', request.url));
  }

  // Si l'utilisateur n'a PAS de cookie et essaie d'accéder à une route protégée
  if (!hasAuthCookie && isProtectedRoute) {
    console.log('🔒 Pas de cookie auth - Redirection vers /auth/connexion');
    const redirectUrl = new URL('/auth/connexion', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Laisser passer toutes les autres requêtes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
