'use client';

import type { CatalogViewMode } from './types';

import { usePersistedState } from '@/shared/lib/use-persisted-state';

const STORAGE_KEY = 'invest-navi:catalog-view-mode';
const DEFAULT_MODE = 'simple' satisfies CatalogViewMode;

export function useCatalogViewMode() {
  const [mode, setMode] = usePersistedState<CatalogViewMode>(STORAGE_KEY, DEFAULT_MODE);

  return {
    mode: mode ?? 'simple',
    setMode,
    isSimple: (mode ?? 'simple') === 'simple',
    isAdvanced: mode === 'advanced',
  };
}
