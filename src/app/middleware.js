import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function middleware(req) {
  const token = cookies().get('supabase-auth-token');

  if (!token && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url)); // Redirige a login si no hay token
  }

  return NextResponse.next(); // Deja pasar si el usuario tiene token
}

export const config = {
  matcher: ['/dashboard/:path*'], // Aplica a todas las rutas dentro de /dashboard
};
