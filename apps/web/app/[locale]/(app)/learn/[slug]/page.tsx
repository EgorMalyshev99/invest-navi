import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { isLearnArticleSlug } from '@/entities/learn';
import { LearnArticleView } from '@/widgets/learn-hub';

interface LearnArticlePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function LearnArticlePage({ params }: LearnArticlePageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!isLearnArticleSlug(slug)) {
    notFound();
  }

  return <LearnArticleView slug={slug} />;
}
