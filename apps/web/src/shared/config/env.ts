const DEFAULT_APP_URL = 'http://localhost:3001';
const DEFAULT_API_URL = 'http://localhost:3000';

function stripTrailingSlash(value: string): string {
  return value.replace(/\/$/, '');
}

/** Public web app origin (OAuth redirects, canonical app URL). */
export function getAppUrl(): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configured) return stripTrailingSlash(configured);
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return DEFAULT_APP_URL;
}

/** Nest API origin without `/graphql`. */
export function getApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (configured) return stripTrailingSlash(configured);
  return DEFAULT_API_URL;
}

export function getGraphqlUrl(): string {
  return `${getApiBaseUrl()}/graphql`;
}

export function getYandexClientId(): string | undefined {
  return process.env.YANDEX_CLIENT_ID ?? process.env.NEXT_PUBLIC_YANDEX_CLIENT_ID;
}

export function getGoogleClientId(): string | undefined {
  return process.env.GOOGLE_CLIENT_ID ?? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
}
