import { randomBytes } from 'node:crypto';

import { NextResponse } from 'next/server';

import { OAUTH_PROVIDER_CONFIG, type OAuthProvider } from '@/features/auth/lib/oauth-providers';
import { getAppUrl, getGoogleClientId, getYandexClientId } from '@/shared/config/env';

const YANDEX_AUTHORIZE_URL = 'https://oauth.yandex.ru/authorize';
const YANDEX_SCOPE = 'login:email login:info login:avatar';

const GOOGLE_AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_SCOPE = 'openid email profile';

function getClientId(provider: OAuthProvider): string | undefined {
  if (provider === 'yandex') return getYandexClientId();
  return getGoogleClientId();
}

export function startOAuth(request: Request, provider: OAuthProvider): NextResponse {
  const clientId = getClientId(provider);
  if (!clientId) {
    return NextResponse.json({ error: `${provider} OAuth is not configured` }, { status: 500 });
  }

  const config = OAUTH_PROVIDER_CONFIG[provider];
  const requestUrl = new URL(request.url);
  const origin = getAppUrl() || requestUrl.origin;
  const redirectUri = `${origin}${config.callbackPath}`;
  const state = randomBytes(16).toString('hex');

  const authorizeUrl = new URL(provider === 'yandex' ? YANDEX_AUTHORIZE_URL : GOOGLE_AUTHORIZE_URL);
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set('client_id', clientId);
  authorizeUrl.searchParams.set('redirect_uri', redirectUri);
  authorizeUrl.searchParams.set('state', state);

  if (provider === 'yandex') {
    authorizeUrl.searchParams.set('scope', YANDEX_SCOPE);
  } else {
    authorizeUrl.searchParams.set('scope', GOOGLE_SCOPE);
    authorizeUrl.searchParams.set('access_type', 'online');
    authorizeUrl.searchParams.set('prompt', 'select_account');
  }

  const from = requestUrl.searchParams.get('from');
  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set(config.stateCookie, state, {
    httpOnly: true,
    secure: origin.startsWith('https://'),
    sameSite: 'lax',
    maxAge: 600,
    path: '/',
  });
  if (from?.startsWith('/') && !from.startsWith('//')) {
    response.cookies.set(config.fromCookie, from, {
      httpOnly: true,
      secure: origin.startsWith('https://'),
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    });
  }

  return response;
}
