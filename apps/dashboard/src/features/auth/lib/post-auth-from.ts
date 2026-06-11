const AUTH_ROUTES = new Set(['/login', '/register']);

export const POST_AUTH_FROM_KEY = 'post_auth_from';

export function sanitizePostAuthPath(from: string | undefined): string | undefined {
  if (!from) {
    return undefined;
  }

  try {
    const path = from.startsWith('http') ? new URL(from).pathname : from;
    if (path.startsWith('/') && !path.startsWith('//') && !AUTH_ROUTES.has(path)) {
      return path;
    }
  } catch {
    return undefined;
  }

  return undefined;
}

export function storePostAuthFrom(from: string | undefined): void {
  if (typeof window === 'undefined') {
    return;
  }

  const path = sanitizePostAuthPath(from);
  if (path) {
    window.sessionStorage.setItem(POST_AUTH_FROM_KEY, path);
  }
}

export function getStoredPostAuthFrom(): string | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return window.sessionStorage.getItem(POST_AUTH_FROM_KEY) ?? undefined;
}

export function clearStoredPostAuthFrom(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(POST_AUTH_FROM_KEY);
}
