'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import type { WatchlistRow } from './types';
import type { WatchlistStatus } from '@/features/watchlist/model/types';
import type { ColumnDef, SortingFn } from '@tanstack/react-table';

import { ChangeBadge } from '@/entities/asset';
import { WatchlistStatusSelect } from '@/features/watchlist';
import { Link } from '@/i18n/navigation';
import { formatPrice } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { DataTableColumnHeader } from '@/shared/ui/data-table-column-header';

const statusOrder: WatchlistStatus[] = [
  'watching',
  'researching',
  'idea',
  'in_portfolio',
  'too_risky',
];

const sortStatusFn: SortingFn<WatchlistRow> = (rowA, rowB) => {
  return statusOrder.indexOf(rowA.original.status) - statusOrder.indexOf(rowB.original.status);
};

interface UseWatchlistColumnsOptions {
  onRemove: (symbol: string) => void;
  onStatusChange: (symbol: string, status: WatchlistStatus) => void;
}

export function useWatchlistColumns({
  onRemove,
  onStatusChange,
}: UseWatchlistColumnsOptions): ColumnDef<WatchlistRow>[] {
  const t = useTranslations('watchlist');
  const tCatalog = useTranslations('catalog');

  return useMemo(
    () => [
      {
        id: 'name',
        enableSorting: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tCatalog('columnName')} />
        ),
        cell: ({ row }) => {
          const entry = row.original;
          return (
            <>
              <Link href={`/market/${entry.symbol}`} className="hover:text-primary font-medium">
                {entry.name}
              </Link>
              <p className="text-muted-foreground font-mono text-xs tabular-nums">{entry.symbol}</p>
            </>
          );
        },
      },
      {
        id: 'lastPrice',
        accessorFn: (row) => row.quote?.lastPrice,
        sortUndefined: 'last',
        sortDescFirst: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tCatalog('columnPrice')} />
        ),
        cell: ({ row }) => {
          const quote = row.original.quote;
          if (!quote) {
            return <span className="text-muted-foreground">—</span>;
          }
          return (
            <span className="font-mono tabular-nums">
              {formatPrice(quote.lastPrice, quote.currency ?? 'RUB')}
            </span>
          );
        },
        meta: { className: 'font-mono tabular-nums' },
      },
      {
        id: 'changePercent',
        accessorFn: (row) => row.quote?.changePercent,
        sortUndefined: 'last',
        sortDescFirst: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={tCatalog('columnChange')} />
        ),
        cell: ({ row }) => {
          const quote = row.original.quote;
          return quote ? <ChangeBadge value={quote.changePercent} /> : <span>—</span>;
        },
      },
      {
        accessorKey: 'status',
        sortingFn: sortStatusFn,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('columnStatus')} />,
        cell: ({ row }) => (
          <WatchlistStatusSelect
            value={row.original.status}
            onValueChange={(status) => onStatusChange(row.original.symbol, status)}
          />
        ),
      },
      {
        id: 'actions',
        enableSorting: false,
        header: () => null,
        cell: ({ row }) => (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(row.original.symbol)}
          >
            {t('remove')}
          </Button>
        ),
        meta: { className: 'text-right' },
      },
    ],
    [onRemove, onStatusChange, t, tCatalog],
  );
}
