'use client';

import { SlidersHorizontalIcon, SparkleIcon } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';

import { useCatalogViewMode } from '../model/use-catalog-view-mode';

import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';

export function CatalogViewToggle() {
  const t = useTranslations('catalog');
  const { mode, setMode } = useCatalogViewMode();

  return (
    <div className="bg-muted inline-flex rounded-lg p-1">
      <Button
        type="button"
        variant={mode === 'simple' ? 'default' : 'ghost'}
        size="sm"
        className={cn('gap-1.5')}
        onClick={() => setMode('simple')}
      >
        <SparkleIcon className="size-4" aria-hidden />
        {t('simple')}
      </Button>
      <Button
        type="button"
        variant={mode === 'advanced' ? 'default' : 'ghost'}
        size="sm"
        className={cn('gap-1.5')}
        onClick={() => setMode('advanced')}
      >
        <SlidersHorizontalIcon className="size-4" aria-hidden />
        {t('advanced')}
      </Button>
    </div>
  );
}
