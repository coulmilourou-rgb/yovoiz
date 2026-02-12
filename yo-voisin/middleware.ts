import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // Routes publiques (accessibles sans authentification)
  const publicRoutes = [
    '/',
    '/auth/connexion',
    '/auth/inscription',
    '/auth/mot-de-passe-oublie',
    '/auth/reset-password',
    '/auth/verify-email',
  ];

  // Routes d'authentification (rediriger si déjà connecté)
  const authRoutes = [
    '/auth/connexion',
    '/auth/inscription',
  ];

  // Routes protégées nécessitant une authentification
  const protectedRoutes = [
    '/home',
    '/profile',
    '/demandes',
    '/messages',
    '/notifications',
    '/parametres',
  ];

  // Vérifier si la route est publique
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // Si l'utilisateur est connecté et essaie d'accéder à une page d'auth
  if (session && isAuthRoute) {
    console.log('🔄 Utilisateur connecté redirigé de auth vers /home');
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
  if (!session && isProtectedRoute) {
    console.log('🔒 Accès refusé - Redirection vers /auth/connexion');
    const redirectUrl = new URL('/auth/connexion', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Si l'utilisateur est connecté, vérifier son statut de vérification
  if (session && isProtectedRoute) {
    // Récupérer le profil utilisateur
    const { data: profile } = await supabase
      .from('profiles')
      .select('verification_status')
      .eq('user_id', session.user.id)
      .single();

    // Si le profil n'est pas vérifié, rediriger vers la page de vérification
    if (profile && profile.verification_status !== 'approved') {
      // Exception : autoriser l'accès à la page de vérification du profil
      if (pathname !== '/profile/verification') {
        console.log('⚠️ Profil non vérifié - Redirection vers /profile/verification');
        return NextResponse.redirect(new URL('/profile/verification', request.url));
      }
    }
  }

  return response;
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
