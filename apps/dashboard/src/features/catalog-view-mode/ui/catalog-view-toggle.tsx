'use client';

import { SlidersHorizontalIcon, SparkleIcon } from '@phosphor-icons/react';
import {
  Button,
  cn,
} from '@repo/ui';


import { useCatalogViewMode } from '../model/use-catalog-view-mode';

import { useTranslations } from '@/i18n/react-i18n';

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
