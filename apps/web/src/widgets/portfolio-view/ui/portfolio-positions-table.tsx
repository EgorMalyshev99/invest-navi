'use client';

import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';

import { usePortfolioColumns } from '../model/portfolio-columns';

import type { PortfolioPositionFieldsFragment } from '@/shared/api/graphql/generated/graphql';

import { DataTable } from '@/shared/ui/data-table';

interface PortfolioPositionsTableProps {
  positions: PortfolioPositionFieldsFragment[];
  onEdit: (position: PortfolioPositionFieldsFragment) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
  emptyMessage?: string;
}

export function PortfolioPositionsTable({
  positions,
  onEdit,
  onDelete,
  isDeleting,
  emptyMessage,
}: PortfolioPositionsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = usePortfolioColumns({ onEdit, onDelete, isDeleting });

  // eslint-disable-next-line react-hooks/incompatible-library -- TanStack Table returns non-memoizable helpers
  const table = useReactTable({
    data: positions,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableMultiSort: false,
    getRowId: (row) => row.id,
  });

  return <DataTable table={table} emptyMessage={emptyMessage} />;
}
