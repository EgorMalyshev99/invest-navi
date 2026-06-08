'use client';

import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
} from '@repo/ui';

import type { DiaryEntryFieldsFragment } from '@/shared/api/graphql/generated/graphql';

import {
  fromGraphqlDiaryAction,
  fromGraphqlDiaryHorizon,
  fromGraphqlDiaryStatus,
} from '@/features/diary-form/lib/graphql-enums';
import { useTranslations } from '@/i18n/react-i18n';

interface DiaryEntryCardProps {
  entry: DiaryEntryFieldsFragment;
  selected?: boolean;
  onSelect?: () => void;
}

export function DiaryEntryCard({ entry, selected, onSelect }: DiaryEntryCardProps) {
  const t = useTranslations('diary');
  const action = fromGraphqlDiaryAction(entry.action);
  const horizon = fromGraphqlDiaryHorizon(entry.horizon);
  const status = fromGraphqlDiaryStatus(entry.status);

  return (
    <Card
      className={cn(
        'cursor-pointer transition-colors',
        selected && 'border-primary ring-primary/30 ring-1',
      )}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect?.();
        }
      }}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
        <div>
          <CardTitle className="font-mono text-lg">{entry.assetSymbol}</CardTitle>
          <p className="text-muted-foreground mt-1 text-sm">
            {t(`action.${action}`)} · {t(`horizon.${horizon}`)}
          </p>
        </div>
        <Badge variant={entry.status === 'ACTIVE' ? 'default' : 'secondary'}>
          {t(`status.${status}`)}
        </Badge>
      </CardHeader>
      <CardContent className="text-muted-foreground flex flex-col gap-2 text-sm">
        {entry.rationale ? (
          <p className="line-clamp-2">{entry.rationale}</p>
        ) : (
          <p className="italic">{t('noRationale')}</p>
        )}
        <div className="flex flex-wrap gap-3 text-xs tabular-nums">
          {entry.confidence != null ? (
            <span>
              {t('confidence')}: {entry.confidence}/10
            </span>
          ) : null}
          {entry.reviewAt ? (
            <span>
              {t('reviewAt')}: {new Date(String(entry.reviewAt)).toLocaleDateString()}
            </span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
