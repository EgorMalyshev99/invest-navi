import { NextIntlClientProvider } from 'next-intl';

import { RouteNotFoundContent } from '@/components/ui/route-not-found-content';
import { routing } from '@/i18n/routing';

export default async function RootNotFound() {
  const locale = routing.defaultLocale;
  const messages = (await import('@/messages/ru.json')).default;

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
