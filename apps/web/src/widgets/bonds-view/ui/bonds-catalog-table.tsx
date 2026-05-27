'use client';

import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';

import { useBondsColumns } from '../model/bonds-columns';

import type { BondFieldsFragment } from '@/entities/bond';

import { DataTable } from '@/shared/ui/data-table';

interface BondsCatalogTableProps {
  bonds: BondFieldsFragment[];
  emptyMessage?: string;
}

export function BondsCatalogTable({ bonds, emptyMessage }: BondsCatalogTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = useBondsColumns();

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table returns non-memoizable helpers
  const table = useReactTable({
    data: bonds,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableMultiSort: false,
    getRowId: (row) => row.symbol,
  });

  return <DataTable table={table} emptyMessage={emptyMessage} />;
}
