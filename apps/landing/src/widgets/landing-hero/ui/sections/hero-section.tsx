'use client';

import { SparkleIcon } from '@phosphor-icons/react';
import { Badge } from '@repo/ui/badge';
import { Button } from '@repo/ui/button';
import { cn } from '@repo/ui/lib/utils';
import { Typography } from '@repo/ui/typography';
import { useTranslations } from 'next-intl';

import { getDashboardUrl } from '@/shared/config/env';

const HERO_PILL_KEYS = ['catalog', 'watchlist', 'diary', 'ai'] as const;

export function HeroSection() {
  const t = useTranslations('landing');

  return (
    <section className="relative flex flex-1 flex-col justify-center overflow-hidden px-4 py-10 md:py-14">
      <div
        className="from-primary/10 to-accent/10 pointer-events-none absolute inset-0 bg-linear-to-br"
        aria-hidden
      />
      <div
        className="bg-accent/10 pointer-events-none absolute -top-24 right-0 size-72 rounded-full blur-3xl"
        aria-hidden
      />
      <div
        className="bg-primary/10 pointer-events-none absolute -bottom-16 left-0 size-64 rounded-full blur-3xl"
        aria-hidden
      />

      <div className="relative container flex flex-col items-center justify-center text-center">
        <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1">
          <SparkleIcon className="text-primary size-3.5" weight="fill" aria-hidden />
          {t('heroBadge')}
        </Badge>

        <Typography variant="display" className="mb-4 text-balance">
          {t('heroTitle')}
        </Typography>
        <Typography variant="lead" className="text-secondary-foreground mb-4 text-balance">
          {t('heroSubtitle')}
        </Typography>
        <Typography variant="muted" className="mb-8 text-balance">
          {t('heroNote')}
        </Typography>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild>
            <a href={getDashboardUrl('/register')}>{t('ctaStart')}</a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href={getDashboardUrl('/login')}>{t('ctaLogin')}</a>
          </Button>
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-2">
          {HERO_PILL_KEYS.map((key) => (
            <li key={key}>
              <span
                className={cn(
                  'inline-flex rounded-full border px-3 py-1 text-xs md:text-sm',
                  key === 'ai'
                    ? 'border-primary/30 bg-primary/10 text-primary'
                    : 'bg-card/80 text-muted-foreground border-border',
                )}
              >
                {t(`heroPills.${key}`)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
