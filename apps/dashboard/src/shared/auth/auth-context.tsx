import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { clearLegacyStoredTokens, getAccessToken, subscribeToTokenChanges } from './token-store';

export interface AuthContextValue {
  isAuthenticated: boolean;
  isReady: boolean;
  refreshAuthState: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const refreshAuthState = () => {
    setIsAuthenticated(Boolean(getAccessToken()));
  };

  useEffect(() => {
    clearLegacyStoredTokens();
    refreshAuthState();
    setIsReady(true);
    return subscribeToTokenChanges(refreshAuthState);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated, isReady, refreshAuthState }),
    [isAuthenticated, isReady],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
