const ACCESS_TOKEN_KEY = 'invest_navi_access_token';
const REFRESH_TOKEN_KEY = 'invest_navi_refresh_token';
const TOKEN_CHANGE_EVENT = 'invest-navi-auth-token-change';

function readStorage(key: string): string | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return window.localStorage.getItem(key) ?? undefined;
}

export function getAccessToken(): string | undefined {
  return readStorage(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | undefined {
  return readStorage(REFRESH_TOKEN_KEY);
}

export function setTokens(tokens: { accessToken: string; refreshToken: string }) {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  window.dispatchEvent(new Event(TOKEN_CHANGE_EVENT));
}

export function clearTokens() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.dispatchEvent(new Event(TOKEN_CHANGE_EVENT));
}

export function subscribeToTokenChanges(callback: () => void) {
  window.addEventListener(TOKEN_CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);

  return () => {
    window.removeEventListener(TOKEN_CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}
