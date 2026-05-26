import { NextIntlClientProvider } from 'next-intl';

import { routing } from '@/i18n/routing';
import { RouteNotFoundContent } from '@/shared/ui/route-not-found-content';

import './globals.css';

export default async function RootNotFound() {
  const locale = routing.defaultLocale;
  const messages = (await import(`../messages/${locale}.json`)).default;

  return (
    <html lang={locale}>
      <body className="bg-background text-foreground font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <RouteNotFoundContent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
