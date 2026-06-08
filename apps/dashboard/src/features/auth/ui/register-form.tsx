'use client';


import { zodResolver } from '@hookform/resolvers/zod';
import * as passwordPolicy from '@repo/api/auth/password-policy';
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Typography,
} from '@repo/ui';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { register, updateProfile } from '@/features/auth/api/auth-api';
import { toGraphqlKnowledgeLevel } from '@/features/auth/lib/graphql-enums';
import { translateFieldError } from '@/features/auth/lib/translate-field-error';
import {
  knowledgeLevelSchema,
  registerStep1Schema,
  type KnowledgeLevelValue,
  type RegisterStep1FormValues,
} from '@/features/auth/model/schemas';
import { OAuthDivider } from '@/features/auth/ui/oauth-divider';
import { OAuthSocialButtons } from '@/features/auth/ui/oauth-social-buttons';
import { PasswordStrengthMeter } from '@/features/auth/ui/password-strength-meter';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from '@/i18n/react-i18n';
import { GraphqlRequestError } from '@/shared/api/graphql';

const LEVELS: KnowledgeLevelValue[] = ['beginner', 'intermediate', 'advanced'];

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

  const password = useWatch({ control: form.control, name: 'password', defaultValue: '' });
  const passwordStrength = passwordPolicy.analyzePassword(password ?? '');
  const canRegister =
    passwordPolicy.isPasswordAcceptableForRegistration(password ?? '') &&
    !form.formState.isSubmitting;

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
      await updateProfile({ knowledgeLevel: toGraphqlKnowledgeLevel(parsed.data) });
      router.replace('/overview');
    } catch (e) {
      setError(e instanceof GraphqlRequestError ? e.message : t('registerError'));
    }
  };

  if (step === 2) {
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
        </FieldSet>
        <Button type="button" className="w-full" onClick={onStep2}>
          {t('finishRegistration')}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onStep1} className="flex flex-col gap-4" autoComplete="on">
      <Typography variant="muted">{t('step1Subtitle')}</Typography>
      <OAuthSocialButtons />
      <OAuthDivider />
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}
      <FieldGroup>
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
      </FieldGroup>
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
