'use client';

import { Sparkle } from '@phosphor-icons/react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
          'border-transparent bg-gradient-to-br from-sky-500/25 via-indigo-500/20 to-transparent p-px shadow-sm',
        className,
      )}
    >
      <div
        className={cn(
          'flex h-full flex-col',
          isAi && 'bg-card rounded-[calc(var(--radius-xl)-1px)]',
        )}
      >
        <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
          <CardTitle className="text-base">{title}</CardTitle>
          <Badge
            variant="secondary"
            className={cn(
              'shrink-0 gap-1 font-normal',
              isAi && 'border-primary/30 bg-primary/10 text-primary',
            )}
          >
            {isAi ? <Sparkle className="size-3.5" weight="fill" aria-hidden /> : null}
            {isAi ? aiBadgeLabel : templateBadgeLabel}
          </Badge>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
            {body}
          </p>
        </CardContent>
      </div>
    </Card>
  );
}
