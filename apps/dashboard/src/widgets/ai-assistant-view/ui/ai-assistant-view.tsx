'use client';

import { SparkleIcon } from '@phosphor-icons/react';
import { Alert, AlertDescription } from '@repo/ui/alert';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { Textarea } from '@repo/ui/textarea';
import { useState } from 'react';

import { useEducationalAnswerMutation } from '@/entities/educational-answer';
import { AiInsightBlock } from '@/features/ai-insight';
import { useLocale, useTranslations } from '@/i18n/react-i18n';
import { GraphqlRequestError } from '@/shared/api/graphql';
import { AiDisclaimer } from '@/shared/ui/ai-disclaimer';

const EXAMPLE_KEYS = ['rates', 'imoex', 'bondsVsDeposit'] as const;

export function AiAssistantView() {
  const t = useTranslations('aiAssistant');
  const locale = useLocale();
  const [question, setQuestion] = useState('');
  const [error, setError] = useState<string | null>(null);

  const mutation = useEducationalAnswerMutation();

  const handleSubmit = async (text?: string) => {
    const value = (text ?? question).trim();
    if (value.length < 3) {
      setError(t('errorTooShort'));
      return;
    }

    setError(null);
    setQuestion(value);

    try {
      await mutation.mutateAsync({
        question: value,
        locale,
      });
    } catch (err) {
      setError(err instanceof GraphqlRequestError ? err.message : t('errorGeneric'));
    }
  };

  const result = mutation.data;
  const isAi = result?.source === 'AI';

  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">{t('subtitle')}</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('formTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={t('placeholder')}
            rows={4}
            disabled={mutation.isPending}
            aria-label={t('placeholder')}
          />

          <div className="flex flex-wrap gap-2">
            {EXAMPLE_KEYS.map((key) => (
              <Button
                key={key}
                type="button"
                variant="outline"
                size="sm"
                disabled={mutation.isPending}
                onClick={() => void handleSubmit(t(`examples.${key}`))}
              >
                {t(`examples.${key}`)}
              </Button>
            ))}
          </div>

          <Button
            type="button"
            className="gap-2 self-start"
            disabled={mutation.isPending}
            onClick={() => void handleSubmit()}
          >
            <SparkleIcon className="size-4" aria-hidden />
            {mutation.isPending ? t('submitting') : t('submit')}
          </Button>

          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>

      {result ? (
        <div className="flex flex-col gap-4">
          <AiInsightBlock
            title={t('answerTitle')}
            body={result.answer}
            isAi={isAi}
            aiBadgeLabel={t('aiBadge')}
            templateBadgeLabel={t('templateBadge')}
          />
          <AiDisclaimer variant={isAi ? 'generated' : 'template'} />
        </div>
      ) : null}

      <AiDisclaimer variant="educational" />
    </section>
  );
}
