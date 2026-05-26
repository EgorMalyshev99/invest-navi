'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SparkleIcon } from '@phosphor-icons/react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import {
  useCreateDiaryEntryMutation,
  useDiaryHypothesisFeedbackMutation,
} from '@/entities/diary-entry';
import { AiInsightBlock } from '@/features/ai-insight';
import {
  toGraphqlDiaryAction,
  toGraphqlDiaryHorizon,
} from '@/features/diary-form/lib/graphql-enums';
import {
  diaryEntryFormSchema,
  type DiaryEntryFormValues,
} from '@/features/diary-form/model/schemas';
import { GraphqlRequestError } from '@/shared/api/graphql';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Slider } from '@/shared/ui/slider';
import { Textarea } from '@/shared/ui/textarea';

interface DiaryEntryFormProps {
  initialSymbol?: string;
  onCreated?: () => void;
}

const ACTION_KEYS = ['observe', 'buy', 'sell', 'hold'] as const;
const HORIZON_KEYS = ['1m', '3m', '1y', 'long'] as const;

export function DiaryEntryForm({ initialSymbol, onCreated }: DiaryEntryFormProps) {
  const t = useTranslations('diary');
  const locale = useLocale();
  const [error, setError] = useState<string | null>(null);

  const createEntry = useCreateDiaryEntryMutation();
  const feedbackMutation = useDiaryHypothesisFeedbackMutation();

  const form = useForm<DiaryEntryFormValues>({
    resolver: zodResolver(diaryEntryFormSchema),
    defaultValues: {
      assetSymbol: initialSymbol?.toUpperCase() ?? '',
      action: 'observe',
      horizon: '3m',
      rationale: '',
      risks: '',
      successCriteria: '',
      failureCriteria: '',
      confidence: 5,
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (initialSymbol) {
      form.setValue('assetSymbol', initialSymbol.toUpperCase());
    }
  }, [initialSymbol, form]);

  const requestFeedback = async () => {
    setError(null);
    const values = form.getValues();
    try {
      await feedbackMutation.mutateAsync({
        assetSymbol: values.assetSymbol,
        action: toGraphqlDiaryAction(values.action),
        horizon: toGraphqlDiaryHorizon(values.horizon),
        rationale: values.rationale || undefined,
        risks: values.risks || undefined,
        successCriteria: values.successCriteria || undefined,
        failureCriteria: values.failureCriteria || undefined,
        confidence: values.confidence,
        locale,
      });
    } catch (err) {
      setError(err instanceof GraphqlRequestError ? err.message : t('feedbackError'));
    }
  };

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    try {
      await createEntry.mutateAsync({
        assetSymbol: values.assetSymbol,
        action: toGraphqlDiaryAction(values.action),
        horizon: toGraphqlDiaryHorizon(values.horizon),
        rationale: values.rationale || undefined,
        risks: values.risks || undefined,
        successCriteria: values.successCriteria || undefined,
        failureCriteria: values.failureCriteria || undefined,
        confidence: values.confidence,
      });
      form.reset({
        assetSymbol: values.assetSymbol,
        action: 'observe',
        horizon: '3m',
        rationale: '',
        risks: '',
        successCriteria: '',
        failureCriteria: '',
        confidence: 5,
      });
      onCreated?.();
    } catch (err) {
      setError(err instanceof GraphqlRequestError ? err.message : t('saveError'));
    }
  });

  const feedback = feedbackMutation.data;
  const isAiFeedback = feedback?.source === 'AI';

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <FieldGroup>
        <Controller
          name="assetSymbol"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="diary-symbol">{t('fieldSymbol')}</FieldLabel>
              <Input
                id="diary-symbol"
                {...field}
                className="font-mono uppercase"
                aria-invalid={fieldState.invalid}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="action"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>{t('fieldAction')}</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-invalid={fieldState.invalid}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ACTION_KEYS.map((key) => (
                      <SelectItem key={key} value={key}>
                        {t(`action.${key}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>{t('fieldActionHint')}</FieldDescription>
              </Field>
            )}
          />

          <Controller
            name="horizon"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>{t('fieldHorizon')}</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-invalid={fieldState.invalid}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HORIZON_KEYS.map((key) => (
                      <SelectItem key={key} value={key}>
                        {t(`horizon.${key}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>{t('fieldHorizonHint')}</FieldDescription>
              </Field>
            )}
          />
        </div>

        {(['rationale', 'risks', 'successCriteria', 'failureCriteria'] as const).map((name) => (
          <Controller
            key={name}
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`diary-${name}`}>{t(`field.${name}`)}</FieldLabel>
                <Textarea
                  id={`diary-${name}`}
                  {...field}
                  rows={3}
                  aria-invalid={fieldState.invalid}
                />
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
        ))}

        <Controller
          name="confidence"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel>
                {t('fieldConfidence')}: {field.value ?? 5}/10
              </FieldLabel>
              <Slider
                min={1}
                max={10}
                step={1}
                value={[field.value ?? 5]}
                onValueChange={(values) => field.onChange(values[0])}
              />
              <FieldDescription>{t('fieldConfidenceHint')}</FieldDescription>
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={feedbackMutation.isPending}
          onClick={() => void requestFeedback()}
          className="gap-2"
        >
          <SparkleIcon className="size-4" aria-hidden />
          {t('aiReview')}
        </Button>
        <Button type="submit" disabled={createEntry.isPending}>
          {createEntry.isPending ? t('saving') : t('save')}
        </Button>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {feedback ? (
        <div className="flex flex-col gap-4">
          <AiInsightBlock
            title={t('aiSummary')}
            body={feedback.summary}
            isAi={isAiFeedback}
            aiBadgeLabel={t('aiBadge')}
            templateBadgeLabel={t('templateBadge')}
          />
          {feedback.strengths.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('aiStrengths')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground flex list-disc flex-col gap-1 pl-5 text-sm">
                  {feedback.strengths.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}
          {feedback.gaps.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('aiGaps')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground flex list-disc flex-col gap-1 pl-5 text-sm">
                  {feedback.gaps.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}
          {feedback.questions.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t('aiQuestions')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground flex list-disc flex-col gap-1 pl-5 text-sm">
                  {feedback.questions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ) : null}
          <p className="text-muted-foreground text-xs">{t('aiDisclaimer')}</p>
        </div>
      ) : null}
    </form>
  );
}
