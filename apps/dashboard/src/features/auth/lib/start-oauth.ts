import { OAUTH_PROVIDER_CONFIG, type OAuthProvider } from '@/features/auth/lib/oauth-providers';
import { getAppUrl, getGoogleClientId, getYandexClientId } from '@/shared/config/env';

const YANDEX_AUTHORIZE_URL = 'https://oauth.yandex.ru/authorize';
const YANDEX_SCOPE = 'login:email login:info login:avatar';

const GOOGLE_AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_SCOPE = 'openid email profile';

export function getClientId(provider: OAuthProvider): string | undefined {
  if (provider === 'yandex') return getYandexClientId();
  return getGoogleClientId();
}

function createState(): string {
  const values = new Uint8Array(16);
  window.crypto.getRandomValues(values);
  return Array.from(values, (value) => value.toString(16).padStart(2, '0')).join('');
}

export function getOAuthAuthorizeUrl(provider: OAuthProvider, from?: string): string {
  const clientId = getClientId(provider);
  if (!clientId) {
    throw new Error(`${provider} OAuth is not configured`);
  }

  const config = OAUTH_PROVIDER_CONFIG[provider];
  const origin = getAppUrl();
  const redirectUri = `${origin}${config.callbackPath}`;
  const state = createState();

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

  if (from?.startsWith('/') && !from.startsWith('//')) {
    window.sessionStorage.setItem(config.fromCookie, from);
  }
  window.sessionStorage.setItem(config.stateCookie, state);

  return authorizeUrl.toString();
}
