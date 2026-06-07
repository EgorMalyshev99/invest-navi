'use client';

import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';

import { useAssetCatalogColumns } from '../model/asset-catalog-columns';

import type { Asset } from '@/entities/asset';

import { DataTable } from '@/shared/ui/data-table';

interface AssetCatalogTableProps {
  assets: Asset[];
}

export function AssetCatalogTable({ assets }: AssetCatalogTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = useAssetCatalogColumns();

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table returns non-memoizable helpers
  const table = useReactTable({
    data: assets,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableMultiSort: false,
  });

  return <DataTable table={table} />;
}
