'use client';

import { ArrowLeftIcon } from '@phosphor-icons/react';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';

import { GLOSSARY_TERM_IDS } from '@/entities/learn';
import { Link } from '@/i18n/navigation';
import { useTranslations } from '@/i18n/react-i18n';

export function GlossaryView() {
  const t = useTranslations('glossary');

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

      <div className="flex flex-col gap-3">
        {GLOSSARY_TERM_IDS.map((termId) => (
          <Card key={termId} id={termId}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{t(`terms.${termId}.title`)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t(`terms.${termId}.body`)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-muted-foreground text-xs">{t('disclaimer')}</p>
    </div>
  );
}
