import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function middleware(req) {
  const token = cookies().get('supabase-auth-token');

  if (!token && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
