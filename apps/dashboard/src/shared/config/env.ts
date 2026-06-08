import { buildGraphqlUrl, stripTrailingSlash } from '@repo/shared/lib/url';

const DEFAULT_APP_URL = 'http://localhost:3002';
const DEFAULT_API_URL = 'http://localhost:3000';

function getEnvValue(key: string): string | undefined {
  return import.meta.env[key]?.trim();
}

/** Public web app origin (OAuth redirects, canonical app URL). */
export function getAppUrl(): string {
  const configured = getEnvValue('VITE_APP_URL');
  if (configured) return stripTrailingSlash(configured);
  return DEFAULT_APP_URL;
}

/** Nest API origin without `/graphql`. */
export function getApiBaseUrl(): string {
  const configured = getEnvValue('VITE_API_URL');
  if (configured) return stripTrailingSlash(configured);
  return DEFAULT_API_URL;
}

export function getGraphqlUrl(): string {
  return buildGraphqlUrl(getApiBaseUrl());
}

export function getYandexClientId(): string | undefined {
  return getEnvValue('VITE_YANDEX_CLIENT_ID');
}

export function getGoogleClientId(): string | undefined {
  return getEnvValue('VITE_GOOGLE_CLIENT_ID');
}
