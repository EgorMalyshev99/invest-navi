'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { login } from '@/features/auth/api/auth-api';
import { translateFieldError } from '@/features/auth/lib/translate-field-error';
import { loginSchema, type LoginFormValues } from '@/features/auth/model/schemas';
import { Link, useRouter } from '@/i18n/navigation';
import { GraphqlRequestError } from '@/shared/api/graphql';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';

export function LoginForm() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    try {
      await login(values);
      router.replace('/market');
      router.refresh();
    } catch (e) {
      setError(e instanceof GraphqlRequestError ? e.message : t('loginError'));
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" autoComplete="on">
      {error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
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
