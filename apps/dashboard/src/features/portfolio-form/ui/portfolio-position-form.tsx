'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription } from '@repo/ui/alert';
import { Button } from '@repo/ui/button';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@repo/ui/field';
import { Input } from '@repo/ui/input';
import { Textarea } from '@repo/ui/textarea';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { portfolioPositionFormSchema, type PortfolioPositionFormValues } from '../model/schemas';

import type { PortfolioPositionFieldsFragment } from '@/shared/api/graphql/generated/graphql';

import {
  useCreatePortfolioPositionMutation,
  useUpdatePortfolioPositionMutation,
} from '@/entities/portfolio-position';
import { useTranslations } from '@/i18n/react-i18n';
import { GraphqlRequestError } from '@/shared/api/graphql';

interface PortfolioPositionFormProps {
  editingPosition?: PortfolioPositionFieldsFragment | null;
  onSaved?: () => void;
  onCancelEdit?: () => void;
}

function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function defaultValues(
  position?: PortfolioPositionFieldsFragment | null,
): PortfolioPositionFormValues {
  return {
    assetSymbol: position?.assetSymbol ?? '',
    quantity: position?.quantity ?? 1,
    entryPrice: position?.entryPrice ?? 0,
    entryDate: position?.entryDate ?? todayIsoDate(),
    goal: position?.goal ?? '',
  };
}

export function PortfolioPositionForm({
  editingPosition,
  onSaved,
  onCancelEdit,
}: PortfolioPositionFormProps) {
  const t = useTranslations('portfolio');
  const [error, setError] = useState<string | null>(null);
  const isEditing = Boolean(editingPosition);

  const createPosition = useCreatePortfolioPositionMutation();
  const updatePosition = useUpdatePortfolioPositionMutation();

  const form = useForm<PortfolioPositionFormValues>({
    resolver: zodResolver(portfolioPositionFormSchema),
    defaultValues: defaultValues(editingPosition),
    mode: 'onSubmit',
  });

  useEffect(() => {
    form.reset(defaultValues(editingPosition));
  }, [editingPosition, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    const payload = {
      assetSymbol: values.assetSymbol,
      quantity: values.quantity,
      entryPrice: values.entryPrice,
      entryDate: values.entryDate,
      goal: values.goal?.trim() || undefined,
    };

    try {
      if (isEditing && editingPosition) {
        await updatePosition.mutateAsync({ id: editingPosition.id, input: payload });
      } else {
        await createPosition.mutateAsync(payload);
      }
      form.reset(defaultValues());
      onSaved?.();
    } catch (err) {
      setError(err instanceof GraphqlRequestError ? err.message : t('saveError'));
    }
  });

  const isPending = createPosition.isPending || updatePosition.isPending;

  return (
    <form onSubmit={(event) => void onSubmit(event)} className="flex flex-col gap-4">
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <FieldGroup className="grid gap-4 sm:grid-cols-2">
        <Field data-invalid={!!form.formState.errors.assetSymbol}>
          <FieldLabel htmlFor="portfolio-symbol">{t('fieldSymbol')}</FieldLabel>
          <Input
            id="portfolio-symbol"
            {...form.register('assetSymbol')}
            aria-invalid={!!form.formState.errors.assetSymbol}
            placeholder="SBER"
            disabled={isPending}
          />
          <FieldDescription>{t('fieldSymbolHint')}</FieldDescription>
          <FieldError>{form.formState.errors.assetSymbol?.message}</FieldError>
        </Field>

        <Field data-invalid={!!form.formState.errors.entryDate}>
          <FieldLabel htmlFor="portfolio-entry-date">{t('fieldEntryDate')}</FieldLabel>
          <Input
            id="portfolio-entry-date"
            type="date"
            {...form.register('entryDate')}
            aria-invalid={!!form.formState.errors.entryDate}
            disabled={isPending}
          />
          <FieldError>{form.formState.errors.entryDate?.message}</FieldError>
        </Field>

        <Field data-invalid={!!form.formState.errors.quantity}>
          <FieldLabel htmlFor="portfolio-quantity">{t('fieldQuantity')}</FieldLabel>
          <Input
            id="portfolio-quantity"
            type="number"
            step="any"
            min="0"
            {...form.register('quantity', { valueAsNumber: true })}
            aria-invalid={!!form.formState.errors.quantity}
            disabled={isPending}
          />
          <FieldError>{form.formState.errors.quantity?.message}</FieldError>
        </Field>

        <Field data-invalid={!!form.formState.errors.entryPrice}>
          <FieldLabel htmlFor="portfolio-entry-price">{t('fieldEntryPrice')}</FieldLabel>
          <Input
            id="portfolio-entry-price"
            type="number"
            step="any"
            min="0"
            {...form.register('entryPrice', { valueAsNumber: true })}
            aria-invalid={!!form.formState.errors.entryPrice}
            disabled={isPending}
          />
          <FieldDescription>{t('fieldEntryPriceHint')}</FieldDescription>
          <FieldError>{form.formState.errors.entryPrice?.message}</FieldError>
        </Field>
      </FieldGroup>

      <Field data-invalid={!!form.formState.errors.goal}>
        <FieldLabel htmlFor="portfolio-goal">{t('fieldGoal')}</FieldLabel>
        <Textarea
          id="portfolio-goal"
          rows={3}
          {...form.register('goal')}
          aria-invalid={!!form.formState.errors.goal}
          disabled={isPending}
        />
        <FieldDescription>{t('fieldGoalHint')}</FieldDescription>
        <FieldError>{form.formState.errors.goal?.message}</FieldError>
      </Field>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? t('saving') : isEditing ? t('updatePosition') : t('addPosition')}
        </Button>
        {isEditing ? (
          <Button type="button" variant="secondary" disabled={isPending} onClick={onCancelEdit}>
            {t('cancelEdit')}
          </Button>
        ) : null}
      </div>
    </form>
  );
}
