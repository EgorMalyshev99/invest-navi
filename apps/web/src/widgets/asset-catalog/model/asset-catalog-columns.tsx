'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import type { ColumnDef } from '@tanstack/react-table';

import { ChangeBadge, getSectorLabel, type Asset } from '@/entities/asset';
import { Link } from '@/i18n/navigation';
import { formatCompactNumber, formatPercent, formatPrice } from '@/shared/lib/format';
import { DataTableColumnHeader } from '@/shared/ui/data-table-column-header';

export function useAssetCatalogColumns(): ColumnDef<Asset>[] {
  const t = useTranslations('catalog');

  return useMemo(
    () => [
      {
        id: 'name',
        enableSorting: false,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('columnName')} />,
        cell: ({ row }) => {
          const asset = row.original;
          return (
            <>
              <Link href={`/market/${asset.symbol}`} className="hover:text-primary font-medium">
                {asset.name}
              </Link>
              <p className="text-muted-foreground font-mono text-xs tabular-nums">{asset.symbol}</p>
            </>
          );
        },
      },
      {
        accessorKey: 'lastPrice',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('columnPrice')} />,
        cell: ({ row }) => (
          <span className="font-mono tabular-nums">
            {formatPrice(row.original.lastPrice, row.original.currency ?? 'RUB')}
          </span>
        ),
        meta: { className: 'font-mono tabular-nums' },
      },
      {
        accessorKey: 'changePercent',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('columnChange')} />,
        cell: ({ row }) => <ChangeBadge value={row.original.changePercent} />,
      },
      {
        accessorKey: 'valueToday',
        sortUndefined: 'last',
        sortDescFirst: false,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('columnVolume')} />,
        cell: ({ row }) => (
          <span className="font-mono tabular-nums">
            {row.original.valueToday > 0 ? formatCompactNumber(row.original.valueToday) : '—'}
          </span>
        ),
        meta: { className: 'font-mono tabular-nums' },
      },
      {
        id: 'sector',
        accessorFn: (row) => getSectorLabel(row.sector) ?? '',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('columnSector')} />,
        cell: ({ row }) => (
          <span className="text-sm">{getSectorLabel(row.original.sector) ?? '—'}</span>
        ),
      },
      {
        accessorKey: 'dividendYieldPercent',
        sortUndefined: 'last',
        sortDescFirst: false,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('columnDividend')} />
        ),
        cell: ({ row }) => (
          <span className="font-mono tabular-nums">
            {row.original.dividendYieldPercent != null
              ? formatPercent(row.original.dividendYieldPercent, { signed: false })
              : '—'}
          </span>
        ),
        meta: { className: 'font-mono tabular-nums' },
      },
      {
        accessorKey: 'lotSize',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('columnLot')} className="ml-auto" />
        ),
        cell: ({ row }) => (
          <span className="text-right font-mono tabular-nums">{row.original.lotSize}</span>
        ),
        meta: { className: 'text-right font-mono tabular-nums' },
      },
    ],
    [t],
  );
}
