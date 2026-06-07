'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription } from '@repo/ui/alert';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@repo/ui/field';
import { Input } from '@repo/ui/input';
import { Label } from '@repo/ui/label';
import { RadioGroup, RadioGroupItem } from '@repo/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui/select';
import { Skeleton } from '@repo/ui/skeleton';
import { Typography } from '@repo/ui/typography';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { useMeQuery } from '@/features/auth/api/use-me-query';
import { useUpdateProfileMutation } from '@/features/auth/api/use-update-profile-mutation';
import {
  fromGraphqlKnowledgeLevel,
  fromGraphqlPreferredLocale,
  toGraphqlKnowledgeLevel,
  toGraphqlPreferredLocale,
} from '@/features/auth/lib/graphql-enums';
import { knowledgeLevelSchema } from '@/features/auth/model/schemas';
import { useTranslations } from '@/i18n/react-i18n';
import { GraphqlRequestError } from '@/shared/api/graphql';

const profileSchema = z.object({
  name: z.string().max(120).optional(),
  knowledgeLevel: knowledgeLevelSchema,
  preferredLocale: z.enum(['ru', 'en']),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const t = useTranslations('profile');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useMeQuery();
  const updateProfile = useUpdateProfileMutation();

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
        knowledgeLevel: fromGraphqlKnowledgeLevel(data.me.knowledgeLevel),
        preferredLocale: fromGraphqlPreferredLocale(data.me.preferredLocale),
      });
    }
  }, [data, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    setSaved(false);
    try {
      await updateProfile.mutateAsync({
        name: values.name || undefined,
        knowledgeLevel: toGraphqlKnowledgeLevel(values.knowledgeLevel),
        preferredLocale: toGraphqlPreferredLocale(values.preferredLocale),
      });
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
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
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
          <FieldGroup>
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
                <FieldSet>
                  <FieldLegend>{t('knowledgeLevel')}</FieldLegend>
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
                </FieldSet>
              )}
            />
          </FieldGroup>
          <Button type="submit" disabled={form.formState.isSubmitting || updateProfile.isPending}>
            {t('save')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
