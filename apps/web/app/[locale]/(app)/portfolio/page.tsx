import { setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { Skeleton } from '@/shared/ui/skeleton';
import { PortfolioView } from '@/widgets/portfolio-view';

export const dynamic = 'force-dynamic';

interface PortfolioPageProps {
  params: Promise<{ locale: string }>;
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<Skeleton className="h-48 w-full" />}>
      <PortfolioView />
    </Suspense>
  );
}
