'use client';

import { Button, Typography } from '@repo/ui';
import { useTranslations } from 'next-intl';

import { getDashboardUrl } from '@/config/env';

export function CtaSection() {
  const t = useTranslations('landing');

  return (
    <section className="border-border border-t py-14 text-center md:py-20">
      <div className="container">
        <Typography variant="h2" className="border-0 pb-0 text-2xl md:text-3xl">
          {t('ctaTitle')}
        </Typography>
        <Typography variant="lead" className="text-secondary-foreground mt-3 mb-8 text-balance">
          {t('ctaSubtitle')}
        </Typography>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild>
            <a href={getDashboardUrl('/register')}>{t('ctaStart')}</a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href={getDashboardUrl('/login')}>{t('ctaLogin')}</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
