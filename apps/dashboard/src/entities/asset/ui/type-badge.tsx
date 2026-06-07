'use client';

import { cn } from '@repo/ui/lib/utils';

import type { InstrumentType } from '../model/types';

import { useTranslations } from '@/i18n/react-i18n';



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
