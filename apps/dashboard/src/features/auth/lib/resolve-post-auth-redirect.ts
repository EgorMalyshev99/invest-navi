const AUTH_ROUTES = new Set(['/login', '/register']);

export function resolvePostAuthRedirect(from: string | undefined, fallback = '/overview'): string {
  if (!from) {
    return fallback;
  }

  try {
    const path = from.startsWith('http') ? new URL(from).pathname : from;
    if (path.startsWith('/') && !path.startsWith('//') && !AUTH_ROUTES.has(path)) {
      return path;
    }
  } catch {
    return fallback;
  }

  return fallback;
}
