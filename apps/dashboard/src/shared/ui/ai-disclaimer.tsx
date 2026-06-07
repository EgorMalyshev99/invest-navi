'use client';

import { cn } from '@repo/ui/lib/utils';

import { useTranslations } from '@/i18n/react-i18n';


export type AiDisclaimerVariant = 'educational' | 'template' | 'generated';

interface AiDisclaimerProps {
  variant: AiDisclaimerVariant;
  className?: string;
}

export function AiDisclaimer({ variant, className }: AiDisclaimerProps) {
  const t = useTranslations('compliance');

  const key =
    variant === 'generated'
      ? 'aiGenerated'
      : variant === 'template'
        ? 'aiTemplate'
        : 'educationalOnly';

  return <p className={cn('text-muted-foreground text-xs', className)}>{t(key)}</p>;
}
