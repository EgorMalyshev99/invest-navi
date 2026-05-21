'use client';

import { TrendDown, TrendUp } from '@phosphor-icons/react';

import { cn } from '@/lib/utils';
import { formatPercent } from '@/shared/lib/format';

interface ChangeBadgeProps {
  value: number;
  className?: string;
}

export function ChangeBadge({ value, className }: ChangeBadgeProps) {
  const isPositive = value > 0;
  const isNegative = value < 0;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-mono text-sm tabular-nums',
        isPositive && 'text-positive',
        isNegative && 'text-negative',
        !isPositive && !isNegative && 'text-muted-foreground',
        className,
      )}
    >
      {isPositive ? <TrendUp className="size-4" aria-hidden /> : null}
      {isNegative ? <TrendDown className="size-4" aria-hidden /> : null}
      {formatPercent(value)}
    </span>
  );
}
