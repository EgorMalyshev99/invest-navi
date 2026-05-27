'use client';

import { ArrowLeftIcon } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';

import { RISK_TYPE_IDS } from '@/entities/learn';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

export function RisksView() {
  const t = useTranslations('risksSection');

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <Button variant="ghost" size="sm" className="w-fit px-0" asChild>
        <Link href="/learn" className="gap-2">
          <ArrowLeftIcon className="size-4" aria-hidden />
          {t('backToLearn')}
        </Link>
      </Button>

      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">{t('subtitle')}</p>
      </header>

      <div className="flex flex-col gap-4">
        {RISK_TYPE_IDS.map((riskId) => (
          <Card key={riskId}>
            <CardHeader>
              <CardTitle className="text-base">{t(`types.${riskId}.title`)}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t(`types.${riskId}.description`)}
              </p>
              <div className="bg-muted/40 rounded-lg p-3">
                <p className="text-xs font-medium tracking-wide uppercase">{t('exampleLabel')}</p>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {t(`types.${riskId}.example`)}
                </p>
              </div>
              <Button variant="link" size="sm" className="h-auto px-0" asChild>
                <Link
                  href={`/learn/${t(`learnMoreArticles.${riskId}` as Parameters<typeof t>[0])}`}
                >
                  {t('learnMore')}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-muted-foreground text-xs">{t('disclaimer')}</p>
    </div>
  );
}
