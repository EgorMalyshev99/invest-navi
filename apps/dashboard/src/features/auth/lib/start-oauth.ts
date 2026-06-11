import { isOAuthProviderConfigured } from '@/features/auth/lib/oauth-config';
import { OAUTH_PROVIDER_CONFIG, type OAuthProvider } from '@/features/auth/lib/oauth-providers';
import { getAppUrl, getGoogleClientId, getYandexClientId } from '@/shared/config/env';

const YANDEX_AUTHORIZE_URL = 'https://oauth.yandex.ru/authorize';
const YANDEX_SCOPE = 'login:email login:info login:avatar';

const GOOGLE_AUTHORIZE_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_SCOPE = 'openid email profile';

export type OAuthMode = 'login' | 'link';

export const OAUTH_MODE_STORAGE_KEY = 'oauth_mode';

export type OAuthAuthorizeOptions = {
  from?: string;
  mode?: OAuthMode;
};

function createState(): string {
  const values = new Uint8Array(16);
  window.crypto.getRandomValues(values);
  return Array.from(values, (value) => value.toString(16).padStart(2, '0')).join('');
}

export function getOAuthAuthorizeUrl(
  provider: OAuthProvider,
  options: OAuthAuthorizeOptions = {},
): string {
  const { from, mode = 'login' } = options;

  if (!isOAuthProviderConfigured(provider)) {
    throw new Error(`${provider} OAuth is not configured`);
  }

  const config = OAUTH_PROVIDER_CONFIG[provider];
  const origin = getAppUrl();
  const redirectUri = `${origin}${config.callbackPath}`;
  const state = createState();

  const authorizeUrl = new URL(provider === 'yandex' ? YANDEX_AUTHORIZE_URL : GOOGLE_AUTHORIZE_URL);
  authorizeUrl.searchParams.set('response_type', 'code');
  authorizeUrl.searchParams.set(
    'client_id',
    provider === 'yandex' ? getYandexClientId()! : getGoogleClientId()!,
  );
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
  window.sessionStorage.setItem(OAUTH_MODE_STORAGE_KEY, mode);

  return authorizeUrl.toString();
}

export function getOAuthModeFromStorage(): OAuthMode {
  const mode = window.sessionStorage.getItem(OAUTH_MODE_STORAGE_KEY);
  return mode === 'link' ? 'link' : 'login';
}

export function clearOAuthModeFromStorage(): void {
  window.sessionStorage.removeItem(OAUTH_MODE_STORAGE_KEY);
}
