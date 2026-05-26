'use client';

import { useTranslations } from 'next-intl';

import type { InstrumentType } from '../model/types';

import { cn } from '@/lib/utils';

interface TypeBadgeProps {
  type: InstrumentType;
  className?: string;
}

export function TypeBadge({ type, className }: TypeBadgeProps) {
  const t = useTranslations('instrumentType');

  return (
    <span
      className={cn(
        'bg-muted text-muted-foreground inline-flex rounded-md px-2 py-0.5 text-xs font-medium',
        className,
      )}
    >
      {t(type)}
    </span>
  );
}
