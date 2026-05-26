'use client';

import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

import { LocaleSwitcher } from '@/features/locale-switcher';
import { LocaleSwitcherSkeleton } from '@/features/locale-switcher/ui/locale-switcher-skeleton';
import { ThemeToggle } from '@/features/theme-toggle';
import { Separator } from '@/shared/ui/separator';

export function DashboardContentFooter() {
  const t = useTranslations('layout');

  return (
    <footer
      className="border-border/70 mt-10 flex justify-end border-t pt-6 md:mt-12 md:pt-8"
      aria-label={t('preferencesAria')}
    >
      <div
        className="border-border/80 bg-card/60 flex items-center gap-1 rounded-xl border p-1 shadow-sm"
        role="group"
        aria-label={t('preferencesControls')}
      >
        <Suspense fallback={<LocaleSwitcherSkeleton className="h-9 px-2.5" />}>
          <LocaleSwitcher align="start" className="h-9 px-2.5" />
        </Suspense>
        <Separator orientation="vertical" className="bg-border/80 mx-0.5 h-7" />
        <ThemeToggle />
      </div>
    </footer>
  );
}
