'use client';

import { BookmarkSimple, Check } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';

import { useWatchlist } from '../model/use-watchlist';

import type { Asset } from '@/entities/asset';

import { Button } from '@/components/ui/button';


interface AddToWatchlistButtonProps {
  asset: Pick<Asset, 'symbol' | 'name'>;
  variant?: 'default' | 'outline' | 'ghost';
}

export function AddToWatchlistButton({ asset, variant = 'outline' }: AddToWatchlistButtonProps) {
  const t = useTranslations('asset');
  const { has, add, remove } = useWatchlist();
  const inList = has(asset.symbol);

  return (
    <Button
      type="button"
      variant={variant}
      onClick={() => (inList ? remove(asset.symbol) : add(asset))}
      className="gap-2"
    >
      {inList ? <Check className="size-4" aria-hidden /> : <BookmarkSimple className="size-4" aria-hidden />}
      {inList ? t('inWatchlist') : t('addWatchlist')}
    </Button>
  );
}
