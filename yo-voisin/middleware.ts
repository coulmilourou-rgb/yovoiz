import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ⚠️ SIMPLIFIÉ: Vérification UNIQUEMENT basée sur les cookies
  // Ne pas appeler supabase.auth.getSession() - cause AbortError
  
  // Détecter TOUS les cookies Supabase auth (peu importe le nom exact)
  const allCookies = request.cookies.getAll();
  const hasAuthCookie = allCookies.some(cookie => 
    cookie.name.startsWith('sb-') && cookie.name.includes('auth-token')
  );
  
  console.log('🍪 Cookies détectés:', allCookies.map(c => c.name).join(', '));
  console.log('🔐 Auth cookie présent?', hasAuthCookie);

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
