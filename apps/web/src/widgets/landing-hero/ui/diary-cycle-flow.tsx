'use client';

import {
  BinocularsIcon,
  CaretDownIcon,
  CaretRightIcon,
  LightbulbIcon,
  SealCheckIcon,
} from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import { Fragment } from 'react';

import { cn } from '@/lib/utils';
import { Badge } from '@/shared/ui/badge';

const CYCLE_STEPS = [
  { key: 'hypothesis', icon: LightbulbIcon, accent: 'primary' },
  { key: 'observation', icon: BinocularsIcon, accent: 'accent' },
  { key: 'conclusion', icon: SealCheckIcon, accent: 'primary' },
] as const;

const accentStyles = {
  primary: 'border-primary/30 bg-primary/10 text-primary [&_svg]:text-primary',
  accent: 'border-accent/30 bg-accent/10 text-accent [&_svg]:text-accent',
} as const;

export function DiaryCycleFlow({ className }: { className?: string }) {
  const t = useTranslations('landing.diaryCycle');

  return (
    <div className={cn('mt-5', className)}>
      <p className="text-secondary-foreground text-base leading-relaxed md:text-lg">{t('intro')}</p>

      <ol
        className="mt-4 flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3"
        aria-label={t('ariaLabel')}
      >
        {CYCLE_STEPS.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === CYCLE_STEPS.length - 1;

          return (
            <Fragment key={step.key}>
              <li className="flex justify-center sm:justify-start">
                <Badge
                  variant="outline"
                  className={cn(
                    'h-auto gap-2 rounded-xl px-3.5 py-2 text-sm font-medium whitespace-normal',
                    accentStyles[step.accent],
                  )}
                >
                  <Icon className="size-4 shrink-0" weight="duotone" aria-hidden />
                  {t(`steps.${step.key}`)}
                </Badge>
              </li>
              {!isLast ? (
                <li className="flex items-center justify-center sm:list-none" aria-hidden>
                  <CaretDownIcon className="text-muted-foreground size-5 sm:hidden" />
                  <CaretRightIcon className="text-muted-foreground hidden size-5 sm:block" />
                </li>
              ) : null}
            </Fragment>
          );
        })}
      </ol>
    </div>
  );
}
