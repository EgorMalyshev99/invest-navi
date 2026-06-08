import { cn } from '@repo/ui';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';

import type { Metadata, Viewport } from 'next';

import { ThemeProvider } from '@/components/ui/theme-provider';
import { UiProviders } from '@/components/ui/ui-providers';
import { routing } from '@/i18n/routing';

const inter = localFont({
  src: [
    {
      path: '../fonts/Inter.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/Inter-Italic.ttf',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'ИнвестНавигатор',
    template: '%s | ИнвестНавигатор',
  },
  description:
    'AI-платформа для частных инвесторов на российском рынке — понимание активов, рисков и осознанных решений',
  icons: {
    icon: [
      { url: '/favicons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/favicons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#080B12' },
  ],
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning className={cn(inter.className)}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <UiProviders>{children}</UiProviders>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
