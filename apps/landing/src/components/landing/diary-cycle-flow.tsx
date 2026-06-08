'use client';

import {
  BinocularsIcon,
  CaretDownIcon,
  CaretRightIcon,
  LightbulbIcon,
  SealCheckIcon,
} from '@phosphor-icons/react';
import { Badge, cn } from '@repo/ui';
import { useTranslations } from 'next-intl';
import { Fragment } from 'react';

import type { Icon } from '@phosphor-icons/react';

const accentStyles = {
  primary: 'border-primary/30 bg-primary/10 text-primary [&_svg]:text-primary',
  accent: 'border-accent/30 bg-accent/10 text-accent [&_svg]:text-accent',
} as const;

const CYCLE_STEPS: ReadonlyArray<{
  key: 'hypothesis' | 'observation' | 'conclusion';
  icon: Icon;
  accent: keyof typeof accentStyles;
}> = [
  { key: 'hypothesis', icon: LightbulbIcon, accent: 'primary' },
  { key: 'observation', icon: BinocularsIcon, accent: 'accent' },
  { key: 'conclusion', icon: SealCheckIcon, accent: 'primary' },
];

export function DiaryCycleFlow({ className }: { className?: string }) {
  const t = useTranslations('landing.diaryCycle');

  return (
    <div className={cn('mt-5', className)}>
      <p className="text-secondary-foreground text-base leading-relaxed md:text-lg">{t('intro')}</p>

      <ol
        className="mt-4 flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3"
        aria-label={t('ariaLabel')}
      >
        {CYCLE_STEPS.map(({ key, icon: IconComponent, accent }, index) => {
          const isLast = index === CYCLE_STEPS.length - 1;

          return (
            <Fragment key={key}>
              <li className="flex justify-center sm:justify-start">
                <Badge
                  variant="outline"
                  className={cn(
                    'h-auto gap-2 rounded-xl px-3.5 py-2 text-sm font-medium whitespace-normal',
                    accentStyles[accent],
                  )}
                >
                  <span className="inline-flex size-4 shrink-0" aria-hidden>
                    <IconComponent size={16} weight="duotone" />
                  </span>
                  {t(`steps.${key}`)}
                </Badge>
              </li>
              {!isLast ? (
                <li className="flex items-center justify-center sm:list-none" aria-hidden>
                  <span className="text-muted-foreground inline-flex size-5 sm:hidden">
                    <CaretDownIcon size={20} />
                  </span>
                  <span className="text-muted-foreground hidden size-5 sm:inline-flex">
                    <CaretRightIcon size={20} />
                  </span>
                </li>
              ) : null}
            </Fragment>
          );
        })}
      </ol>
    </div>
  );
}
