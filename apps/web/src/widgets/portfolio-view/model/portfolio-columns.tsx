'use client';

import { PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import type { PortfolioPositionFieldsFragment } from '@/shared/api/graphql/generated/graphql';
import type { ColumnDef } from '@tanstack/react-table';

import { ChangeBadge } from '@/entities/asset';
import { Link } from '@/i18n/navigation';
import { formatPrice } from '@/shared/lib/format';
import { Button } from '@/shared/ui/button';
import { DataTableColumnHeader } from '@/shared/ui/data-table-column-header';

interface UsePortfolioColumnsOptions {
  onEdit: (position: PortfolioPositionFieldsFragment) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function usePortfolioColumns({
  onEdit,
  onDelete,
  isDeleting,
}: UsePortfolioColumnsOptions): ColumnDef<PortfolioPositionFieldsFragment>[] {
  const t = useTranslations('portfolio');

  return useMemo(
    () => [
      {
        id: 'asset',
        enableSorting: false,
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('columnAsset')} />,
        cell: ({ row }) => {
          const position = row.original;
          return (
            <>
              <Link
                href={`/market/${position.assetSymbol}`}
                className="hover:text-primary font-medium"
              >
                {position.assetName ?? position.assetSymbol}
              </Link>
              <p className="text-muted-foreground font-mono text-xs tabular-nums">
                {position.assetSymbol}
              </p>
            </>
          );
        },
      },
      {
        id: 'quantity',
        accessorKey: 'quantity',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('columnQuantity')} />
        ),
        cell: ({ row }) => (
          <span className="font-mono tabular-nums">
            {row.original.quantity.toLocaleString('ru-RU')}
          </span>
        ),
        meta: { className: 'font-mono tabular-nums' },
      },
      {
        id: 'entryPrice',
        accessorKey: 'entryPrice',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('columnEntryPrice')} />
        ),
        cell: ({ row }) => (
          <span className="font-mono tabular-nums">
            {formatPrice(row.original.entryPrice, row.original.currency ?? 'RUB')}
          </span>
        ),
        meta: { className: 'font-mono tabular-nums' },
      },
      {
        id: 'marketValue',
        accessorFn: (row) => row.marketValue ?? row.costBasis,
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t('columnMarketValue')} />
        ),
        cell: ({ row }) => {
          const position = row.original;
          const value = position.marketValue ?? position.costBasis;
          return (
            <span className="font-mono tabular-nums">
              {formatPrice(value, position.currency ?? 'RUB')}
            </span>
          );
        },
        meta: { className: 'font-mono tabular-nums' },
      },
      {
        id: 'unrealizedPlPercent',
        accessorFn: (row) => row.unrealizedPlPercent,
        sortUndefined: 'last',
        header: ({ column }) => <DataTableColumnHeader column={column} title={t('columnPl')} />,
        cell: ({ row }) => {
          const percent = row.original.unrealizedPlPercent;
          if (percent === null || percent === undefined) {
            return <span className="text-muted-foreground">—</span>;
          }
          return <ChangeBadge value={percent} />;
        },
      },
      {
        id: 'actions',
        enableSorting: false,
        header: () => <span className="sr-only">{t('columnActions')}</span>,
        cell: ({ row }) => {
          const position = row.original;
          return (
            <div className="flex justify-end gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={t('editPosition')}
                onClick={() => onEdit(position)}
              >
                <PencilSimpleIcon className="size-4" aria-hidden />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={t('deletePosition')}
                disabled={isDeleting}
                onClick={() => onDelete(position.id)}
              >
                <TrashIcon className="size-4" aria-hidden />
              </Button>
            </div>
          );
        },
      },
    ],
    [isDeleting, onDelete, onEdit, t],
  );
}
