'use client';

import { SparkleIcon } from '@phosphor-icons/react';
import { Card, CardContent, CardHeader, CardTitle, Skeleton } from '@repo/ui';

import { useWeeklyReviewQuery } from '@/entities/weekly-review';
import { useTranslations } from '@/i18n/react-i18n';
import { AiDisclaimer } from '@/shared/ui/ai-disclaimer';

interface WeeklyReviewCardProps {
  locale: string;
}

export function WeeklyReviewCard({ locale }: WeeklyReviewCardProps) {
  const t = useTranslations('overview.weeklyReview');
  const { data, isLoading, isError } = useWeeklyReviewQuery(locale);

  if (isLoading) {
    return <Skeleton className="h-56 w-full" />;
  }

  if (isError || !data) {
    return null;
  }

  const disclaimerVariant = data.source === 'AI' ? 'generated' : 'template';

  return (
    <Card className="border-primary/20 from-primary/5 to-accent/5 bg-gradient-to-br">
      <CardHeader className="gap-2">
        <div className="text-primary flex items-center gap-2">
          <SparkleIcon className="size-5" aria-hidden />
          <CardTitle className="text-lg">{t('title')}</CardTitle>
        </div>
        <p className="text-muted-foreground text-sm">{t('subtitle')}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed">{data.summary}</p>
        <div>
          <p className="mb-2 text-sm font-medium">{t('sectors')}</p>
          <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
            {data.sectors.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <p className="text-sm">
          <span className="font-medium">{t('bondsAndRub')}: </span>
          <span className="text-muted-foreground">{data.bondsAndRub}</span>
        </p>
        {data.risksForNextWeek.length > 0 ? (
          <div>
            <p className="mb-2 text-sm font-medium">{t('risks')}</p>
            <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
              {data.risksForNextWeek.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <AiDisclaimer variant={disclaimerVariant} />
      </CardContent>
    </Card>
  );
}
