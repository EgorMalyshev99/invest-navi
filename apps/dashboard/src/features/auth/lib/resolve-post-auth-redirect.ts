import {
  clearStoredPostAuthFrom,
  getStoredPostAuthFrom,
  sanitizePostAuthPath,
} from '@/features/auth/lib/post-auth-from';

export function resolvePostAuthRedirect(from: string | undefined, fallback = '/overview'): string {
  const path = sanitizePostAuthPath(from) ?? sanitizePostAuthPath(getStoredPostAuthFrom());
  return path ?? fallback;
}

export function consumePostAuthRedirect(from?: string, fallback = '/overview'): string {
  const target = resolvePostAuthRedirect(from, fallback);
  clearStoredPostAuthFrom();
  return target;
}
