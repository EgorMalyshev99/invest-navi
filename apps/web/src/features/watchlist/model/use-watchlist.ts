'use client';

import { useLocalStorage } from '@uidotdev/usehooks';
import { useCallback, useMemo } from 'react';

import type { WatchlistStatus, WatchlistStore } from './types';
import type { Asset } from '@/entities/asset';

const STORAGE_KEY = 'invest-navi:watchlist';

export function useWatchlist() {
  const [store, setStore] = useLocalStorage<WatchlistStore>(STORAGE_KEY, {} as WatchlistStore);

  const entries = useMemo(
    () =>
      Object.values(store ?? {}).sort(
        (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime(),
      ),
    [store],
  );

  const add = useCallback(
    (asset: Pick<Asset, 'symbol' | 'name'>, status: WatchlistStatus = 'watching') => {
      setStore((prev) => ({
        ...(prev ?? {}),
        [asset.symbol]: {
          symbol: asset.symbol,
          name: asset.name,
          status,
          addedAt: new Date().toISOString(),
        },
      }));
    },
    [setStore],
  );

  const remove = useCallback(
    (symbol: string) => {
      setStore((prev) => {
        const next = { ...(prev ?? {}) };
        delete next[symbol];
        return next;
      });
    },
    [setStore],
  );

  const setStatus = useCallback(
    (symbol: string, status: WatchlistStatus) => {
      setStore((prev) => {
        const entry = prev?.[symbol];
        if (!entry) {
          return prev ?? {};
        }
        return {
          ...(prev ?? {}),
          [symbol]: { ...entry, status },
        };
      });
    },
    [setStore],
  );

  const has = useCallback((symbol: string) => Boolean(store?.[symbol]), [store]);

  const getStatus = useCallback(
    (symbol: string): WatchlistStatus | undefined => store?.[symbol]?.status,
    [store],
  );

  const analytics = useMemo(() => {
    const byStatus: Record<WatchlistStatus, number> = {
      watching: 0,
      researching: 0,
      idea: 0,
      in_portfolio: 0,
      too_risky: 0,
    };

    for (const entry of entries) {
      byStatus[entry.status] += 1;
    }

    const shareCount = entries.length;
    const researchingOrIdea = byStatus.researching + byStatus.idea;

    let insight: string | null = null;
    if (shareCount >= 5 && byStatus.in_portfolio === 0) {
      insight =
        'В списке много позиций на этапе наблюдения. Имеет смысл зафиксировать критерии, при которых идея перестаёт быть актуальной.';
    } else if (researchingOrIdea >= 3) {
      insight =
        'Несколько активов в статусе «изучаю» или «есть идея». Перед действием на рынке полезно записать гипотезу в дневнике.';
    }

    return { total: shareCount, byStatus, insight };
  }, [entries]);

  return {
    entries,
    add,
    remove,
    setStatus,
    has,
    getStatus,
    analytics,
  };
}
