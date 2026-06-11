'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  AlertDescription,
  Button,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  Input,
} from '@repo/ui';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { login } from '@/features/auth/api/auth-api';
import { resolveOAuthErrorMessage } from '@/features/auth/lib/resolve-oauth-error';
import { resolvePostAuthRedirect } from '@/features/auth/lib/resolve-post-auth-redirect';
import { translateFieldError } from '@/features/auth/lib/translate-field-error';
import { loginSchema, type LoginFormValues } from '@/features/auth/model/schemas';
import { OAuthSocialButtons } from '@/features/auth/ui/oauth-social-buttons';
import { Link, useRouter, useSearchParams } from '@/i18n/navigation';
import { useTranslations } from '@/i18n/react-i18n';
import { GraphqlRequestError } from '@/shared/api/graphql';
import { useAuth } from '@/shared/auth/auth-context';

export function LoginForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshAuthState } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const oauthError = resolveOAuthErrorMessage(searchParams.get('oauth'), t);
  const displayError = error ?? oauthError;
  const from = resolvePostAuthRedirect(searchParams.get('from') ?? undefined);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    try {
      await login(values);
      refreshAuthState();
      router.replace(from);
    } catch (e) {
      setError(e instanceof GraphqlRequestError ? e.message : t('loginError'));
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" autoComplete="on">
      <OAuthSocialButtons from={from} />
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
