'use client';

import { Button } from '@repo/ui';
import { Suspense } from 'react';

import { LocaleSwitcher } from '@/features/locale-switcher';
import { LocaleSwitcherSkeleton } from '@/features/locale-switcher/ui/locale-switcher-skeleton';
import { ThemeToggle } from '@/features/theme-toggle';
import { Link } from '@/i18n/navigation';
import { useTranslations } from '@/i18n/react-i18n';
import { getLandingUrl } from '@/shared/config/env';
import { BrandLink } from '@/shared/ui/brand-link';

interface PublicShellProps {
  children: React.ReactNode;
  variant?: 'marketing' | 'minimal' | 'auth';
}

const COPYRIGHT_YEAR = new Date().getFullYear();

export function PublicShell({ children, variant = 'marketing' }: PublicShellProps) {
  const t = useTranslations('nav');
  const tFooter = useTranslations('footer');
  const isAuth = variant === 'auth';

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      <header className="border-border bg-card/80 sticky top-0 z-40 border-b backdrop-blur">
        <div className="container flex h-14 items-center justify-between gap-4">
          {isAuth ? (
            <a
              href={getLandingUrl()}
              className="hover:text-foreground focus-visible:ring-ring flex min-w-0 items-center gap-2.5 rounded-md outline-none focus-visible:ring-2"
            >
              <img
                src="/img/logo.png"
                alt=""
                width={36}
                height={36}
                className="size-9 shrink-0 rounded-lg"
                loading="eager"
              />
              <span className="hidden font-semibold md:inline">{t('brand')}</span>
            </a>
          ) : (
            <BrandLink
              href="/"
              label={t('brand')}
              showLabel="desktop"
              className="text-lg"
              priority
            />
          )}
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
            {isAuth ? null : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">{t('login')}</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">{t('register')}</Link>
                </Button>
              </>
            )}
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
