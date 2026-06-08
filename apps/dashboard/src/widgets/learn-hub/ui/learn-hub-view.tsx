'use client';

import { ArrowRightIcon, BookOpenTextIcon, ShieldWarningIcon } from '@phosphor-icons/react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui';

import { getLearnHubArticleOrder, type LearnCategory } from '@/entities/learn';
import { fromGraphqlKnowledgeLevel, useMeQuery } from '@/features/auth';
import { Link } from '@/i18n/navigation';
import { useTranslations } from '@/i18n/react-i18n';

const CATEGORY_ORDER: LearnCategory[] = ['fundamentals', 'instruments', 'mistakes', 'scenarios'];

export function LearnHubView() {
  const t = useTranslations('learn');
  const { data: meData } = useMeQuery();
  const knowledgeLevel = meData?.me.knowledgeLevel
    ? fromGraphqlKnowledgeLevel(meData.me.knowledgeLevel)
    : undefined;
  const orderedArticles = getLearnHubArticleOrder(knowledgeLevel);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">{t('subtitle')}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldWarningIcon className="text-primary size-5" aria-hidden />
              {t('risksCardTitle')}
            </CardTitle>
            <CardDescription>{t('risksCardDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link href="/risks">
                {t('risksCardCta')}
                <ArrowRightIcon className="size-4" aria-hidden />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpenTextIcon className="text-primary size-5" aria-hidden />
              {t('glossaryCardTitle')}
            </CardTitle>
            <CardDescription>{t('glossaryCardDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link href="/learn/glossary">
                {t('glossaryCardCta')}
                <ArrowRightIcon className="size-4" aria-hidden />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {CATEGORY_ORDER.map((category) => {
        const articles = orderedArticles.filter((article) => article.category === category);
        if (articles.length === 0) {
          return null;
        }

        return (
          <section key={category} className="flex flex-col gap-3">
            <h2 className="text-lg font-medium">{t(`categories.${category}`)}</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {articles.map((article) => (
                <Card key={article.slug} className="hover:border-primary/40 transition-colors">
                  <CardHeader className="flex flex-col gap-1">
                    <CardTitle className="text-base">
                      <Link href={`/learn/${article.slug}`} className="hover:text-primary">
                        {t(`articles.${article.slug}.title` as Parameters<typeof t>[0])}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {t(`articles.${article.slug}.summary` as Parameters<typeof t>[0])}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button variant="ghost" size="sm" className="px-0" asChild>
                      <Link href={`/learn/${article.slug}`}>
                        {t('readArticle')}
                        <ArrowRightIcon className="size-4" aria-hidden />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        );
      })}

      <p className="text-muted-foreground text-xs">{t('disclaimer')}</p>
    </div>
  );
}
