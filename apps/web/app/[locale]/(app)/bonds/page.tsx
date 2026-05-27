import { setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { Skeleton } from '@/shared/ui/skeleton';
import { BondsView } from '@/widgets/bonds-view';

export const dynamic = 'force-dynamic';

interface BondsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function BondsPage({ params }: BondsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<Skeleton className="h-48 w-full" />}>
      <BondsView />
    </Suspense>
  );
}
