'use client';

import {
  cn,
} from '@repo/ui';

import { useTranslations } from '@/i18n/react-i18n';

export type RiskLevel = 'low' | 'medium' | 'high';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

const levelStyles: Record<RiskLevel, string> = {
  low: 'bg-positive/15 text-positive',
  medium: 'bg-warning/15 text-warning',
  high: 'bg-risk-high/15 text-risk-high',
};

export function RiskBadge({ level, className }: RiskBadgeProps) {
  const t = useTranslations('risk');

  return (
    <span
      className={cn(
        'inline-flex rounded-md px-2 py-0.5 text-xs font-medium',
        levelStyles[level],
        className,
      )}
    >
      {t(level)}
    </span>
  );
}
