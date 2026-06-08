'use client';

import { SparkleIcon } from '@phosphor-icons/react';
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
} from '@repo/ui';


interface AiInsightBlockProps {
  title: string;
  body: string;
  isAi: boolean;
  aiBadgeLabel: string;
  templateBadgeLabel: string;
  className?: string;
}

export function AiInsightBlock({
  title,
  body,
  isAi,
  aiBadgeLabel,
  templateBadgeLabel,
  className,
}: AiInsightBlockProps) {
  return (
    <Card
      className={cn(
        'relative overflow-hidden',
        isAi &&
          'border-transparent bg-linear-to-br from-sky-500/25 via-indigo-500/20 to-transparent p-px shadow-sm',
        className,
      )}
    >
      <div
        className={cn(
          'flex h-full flex-col gap-4',
          isAi && 'bg-card rounded-[calc(var(--radius-xl)-1px)] py-4',
        )}
      >
        <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
          <CardTitle className="text-base">{title}</CardTitle>
          <Badge
            variant="secondary"
            className={cn(
              'shrink-0 gap-1 font-normal',
              isAi && 'border-primary/30 bg-primary/10 text-primary',
            )}
          >
            {isAi ? <SparkleIcon className="size-3.5" weight="fill" aria-hidden /> : null}
            {isAi ? aiBadgeLabel : templateBadgeLabel}
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
            {body}
          </p>
        </CardContent>
      </div>
    </Card>
  );
}
