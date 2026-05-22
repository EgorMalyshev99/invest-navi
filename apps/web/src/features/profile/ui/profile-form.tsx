'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import type { KnowledgeLevel, PreferredLocale } from '@/shared/api/graphql/generated/graphql';

import { fetchMe, updateProfile } from '@/features/auth/api/auth-api';
import { GraphqlRequestError } from '@/shared/api/graphql';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Field, FieldError, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shared/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { Skeleton } from '@/shared/ui/skeleton';
import { Typography } from '@/shared/ui/typography';

const profileSchema = z.object({
  name: z.string().max(120).optional(),
  knowledgeLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  preferredLocale: z.enum(['ru', 'en']),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const t = useTranslations('profile');
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: fetchMe,
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      knowledgeLevel: 'beginner',
      preferredLocale: 'ru',
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (data?.me) {
      form.reset({
        name: data.me.name ?? '',
        knowledgeLevel: data.me.knowledgeLevel,
        preferredLocale: data.me.preferredLocale,
      });
    }
  }, [data, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    setSaved(false);
    try {
      await updateProfile({
        name: values.name || undefined,
        knowledgeLevel: values.knowledgeLevel as KnowledgeLevel,
        preferredLocale: values.preferredLocale as PreferredLocale,
      });
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      setSaved(true);
    } catch (e) {
      setError(e instanceof GraphqlRequestError ? e.message : t('saveError'));
    }
  });

  if (isLoading) {
    return <Skeleton className="h-64 w-full max-w-lg" />;
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <Typography variant="muted">{data?.me.email}</Typography>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
          {saved ? (
            <Alert>
              <AlertDescription>{t('saved')}</AlertDescription>
            </Alert>
          ) : null}
          <Field>
            <FieldLabel htmlFor="profile-name">{t('name')}</FieldLabel>
            <Input id="profile-name" {...form.register('name')} />
          </Field>
          <Controller
            control={form.control}
            name="preferredLocale"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>{t('language')}</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger aria-invalid={fieldState.invalid}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ru">{t('localeRu')}</SelectItem>
                    <SelectItem value="en">{t('localeEn')}</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />
          <Controller
            control={form.control}
            name="knowledgeLevel"
            render={({ field }) => (
              <Field>
                <FieldLabel>{t('knowledgeLevel')}</FieldLabel>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="grid gap-2"
                >
                  {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                    <div
                      key={level}
                      className="border-border flex items-center gap-2 rounded-lg border p-3"
                    >
                      <RadioGroupItem value={level} id={`profile-${level}`} />
                      <Label htmlFor={`profile-${level}`} className="flex-1 cursor-pointer">
                        <span className="font-medium">{t(`levels.${level}.title`)}</span>
                        <p className="text-muted-foreground text-sm">
                          {t(`levels.${level}.description`)}
                        </p>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </Field>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {t('save')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
