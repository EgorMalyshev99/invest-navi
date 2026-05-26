import { type NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { routing } from './src/i18n/routing';
import { ACCESS_TOKEN_COOKIE } from './src/shared/lib/auth-cookies';

const intlMiddleware = createMiddleware(routing);

const PROTECTED_PREFIXES = ['/market', '/watchlist', '/profile', '/diary'];
const AUTH_PATHS = ['/login', '/register'];

function stripLocalePrefix(pathname: string): string {
  return pathname;
}

export default function proxy(request: NextRequest) {
  const pathname = stripLocalePrefix(request.nextUrl.pathname);
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const isAuthRoute = AUTH_PATHS.some((path) => pathname === path);

  if (isProtected && !accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/market', request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};
