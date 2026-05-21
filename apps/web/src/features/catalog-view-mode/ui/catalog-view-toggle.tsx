'use client';

import { SlidersHorizontal, Sparkle } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';

import { useCatalogViewMode } from '../model/use-catalog-view-mode';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';


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
        <Sparkle className="size-4" aria-hidden />
        {t('simple')}
      </Button>
      <Button
        type="button"
        variant={mode === 'advanced' ? 'default' : 'ghost'}
        size="sm"
        className={cn('gap-1.5')}
        onClick={() => setMode('advanced')}
      >
        <SlidersHorizontal className="size-4" aria-hidden />
        {t('advanced')}
      </Button>
    </div>
  );
}
