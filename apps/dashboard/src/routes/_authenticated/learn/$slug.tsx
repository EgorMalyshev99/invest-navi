import { createFileRoute, notFound } from '@tanstack/react-router';

import { isLearnArticleSlug } from '@/entities/learn';
import { LearnArticleView } from '@/widgets/learn-hub';

export const Route = createFileRoute('/_authenticated/learn/$slug')({
  beforeLoad: ({ params }) => {
    if (!isLearnArticleSlug(params.slug)) {
      throw notFound();
    }
  },
  component: LearnArticlePage,
});

function LearnArticlePage() {
  const { slug } = Route.useParams();
  if (!isLearnArticleSlug(slug)) {
    return null;
  }

  return <LearnArticleView slug={slug} />;
}
