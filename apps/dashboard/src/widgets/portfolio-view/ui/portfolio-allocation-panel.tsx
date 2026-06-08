'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui';

import type { PortfolioSummaryFieldsFragment } from '@/shared/api/graphql/generated/graphql';

import { useTranslations } from '@/i18n/react-i18n';
import { formatPrice } from '@/shared/lib/format';

type PortfolioAllocationSlice = PortfolioSummaryFieldsFragment['byInstrumentType'][number];

interface PortfolioAllocationPanelProps {
  title: string;
  slices: PortfolioAllocationSlice[];
}

function AllocationList({ slices }: { slices: PortfolioAllocationSlice[] }) {
  if (!slices.length) {
    return <p className="text-muted-foreground text-sm">—</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {slices.map((slice) => (
        <li key={slice.key} className="flex items-center justify-between gap-3 text-sm">
          <span className="truncate">{slice.label ?? slice.key}</span>
          <span className="text-muted-foreground shrink-0 font-mono tabular-nums">
            {slice.weightPercent.toFixed(1)}% · {formatPrice(slice.value)}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function PortfolioAllocationPanel({ title, slices }: PortfolioAllocationPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <AllocationList slices={slices} />
      </CardContent>
    </Card>
  );
}

interface PortfolioAllocationsGridProps {
  byInstrumentType: PortfolioAllocationSlice[];
  bySymbol: PortfolioAllocationSlice[];
  byCurrency: PortfolioAllocationSlice[];
}

export function PortfolioAllocationsGrid({
  byInstrumentType,
  bySymbol,
  byCurrency,
}: PortfolioAllocationsGridProps) {
  const t = useTranslations('portfolio');

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <PortfolioAllocationPanel title={t('allocationByType')} slices={byInstrumentType} />
      <PortfolioAllocationPanel title={t('allocationBySymbol')} slices={bySymbol} />
      <PortfolioAllocationPanel title={t('allocationByCurrency')} slices={byCurrency} />
    </div>
  );
}
