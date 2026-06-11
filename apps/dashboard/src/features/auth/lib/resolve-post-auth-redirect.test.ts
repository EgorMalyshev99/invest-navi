import { afterEach, describe, expect, it } from 'vitest';

import { parseAuthNavigateTarget } from '@/features/auth/lib/parse-auth-navigate-target';
import {
  POST_AUTH_FROM_KEY,
  clearStoredPostAuthFrom,
  getStoredPostAuthFrom,
  sanitizePostAuthPath,
  storePostAuthFrom,
} from '@/features/auth/lib/post-auth-from';
import {
  consumePostAuthRedirect,
  resolvePostAuthRedirect,
} from '@/features/auth/lib/resolve-post-auth-redirect';

describe('sanitizePostAuthPath', () => {
  it('accepts valid in-app paths', () => {
    expect(sanitizePostAuthPath('/market')).toBe('/market');
    expect(sanitizePostAuthPath('/diary')).toBe('/diary');
  });

  it('rejects auth routes and protocol-relative paths', () => {
    expect(sanitizePostAuthPath('/login')).toBeUndefined();
    expect(sanitizePostAuthPath('/register')).toBeUndefined();
    expect(sanitizePostAuthPath('//evil.com')).toBeUndefined();
  });

  it('extracts pathname from absolute URLs', () => {
    expect(sanitizePostAuthPath('https://app.example.com/market')).toBe('/market');
  });
});

describe('resolvePostAuthRedirect', () => {
  afterEach(() => {
    clearStoredPostAuthFrom();
  });

  it('returns fallback when from is missing', () => {
    expect(resolvePostAuthRedirect(undefined)).toBe('/overview');
    expect(resolvePostAuthRedirect(undefined, '/market')).toBe('/market');
  });

  it('falls back to sessionStorage', () => {
    storePostAuthFrom('/watchlist');
    expect(resolvePostAuthRedirect(undefined)).toBe('/watchlist');
  });

  it('prefers explicit from over sessionStorage', () => {
    storePostAuthFrom('/watchlist');
    expect(resolvePostAuthRedirect('/diary')).toBe('/diary');
  });
});

describe('consumePostAuthRedirect', () => {
  afterEach(() => {
    clearStoredPostAuthFrom();
  });

  it('clears stored from after resolving', () => {
    storePostAuthFrom('/portfolio');
    expect(consumePostAuthRedirect()).toBe('/portfolio');
    expect(getStoredPostAuthFrom()).toBeUndefined();
    expect(sessionStorage.getItem(POST_AUTH_FROM_KEY)).toBeNull();
  });
});

describe('parseAuthNavigateTarget', () => {
  it('parses pathname only', () => {
    expect(parseAuthNavigateTarget('/market')).toEqual({ to: '/market' });
  });

  it('parses pathname and search params', () => {
    expect(parseAuthNavigateTarget('/login?oauth=denied')).toEqual({
      to: '/login',
      search: { oauth: 'denied' },
    });
  });

  it('parses profile feedback params', () => {
    expect(parseAuthNavigateTarget('/profile?linked=yandex')).toEqual({
      to: '/profile',
      search: { linked: 'yandex' },
    });
  });
});
