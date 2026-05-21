'use client';

import { useLocalStorage } from '@uidotdev/usehooks';

import type { CatalogViewMode } from './types';

const STORAGE_KEY = 'invest-navi:catalog-view-mode';

export function useCatalogViewMode() {
  const [mode, setMode] = useLocalStorage<CatalogViewMode>(
    STORAGE_KEY,
    'simple' as CatalogViewMode,
  );

  return {
    mode: mode ?? 'simple',
    setMode,
    isSimple: (mode ?? 'simple') === 'simple',
    isAdvanced: mode === 'advanced',
  };
}
