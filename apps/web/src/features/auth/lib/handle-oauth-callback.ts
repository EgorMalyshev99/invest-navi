import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { OAUTH_PROVIDER_CONFIG, type OAuthProvider } from '@/features/auth/lib/oauth-providers';
import { getApiBaseUrl, getAppUrl } from '@/shared/config/env';
import { setAuthTokensOnCookies } from '@/shared/lib/auth-cookies-server';

interface AuthTokensResponse {
  accessToken: string;
  refreshToken: string;
}

export async function handleOAuthCallback(
  request: Request,
  provider: OAuthProvider,
): Promise<NextResponse> {
  const config = OAUTH_PROVIDER_CONFIG[provider];
  const requestUrl = new URL(request.url);
  const origin = getAppUrl() || requestUrl.origin;
  const secure = origin.startsWith('https://');

  const oauthError = requestUrl.searchParams.get('error');
  if (oauthError) {
    return NextResponse.redirect(new URL('/login?oauth=denied', origin));
  }

  const code = requestUrl.searchParams.get('code');
  const state = requestUrl.searchParams.get('state');
  const cookieStore = await cookies();
  const savedState = cookieStore.get(config.stateCookie)?.value;

  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.redirect(new URL('/login?oauth=invalid', origin));
  }

  const redirectUri = `${origin}${config.callbackPath}`;
  const apiBaseUrl = getApiBaseUrl();

  let tokens: AuthTokensResponse;
  try {
    const response = await fetch(`${apiBaseUrl}/auth/oauth/${config.apiPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, redirectUri }),
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.redirect(new URL('/login?oauth=failed', origin));
    }

    tokens = (await response.json()) as AuthTokensResponse;
  } catch {
    return NextResponse.redirect(new URL('/login?oauth=failed', origin));
  }

  const from = cookieStore.get(config.fromCookie)?.value;
  const destination = from?.startsWith('/') && !from.startsWith('//') ? from : '/overview';

  const response = NextResponse.redirect(new URL(destination, origin));
  response.cookies.delete(config.stateCookie);
  response.cookies.delete(config.fromCookie);
  setAuthTokensOnCookies(response.cookies, tokens.accessToken, tokens.refreshToken, secure);

  return response;
}
