'use client';

import { NotebookIcon } from '@phosphor-icons/react';
import { Badge } from '@repo/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { Typography } from '@repo/ui/typography';

import { DiaryCycleFlow } from '../diary-cycle-flow';

import { useTranslations } from '@/i18n/react-i18n';

const DIARY_POINT_KEYS = ['p1', 'p2', 'p3', 'p4'] as const;

export function DiarySection() {
  const t = useTranslations('landing');

  return (
    <section id="diary" className="border-border border-t py-14 md:py-20">
      <div className="container grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <Badge variant="outline" className="mb-4">
            {t('diaryBadge')}
          </Badge>
          <Typography variant="h2" className="border-0 pb-0 text-2xl md:text-3xl">
            {t('diaryTitle')}
          </Typography>
          <DiaryCycleFlow />
          <Typography variant="body" className="text-muted-foreground mt-4 text-sm leading-relaxed">
            {t('diaryBody')}
          </Typography>
        </div>

        <Card className="border-primary/20 from-primary/5 bg-gradient-to-br to-transparent">
          <CardHeader>
            <div className="text-primary flex items-center gap-2">
              <NotebookIcon className="size-6" weight="duotone" aria-hidden />
              <CardTitle className="text-lg">{t('diaryCardTitle')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {DIARY_POINT_KEYS.map((key) => (
                <li key={key} className="flex gap-3 text-sm leading-relaxed">
                  <span
                    className="bg-primary/15 text-primary mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                    aria-hidden
                  >
                    {key.replace('p', '')}
                  </span>
                  <span className="text-secondary-foreground">{t(`diaryPoints.${key}`)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
