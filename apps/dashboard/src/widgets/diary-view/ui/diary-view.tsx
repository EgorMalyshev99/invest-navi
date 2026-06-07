'use client';

import { PlusIcon } from '@phosphor-icons/react';
import { Alert, AlertDescription } from '@repo/ui/alert';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { Skeleton } from '@repo/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/tabs';
import { useMemo, useState } from 'react';

import { DiaryEntryCard } from './diary-entry-card';
import { DiaryRetrospectivePanel } from './diary-retrospective-panel';

import type { DiaryStatusValue } from '@/features/diary-form/lib/graphql-enums';

import { useDiaryEntriesQuery, useUpdateDiaryEntryMutation } from '@/entities/diary-entry';
import { DiaryEntryForm } from '@/features/diary-form';
import {
  fromGraphqlDiaryStatus,
  toGraphqlDiaryStatus,
} from '@/features/diary-form/lib/graphql-enums';
import { GlossaryTerm } from '@/features/glossary-tip';
import { Link, useSearchParams  } from '@/i18n/navigation';
import { useTranslations } from '@/i18n/react-i18n';
import { AiDisclaimer } from '@/shared/ui/ai-disclaimer';


type FilterTab = 'all' | DiaryStatusValue;

const FILTER_TABS: FilterTab[] = ['all', 'active', 'completed', 'cancelled'];

export function DiaryView() {
  const t = useTranslations('diary');
  const searchParams = useSearchParams();
  const initialSymbol = searchParams.get('symbol') ?? undefined;

  const [filter, setFilter] = useState<FilterTab>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(Boolean(initialSymbol));

  const statusFilter = filter === 'all' ? undefined : toGraphqlDiaryStatus(filter);
  const { data: entries, isLoading, isError, refetch } = useDiaryEntriesQuery(statusFilter);
  const updateEntry = useUpdateDiaryEntryMutation();

  const selectedEntry = useMemo(
    () => entries?.find((entry) => entry.id === selectedId) ?? null,
    [entries, selectedId],
  );

  const handleComplete = async (id: string) => {
    await updateEntry.mutateAsync({
      id,
      input: { status: toGraphqlDiaryStatus('completed') },
    });
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{t('subtitle')}</p>
          <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed">
            {t.rich('subtitleGlossary', {
              diversification: () => (
                <GlossaryTerm termId="diversification">{t('diversificationLabel')}</GlossaryTerm>
              ),
              volatility: () => (
                <GlossaryTerm termId="volatility">{t('volatilityLabel')}</GlossaryTerm>
              ),
            })}
          </p>
        </div>
        <Button type="button" className="gap-2" onClick={() => setShowForm((value) => !value)}>
          <PlusIcon className="size-4" aria-hidden />
          {showForm ? t('hideForm') : t('newEntry')}
        </Button>
      </div>

      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>{t('formTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <DiaryEntryForm
              initialSymbol={initialSymbol}
              onCreated={() => {
                setShowForm(false);
                void refetch();
              }}
            />
          </CardContent>
        </Card>
      ) : null}

      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as FilterTab)}
        className="gap-4"
      >
        <TabsList>
          {FILTER_TABS.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {t(`filter.${tab}`)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={filter} className="mt-0">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertDescription>{t('loadError')}</AlertDescription>
            </Alert>
          ) : !entries?.length ? (
            <Card>
              <CardContent className="text-muted-foreground py-10 text-center text-sm">
                <p>{t('empty')}</p>
                <Button type="button" variant="link" asChild className="mt-2">
                  <Link href="/market">{t('goMarket')}</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
              <div className="flex flex-col gap-3">
                {entries.map((entry) => (
                  <DiaryEntryCard
                    key={entry.id}
                    entry={entry}
                    selected={entry.id === selectedId}
                    onSelect={() => setSelectedId(entry.id)}
                  />
                ))}
              </div>

              <Card className="h-fit">
                <CardHeader>
                  <CardTitle>
                    {selectedEntry
                      ? `${selectedEntry.assetSymbol} — ${t('detailTitle')}`
                      : t('selectEntry')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {selectedEntry ? (
                    <>
                      <div className="text-muted-foreground grid gap-2 text-sm">
                        {selectedEntry.rationale ? (
                          <p>
                            <span className="text-foreground font-medium">
                              {t('field.rationale')}:{' '}
                            </span>
                            {selectedEntry.rationale}
                          </p>
                        ) : null}
                        {selectedEntry.risks ? (
                          <p>
                            <span className="text-foreground font-medium">
                              {t('field.risks')}:{' '}
                            </span>
                            {selectedEntry.risks}
                          </p>
                        ) : null}
                        {selectedEntry.successCriteria ? (
                          <p>
                            <span className="text-foreground font-medium">
                              {t('field.successCriteria')}:{' '}
                            </span>
                            {selectedEntry.successCriteria}
                          </p>
                        ) : null}
                        {selectedEntry.failureCriteria ? (
                          <p>
                            <span className="text-foreground font-medium">
                              {t('field.failureCriteria')}:{' '}
                            </span>
                            {selectedEntry.failureCriteria}
                          </p>
                        ) : null}
                      </div>

                      {fromGraphqlDiaryStatus(selectedEntry.status) === 'active' ? (
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={updateEntry.isPending}
                          onClick={() => void handleComplete(selectedEntry.id)}
                        >
                          {t('markCompleted')}
                        </Button>
                      ) : null}

                      <DiaryRetrospectivePanel entryId={selectedEntry.id} />
                    </>
                  ) : (
                    <p className="text-muted-foreground text-sm">{t('selectEntryHint')}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <AiDisclaimer variant="educational" />
    </section>
  );
}
