'use client';

import { PlusIcon } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { PortfolioAllocationsGrid } from './portfolio-allocation-panel';
import { PortfolioPositionsTable } from './portfolio-positions-table';
import { PortfolioRiskHints } from './portfolio-risk-hints';
import { PortfolioSummaryCards } from './portfolio-summary-cards';

import type { PortfolioPositionFieldsFragment } from '@/shared/api/graphql/generated/graphql';

import {
  useDeletePortfolioPositionMutation,
  usePortfolioPositionsQuery,
  usePortfolioSummaryQuery,
} from '@/entities/portfolio-position';
import { GlossaryTerm } from '@/features/glossary-tip';
import { PortfolioPositionForm } from '@/features/portfolio-form';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

export function PortfolioView() {
  const t = useTranslations('portfolio');
  const [showForm, setShowForm] = useState(false);
  const [editingPosition, setEditingPosition] = useState<PortfolioPositionFieldsFragment | null>(
    null,
  );

  const {
    data: positions,
    isLoading: positionsLoading,
    isError: positionsError,
  } = usePortfolioPositionsQuery();
  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
  } = usePortfolioSummaryQuery();

  const deletePosition = useDeletePortfolioPositionMutation();

  const isLoading = positionsLoading || summaryLoading;
  const isError = positionsError || summaryError;

  const handleEdit = (position: PortfolioPositionFieldsFragment) => {
    setEditingPosition(position);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('deleteConfirm'))) {
      return;
    }
    await deletePosition.mutateAsync(id);
    if (editingPosition?.id === id) {
      setEditingPosition(null);
      setShowForm(false);
    }
  };

  const handleSaved = () => {
    setEditingPosition(null);
    setShowForm(false);
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{t('subtitle')}</p>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
            {t.rich('subtitleGlossary', {
              diversification: () => (
                <GlossaryTerm termId="diversification">{t('diversificationLabel')}</GlossaryTerm>
              ),
            })}
          </p>
        </div>
        <Button
          type="button"
          className="gap-2"
          onClick={() => {
            setEditingPosition(null);
            setShowForm((value) => !value);
          }}
        >
          <PlusIcon className="size-4" aria-hidden />
          {showForm && !editingPosition ? t('hideForm') : t('addPosition')}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : isError ? (
        <Alert variant="destructive">
          <AlertDescription>{t('loadError')}</AlertDescription>
        </Alert>
      ) : summary ? (
        <>
          <PortfolioSummaryCards summary={summary} />
          <PortfolioAllocationsGrid
            byInstrumentType={summary.byInstrumentType}
            bySymbol={summary.bySymbol}
            byCurrency={summary.byCurrency}
          />
          {summary.riskHints.length > 0 ? <PortfolioRiskHints hints={summary.riskHints} /> : null}
        </>
      ) : null}

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingPosition ? t('editFormTitle') : t('formTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <PortfolioPositionForm
              editingPosition={editingPosition}
              onSaved={handleSaved}
              onCancelEdit={() => {
                setEditingPosition(null);
                setShowForm(false);
              }}
            />
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>{t('positionsTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          {positionsLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <PortfolioPositionsTable
              positions={positions ?? []}
              onEdit={handleEdit}
              onDelete={(id) => void handleDelete(id)}
              isDeleting={deletePosition.isPending}
              emptyMessage={t('empty')}
            />
          )}
        </CardContent>
      </Card>

      <p className="text-muted-foreground text-xs">{t('disclaimer')}</p>
    </section>
  );
}
