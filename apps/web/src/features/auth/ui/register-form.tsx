'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { analyzePassword, isPasswordAcceptableForRegistration } from '@repo/api';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import type { KnowledgeLevel } from '@/shared/api/graphql/generated/graphql';

import { register, updateProfile } from '@/features/auth/api/auth-api';
import { translateFieldError } from '@/features/auth/lib/translate-field-error';
import {
  knowledgeLevelSchema,
  registerStep1Schema,
  type KnowledgeLevelValue,
  type RegisterStep1FormValues,
} from '@/features/auth/model/schemas';
import { PasswordStrengthMeter } from '@/features/auth/ui/password-strength-meter';
import { useRouter } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { GraphqlRequestError } from '@/shared/api/graphql';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Field, FieldError, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';
import { Typography } from '@/shared/ui/typography';

const LEVELS: KnowledgeLevelValue[] = ['beginner', 'intermediate', 'advanced'];

const levelToEnum: Record<KnowledgeLevelValue, KnowledgeLevel> = {
  beginner: 'beginner',
  intermediate: 'intermediate',
  advanced: 'advanced',
};

export function RegisterForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string | null>(null);
  const [knowledgeLevel, setKnowledgeLevel] = useState<KnowledgeLevelValue>('beginner');

  const form = useForm<RegisterStep1FormValues>({
    resolver: zodResolver(registerStep1Schema),
    defaultValues: { email: '', password: '', passwordConfirm: '', name: '' },
    mode: 'onSubmit',
  });

  const password = form.watch('password');
  const passwordStrength = analyzePassword(password ?? '');
  const canRegister =
    isPasswordAcceptableForRegistration(password ?? '') && !form.formState.isSubmitting;

  const onStep1 = form.handleSubmit(async (values) => {
    setError(null);
    try {
      await register({
        email: values.email,
        password: values.password,
        name: values.name || undefined,
      });
      setStep(2);
    } catch (e) {
      setError(e instanceof GraphqlRequestError ? e.message : t('registerError'));
    }
  });

  const onStep2 = async () => {
    setError(null);
    const parsed = knowledgeLevelSchema.safeParse(knowledgeLevel);
    if (!parsed.success) {
      setError(t('levelRequired'));
      return;
    }
    try {
      await updateProfile({ knowledgeLevel: levelToEnum[parsed.data] });
      router.replace('/market');
      router.refresh();
    } catch (e) {
      setError(e instanceof GraphqlRequestError ? e.message : t('registerError'));
    }
  };

  if (step === 2) {
    return (
      <div className="space-y-6">
        <Typography variant="h3">{t('step2Title')}</Typography>
        <Typography variant="muted">{t('step2Subtitle')}</Typography>
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        <RadioGroup
          value={knowledgeLevel}
          onValueChange={(v) => setKnowledgeLevel(v as KnowledgeLevelValue)}
        >
          <div className="grid gap-3">
            {LEVELS.map((level) => (
              <Label key={level} htmlFor={level} className="cursor-pointer">
                <Card
                  className={cn(
                    'transition-colors',
                    knowledgeLevel === level && 'border-primary ring-primary/20 ring-2',
                  )}
                >
                  <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-2">
                    <RadioGroupItem
                      value={level}
                      id={level}
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
        <Button type="button" className="w-full" onClick={onStep2}>
          {t('finishRegistration')}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onStep1} className="space-y-4" autoComplete="on">
      <Typography variant="muted">{t('step1Subtitle')}</Typography>
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <Field data-invalid={!!form.formState.errors.email}>
        <FieldLabel htmlFor="reg-email">{t('email')}</FieldLabel>
        <Input
          id="reg-email"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          aria-invalid={!!form.formState.errors.email}
          {...form.register('email')}
        />
        <FieldError>{translateFieldError(form.formState.errors.email, t)}</FieldError>
      </Field>
      <Field data-invalid={!!form.formState.errors.password}>
        <FieldLabel htmlFor="reg-password">{t('password')}</FieldLabel>
        <Input
          id="reg-password"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!form.formState.errors.password}
          {...form.register('password')}
        />
        <PasswordStrengthMeter password={password ?? ''} className="pt-1" />
        <FieldError>{translateFieldError(form.formState.errors.password, t)}</FieldError>
      </Field>
      <Field data-invalid={!!form.formState.errors.passwordConfirm}>
        <FieldLabel htmlFor="reg-password-confirm">{t('passwordConfirm')}</FieldLabel>
        <Input
          id="reg-password-confirm"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!form.formState.errors.passwordConfirm}
          {...form.register('passwordConfirm')}
        />
        <FieldError>{translateFieldError(form.formState.errors.passwordConfirm, t)}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor="reg-name">{t('nameOptional')}</FieldLabel>
        <Input id="reg-name" type="text" autoComplete="name" {...form.register('name')} />
      </Field>
      <Button type="submit" className="w-full" disabled={!canRegister}>
        {t('continue')}
      </Button>
      {passwordStrength.level === 'weak' && password.length > 0 ? (
        <Typography variant="small" className="text-muted-foreground text-center">
          {t('passwordTooWeakHint')}
        </Typography>
      ) : null}
    </form>
  );
}
