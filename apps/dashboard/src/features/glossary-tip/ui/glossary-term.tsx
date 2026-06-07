'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@repo/ui/tooltip';

import type { GlossaryTermId } from '@/entities/learn';

import { useTranslations } from '@/i18n/react-i18n';



interface GlossaryTermProps {
  termId: GlossaryTermId;
  children: React.ReactNode;
  className?: string;
}

export function GlossaryTerm({ termId, children, className }: GlossaryTermProps) {
  const t = useTranslations('glossary');

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={
              className ??
              'text-primary decoration-primary/40 cursor-help underline decoration-dotted underline-offset-4'
            }
          >
            {children}
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-sm text-left leading-relaxed">
          <p className="font-medium">{t(`terms.${termId}.title`)}</p>
          <p className="text-background/90 mt-1 font-normal">{t(`terms.${termId}.body`)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
