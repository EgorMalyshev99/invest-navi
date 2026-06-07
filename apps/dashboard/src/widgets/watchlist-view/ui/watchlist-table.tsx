'use client';

import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';

import { useWatchlistColumns } from '../model/watchlist-columns';

import type { WatchlistRow } from '../model/types';
import type { WatchlistStatus } from '@/features/watchlist/model/types';

import { DataTable } from '@/shared/ui/data-table';

interface WatchlistTableProps {
  rows: WatchlistRow[];
  onRemove: (symbol: string) => void;
  onStatusChange: (symbol: string, status: WatchlistStatus) => void;
}

export function WatchlistTable({ rows, onRemove, onStatusChange }: WatchlistTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = useWatchlistColumns({ onRemove, onStatusChange });

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table returns non-memoizable helpers
  const table = useReactTable({
    data: rows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableMultiSort: false,
    getRowId: (row) => row.symbol,
  });

  return <DataTable table={table} />;
}
