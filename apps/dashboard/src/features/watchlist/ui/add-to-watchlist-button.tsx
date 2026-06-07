'use client';

import { BookmarkSimpleIcon, CheckIcon } from '@phosphor-icons/react';
import { Button } from '@repo/ui/button';

import { useWatchlist } from '../model/use-watchlist';

import type { Asset } from '@/entities/asset';

import { useTranslations } from '@/i18n/react-i18n';




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
      {inList ? (
        <CheckIcon className="size-4" aria-hidden />
      ) : (
        <BookmarkSimpleIcon className="size-4" aria-hidden />
      )}
      {inList ? t('inWatchlist') : t('addWatchlist')}
    </Button>
  );
}
