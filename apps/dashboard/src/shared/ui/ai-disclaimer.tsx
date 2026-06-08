'use client';

import { AiDisclaimerText } from '@repo/ui/components/ai-disclaimer-text';

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

  return <AiDisclaimerText text={t(key)} className={className} />;
}
