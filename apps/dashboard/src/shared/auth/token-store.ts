const TOKEN_CHANGE_EVENT = 'invest-navi-auth-token-change';
export const SESSION_EXPIRED_EVENT = 'invest-navi-session-expired';

let accessToken: string | undefined;

export function getAccessToken(): string | undefined {
  return accessToken;
}

export function setAccessToken(token: string) {
  accessToken = token;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(TOKEN_CHANGE_EVENT));
  }
}

export function clearAccessToken(options?: { expired?: boolean }) {
  accessToken = undefined;
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event(TOKEN_CHANGE_EVENT));
  if (options?.expired) {
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  }
}

/** Remove legacy localStorage tokens from pre-hardening builds. */
export function clearLegacyStoredTokens() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem('invest_navi_access_token');
  window.localStorage.removeItem('invest_navi_refresh_token');
}

export function subscribeToTokenChanges(callback: () => void) {
  window.addEventListener(TOKEN_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener(TOKEN_CHANGE_EVENT, callback);
  };
}
