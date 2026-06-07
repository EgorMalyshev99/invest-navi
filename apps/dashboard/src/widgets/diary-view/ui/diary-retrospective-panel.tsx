'use client';

import { Alert, AlertDescription } from '@repo/ui/alert';
import { Skeleton } from '@repo/ui/skeleton';

import { useDiaryRetrospectiveQuery } from '@/entities/diary-entry';
import { AiInsightBlock } from '@/features/ai-insight';
import { useLocale, useTranslations } from '@/i18n/react-i18n';
import { AiDisclaimer } from '@/shared/ui/ai-disclaimer';


interface DiaryRetrospectivePanelProps {
  entryId: string;
}

export function DiaryRetrospectivePanel({ entryId }: DiaryRetrospectivePanelProps) {
  const t = useTranslations('diary');
  const locale = useLocale();
  const { data, isLoading, isError } = useDiaryRetrospectiveQuery(entryId, locale);

  if (isLoading) {
    return <Skeleton className="h-40 w-full" />;
  }

  if (isError || !data) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{t('retroError')}</AlertDescription>
      </Alert>
    );
  }

  const isAi = data.source === 'AI';

  return (
    <div className="flex flex-col gap-4">
      <div className="text-muted-foreground flex flex-wrap gap-4 text-sm tabular-nums">
        <span>
          {t('retroDays')}: {data.daysElapsed}
        </span>
        {data.priceChangePercent != null ? (
          <span>
            {t('retroPrice')}: {data.priceChangePercent > 0 ? '+' : ''}
            {data.priceChangePercent.toFixed(1)}%
          </span>
        ) : null}
        {data.indexChangePercent != null ? (
          <span>
            {t('retroIndex')}: {data.indexChangePercent > 0 ? '+' : ''}
            {data.indexChangePercent.toFixed(1)}%
          </span>
        ) : null}
        {!data.isReady ? <span className="text-warning">{t('retroPending')}</span> : null}
      </div>

      <AiInsightBlock
        title={t('retroTitle')}
        body={data.summary}
        isAi={isAi}
        aiBadgeLabel={t('aiBadge')}
        templateBadgeLabel={t('templateBadge')}
      />

      {data.questions.length > 0 ? (
        <ul className="text-muted-foreground flex list-disc flex-col gap-1 pl-5 text-sm">
          {data.questions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
      ) : null}

      <AiDisclaimer variant={isAi ? 'generated' : 'template'} />
    </div>
  );
}
