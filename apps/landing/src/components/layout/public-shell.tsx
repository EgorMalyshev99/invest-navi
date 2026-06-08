'use client';

import { Button } from '@repo/ui';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

import { LocaleSwitcher } from '@/components/locale-switcher/locale-switcher';
import { LocaleSwitcherSkeleton } from '@/components/locale-switcher/locale-switcher-skeleton';
import { ThemeToggle } from '@/components/theme-toggle/theme-toggle';
import { BrandLink } from '@/components/ui/brand-link';
import { getDashboardUrl } from '@/config/env';

interface PublicShellProps {
  children: React.ReactNode;
  variant?: 'marketing' | 'minimal';
}

const COPYRIGHT_YEAR = new Date().getFullYear();

export function PublicShell({ children, variant = 'marketing' }: PublicShellProps) {
  const t = useTranslations('nav');
  const tFooter = useTranslations('footer');

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <header className="border-border bg-card/80 sticky top-0 z-40 border-b backdrop-blur">
        <div className="container flex h-14 items-center justify-between gap-4">
          <BrandLink href="/" label={t('brand')} showLabel="desktop" className="text-lg" priority />
          {variant === 'marketing' ? (
            <nav className="hidden items-center gap-6 text-sm md:flex">
              <a
                href="#directions"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('directions')}
              </a>
              <a
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('features')}
              </a>
              <a
                href="#how"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('howItWorks')}
              </a>
            </nav>
          ) : null}
          <div className="flex items-center gap-2">
            <Suspense fallback={<LocaleSwitcherSkeleton />}>
              <LocaleSwitcher />
            </Suspense>
            <ThemeToggle />
            <Button size="sm" asChild>
              <a href={getDashboardUrl('/login')}>{t('login')}</a>
            </Button>
            <Button size="sm" asChild>
              <a href={getDashboardUrl('/register')}>{t('register')}</a>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      {variant === 'marketing' ? (
        <footer className="border-border bg-card/50 border-t">
          <div className="container flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
            <p className="text-muted-foreground text-center text-sm sm:text-left">
              {tFooter('copyright', { year: COPYRIGHT_YEAR })}
            </p>
            <Suspense fallback={<LocaleSwitcherSkeleton />}>
              <LocaleSwitcher align="end" />
            </Suspense>
          </div>
        </footer>
      ) : null}
    </div>
  );
}
