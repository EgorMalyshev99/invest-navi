'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import * as passwordPolicy from '@repo/api/auth/password-policy';
import {
  Alert,
  AlertDescription,
  Button,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
  Typography,
} from '@repo/ui';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { register } from '@/features/auth/api/auth-api';
import { storePostAuthFrom } from '@/features/auth/lib/post-auth-from';
import { resolvePostAuthRedirect } from '@/features/auth/lib/resolve-post-auth-redirect';
import { translateFieldError } from '@/features/auth/lib/translate-field-error';
import { registerStep1Schema, type RegisterStep1FormValues } from '@/features/auth/model/schemas';
import { KnowledgeLevelOnboarding } from '@/features/auth/ui/knowledge-level-onboarding';
import { OAuthSocialButtons } from '@/features/auth/ui/oauth-social-buttons';
import { PasswordStrengthMeter } from '@/features/auth/ui/password-strength-meter';
import { useSearchParams } from '@/i18n/navigation';
import { useTranslations } from '@/i18n/react-i18n';
import { GraphqlRequestError } from '@/shared/api/graphql';

export function RegisterForm() {
  const t = useTranslations('auth');
  const searchParams = useSearchParams();
  const rawFrom = searchParams.get('from');
  const oauthFrom = resolvePostAuthRedirect(rawFrom ?? undefined);
  const [step, setStep] = useState<1 | 2>(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    storePostAuthFrom(rawFrom ?? undefined);
  }, [rawFrom]);

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

  if (step === 2) {
    return <KnowledgeLevelOnboarding />;
  }

  return (
    <form onSubmit={onStep1} className="flex flex-col gap-4" autoComplete="on">
      <Typography variant="muted">{t('step1Subtitle')}</Typography>
      <OAuthSocialButtons from={oauthFrom} />
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
