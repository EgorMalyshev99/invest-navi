import { setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { Skeleton } from '@/shared/ui/skeleton';
import { BondDetail } from '@/widgets/bond-detail';

export const dynamic = 'force-dynamic';

interface BondDetailPageProps {
  params: Promise<{ locale: string; symbol: string }>;
}

export default async function BondDetailPage({ params }: BondDetailPageProps) {
  const { locale, symbol } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<Skeleton className="h-48 w-full" />}>
      <BondDetail symbol={symbol.toUpperCase()} />
    </Suspense>
  );
}
