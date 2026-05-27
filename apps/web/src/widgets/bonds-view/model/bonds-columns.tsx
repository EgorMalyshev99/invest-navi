'use client';

import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import type { BondFieldsFragment } from '@/entities/bond';
import type { ColumnDef } from '@tanstack/react-table';

import { ChangeBadge } from '@/entities/asset';
import { Link } from '@/i18n/navigation';
import { formatPrice } from '@/shared/lib/format';
import { DataTableColumnHeader } from '@/shared/ui/data-table-column-header';

export function useBondsColumns(): ColumnDef<BondFieldsFragment>[] {
  const t = useTranslations('bonds');

  return useMemo(
    () => [
      {
        id: 'name',
        enableSorting: false,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('columnName')} />,
        cell: ({ row }) => {
          const bond = row.original;
          return (
            <>
              <Link href={`/bonds/${bond.symbol}`} className="hover:text-primary font-medium">
                {bond.name}
              </Link>
              <p className="text-muted-foreground font-mono text-xs tabular-nums">{bond.symbol}</p>
            </>
          );
        },
      },
      {
        id: 'lastPrice',
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
        id: 'couponPercent',
        accessorFn: (row) => row.couponPercent,
        sortUndefined: 'last',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('columnCoupon')} />,
        cell: ({ row }) => {
          const coupon = row.original.couponPercent;
          return (
            <span className="font-mono tabular-nums">
              {coupon !== null && coupon !== undefined ? `${coupon.toFixed(2)}%` : '—'}
            </span>
          );
        },
        meta: { className: 'font-mono tabular-nums' },
      },
      {
        id: 'yieldAtPrice',
        accessorFn: (row) => row.yieldAtPrice,
        sortUndefined: 'last',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('columnYield')} />,
        cell: ({ row }) => {
          const yieldValue = row.original.yieldAtPrice;
          return (
            <span className="font-mono tabular-nums">
              {yieldValue !== null && yieldValue !== undefined ? `${yieldValue.toFixed(2)}%` : '—'}
            </span>
          );
        },
        meta: { className: 'font-mono tabular-nums' },
      },
      {
        id: 'maturityDate',
        accessorKey: 'maturityDate',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('columnMaturity')} />
        ),
        cell: ({ row }) => (
          <span className="font-mono text-sm tabular-nums">{row.original.maturityDate ?? '—'}</span>
        ),
      },
      {
        id: 'changePercent',
        accessorKey: 'changePercent',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('columnChange')} />,
        cell: ({ row }) => <ChangeBadge value={row.original.changePercent} />,
      },
    ],
    [t],
  );
}
