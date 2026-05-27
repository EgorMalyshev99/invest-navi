'use client';

import { ArrowLeftIcon } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';

import { getLearnArticleMeta, type LearnArticleSlug } from '@/entities/learn';
import { Link } from '@/i18n/navigation';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

interface LearnArticleViewProps {
  slug: LearnArticleSlug;
}

export function LearnArticleView({ slug }: LearnArticleViewProps) {
  const t = useTranslations('learn');
  const meta = getLearnArticleMeta(slug);
  const sectionKeys = meta?.sections ?? [];

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <Button variant="ghost" size="sm" className="w-fit px-0" asChild>
        <Link href="/learn" className="gap-2">
          <ArrowLeftIcon className="size-4" aria-hidden />
          {t('backToHub')}
        </Link>
      </Button>

      <header className="flex flex-col gap-2">
        {meta ? (
          <p className="text-primary text-xs font-medium tracking-wide uppercase">
            {t(`categories.${meta.category}`)}
          </p>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-tight">{t(`articles.${slug}.title`)}</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {t(`articles.${slug}.summary`)}
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {sectionKeys.map((sectionKey) => {
          const titleKey = `articles.${slug}.sections.${sectionKey}.title`;
          const bodyKey = `articles.${slug}.sections.${sectionKey}.body`;

          return (
            <Card key={sectionKey}>
              <CardHeader>
                <CardTitle className="text-base">
                  {t(titleKey as Parameters<typeof t>[0])}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                  {t(bodyKey as Parameters<typeof t>[0])}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {meta?.relatedHrefs && meta.relatedHrefs.length > 0 ? (
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-base">{t('relatedLinksTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {meta.relatedHrefs.map((href) => (
              <Button key={href} variant="outline" size="sm" asChild>
                <Link href={href}>{t(`relatedLinks.${href}` as Parameters<typeof t>[0])}</Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <p className="text-muted-foreground text-xs">{t('disclaimer')}</p>
    </div>
  );
}
