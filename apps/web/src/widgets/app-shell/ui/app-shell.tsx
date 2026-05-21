'use client';

import { ChartLineUp, ListHeart } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';

import { LocaleSwitcher } from '@/features/locale-switcher';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();

  const links = [
    { href: '/market' as const, label: t('market'), icon: ChartLineUp },
    { href: '/watchlist' as const, label: t('watchlist'), icon: ListHeart },
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <header className="border-border bg-card/80 sticky top-0 z-40 border-b backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
          <Link href="/market" className="text-lg font-semibold tracking-tight">
            {t('brand')}
          </Link>
          <div className="flex items-center gap-2">
            <nav className="flex items-center gap-1">
              {links.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                    {label}
                  </Link>
                );
              })}
            </nav>
            <LocaleSwitcher />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
