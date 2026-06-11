import './i18n/setup';
import './styles.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import { routeTree } from './routeTree.gen';
import { AuthProvider, useAuth } from './shared/auth/auth-context';
import { SESSION_EXPIRED_EVENT } from './shared/auth/token-store';
import { ThemeProvider } from './shared/ui/theme-provider';
import { UiProviders } from './shared/ui/ui-providers';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const router = createRouter({
  routeTree,
  defaultPreloadStaleTime: 0,
  context: {
    auth: undefined!,
    queryClient,
  },
  Wrap: ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  ),
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function AppRouter() {
  const auth = useAuth();

  useEffect(() => {
    const onSessionExpired = () => {
      queryClient.clear();
      void router.navigate({ to: '/login' });
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, onSessionExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, onSessionExpired);
  }, []);

  return <RouterProvider router={router} context={{ auth, queryClient }} />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system">
      <UiProviders>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </UiProviders>
    </ThemeProvider>
  </StrictMode>,
);
