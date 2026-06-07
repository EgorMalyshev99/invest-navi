'use client';


import { Button } from '@repo/ui/button';
import { Typography } from '@repo/ui/typography';

import { Link } from '@/i18n/navigation';
import { useTranslations } from '@/i18n/react-i18n';

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
            <Link href="/register">{t('ctaStart')}</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">{t('ctaLogin')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
