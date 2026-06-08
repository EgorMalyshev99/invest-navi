import { buildGraphqlUrl, stripTrailingSlash } from '@repo/shared/lib/url';

const DEFAULT_APP_URL = 'http://localhost:3001';
const DEFAULT_API_URL = 'http://localhost:3000';
const DEFAULT_DASHBOARD_URL = 'http://localhost:3002';

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
  return buildGraphqlUrl(getApiBaseUrl());
}

export function getDashboardUrl(path = '/'): string {
  const configured = process.env.NEXT_PUBLIC_DASHBOARD_URL?.trim();
  const baseUrl = configured ? stripTrailingSlash(configured) : DEFAULT_DASHBOARD_URL;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}
