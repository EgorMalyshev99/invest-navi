'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription } from '@repo/ui/alert';
import { Button } from '@repo/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@repo/ui/field';
import { Input } from '@repo/ui/input';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { login } from '@/features/auth/api/auth-api';
import { translateFieldError } from '@/features/auth/lib/translate-field-error';
import { loginSchema, type LoginFormValues } from '@/features/auth/model/schemas';
import { OAuthDivider } from '@/features/auth/ui/oauth-divider';
import { OAuthSocialButtons } from '@/features/auth/ui/oauth-social-buttons';
import { Link, useRouter, useSearchParams  } from '@/i18n/navigation';
import { useTranslations } from '@/i18n/react-i18n';
import { GraphqlRequestError } from '@/shared/api/graphql';


export function LoginForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const oauthError = searchParams.get('oauth') ? t('oauthError') : null;
  const displayError = error ?? oauthError;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    try {
      await login(values);
      router.replace(from ?? '/overview');
    } catch (e) {
      setError(e instanceof GraphqlRequestError ? e.message : t('loginError'));
    }
  });

  const from = searchParams.get('from') ?? undefined;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" autoComplete="on">
      <OAuthSocialButtons from={from} />
      <OAuthDivider />
      {displayError ? (
        <Alert variant="destructive">
          <AlertDescription>{displayError}</AlertDescription>
        </Alert>
      ) : null}
      <FieldGroup>
        <Field data-invalid={!!form.formState.errors.email}>
          <FieldLabel htmlFor="login-email">{t('email')}</FieldLabel>
          <Input
            id="login-email"
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
          <FieldLabel htmlFor="login-password">{t('password')}</FieldLabel>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!form.formState.errors.password}
            {...form.register('password')}
          />
          <FieldError>{translateFieldError(form.formState.errors.password, t)}</FieldError>
        </Field>
      </FieldGroup>
      <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
        {t('loginSubmit')}
      </Button>
      <p className="text-muted-foreground text-center text-sm">
        {t('noAccount')}{' '}
        <Link href="/register" className="text-primary hover:underline">
          {t('registerLink')}
        </Link>
      </p>
    </form>
  );
}
