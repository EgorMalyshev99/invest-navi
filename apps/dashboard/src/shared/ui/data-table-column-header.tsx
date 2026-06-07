'use client';

import { CaretDownIcon, CaretUpIcon, CaretUpDownIcon } from '@phosphor-icons/react';
import { Button } from '@repo/ui/button';
import { cn } from '@repo/ui/lib/utils';

import type { Column } from '@tanstack/react-table';


interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: string;
  className?: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const sorted = column.getIsSorted();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className={cn('data-[state=open]:bg-accent -ml-3 h-8', className)}
      onClick={column.getToggleSortingHandler()}
      aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : 'none'}
    >
      <span>{title}</span>
      {sorted === 'desc' ? (
        <CaretDownIcon className="size-4" aria-hidden />
      ) : sorted === 'asc' ? (
        <CaretUpIcon className="size-4" aria-hidden />
      ) : (
        <CaretUpDownIcon className="text-muted-foreground size-4" aria-hidden />
      )}
    </Button>
  );
}
