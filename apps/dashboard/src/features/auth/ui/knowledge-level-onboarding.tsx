'use client';

import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  FieldLegend,
  FieldSet,
  Label,
  RadioGroup,
  RadioGroupItem,
  Typography,
} from '@repo/ui';
import { useState } from 'react';

import { updateProfile } from '@/features/auth/api/auth-api';
import { toGraphqlKnowledgeLevel } from '@/features/auth/lib/graphql-enums';
import { knowledgeLevelSchema, type KnowledgeLevelValue } from '@/features/auth/model/schemas';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from '@/i18n/react-i18n';
import { GraphqlRequestError } from '@/shared/api/graphql';

const LEVELS: KnowledgeLevelValue[] = ['beginner', 'intermediate', 'advanced'];

type KnowledgeLevelOnboardingProps = {
  onComplete?: () => void;
};

export function KnowledgeLevelOnboarding({ onComplete }: KnowledgeLevelOnboardingProps) {
  const t = useTranslations('auth');
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [knowledgeLevel, setKnowledgeLevel] = useState<KnowledgeLevelValue>('beginner');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    const parsed = knowledgeLevelSchema.safeParse(knowledgeLevel);
    if (!parsed.success) {
      setError(t('levelRequired'));
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile({ knowledgeLevel: toGraphqlKnowledgeLevel(parsed.data) });
      if (onComplete) {
        onComplete();
      } else {
        router.replace('/overview');
      }
    } catch (e) {
      setError(e instanceof GraphqlRequestError ? e.message : t('registerError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Typography variant="h3">{t('step2Title')}</Typography>
      <Typography variant="muted">{t('step2Subtitle')}</Typography>
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <FieldSet>
        <FieldLegend>{t('step2Title')}</FieldLegend>
        <RadioGroup
          value={knowledgeLevel}
          onValueChange={(value) => setKnowledgeLevel(value as KnowledgeLevelValue)}
        >
          <div className="grid gap-3">
            {LEVELS.map((level) => (
              <Label key={level} htmlFor={`onboarding-${level}`} className="cursor-pointer">
                <Card
                  className={cn(
                    'transition-colors',
                    knowledgeLevel === level && 'border-primary ring-primary/20 ring-2',
                  )}
                >
                  <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-2">
                    <RadioGroupItem
                      value={level}
                      id={`onboarding-${level}`}
                      className="mt-1"
                      aria-invalid={false}
                    />
                    <div>
                      <CardTitle className="text-base">{t(`levels.${level}.title`)}</CardTitle>
                      <CardDescription>{t(`levels.${level}.description`)}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </Label>
            ))}
          </div>
        </RadioGroup>
      </FieldSet>
      <Button type="button" className="w-full" disabled={isSubmitting} onClick={handleSubmit}>
        {t('finishRegistration')}
      </Button>
    </div>
  );
}
