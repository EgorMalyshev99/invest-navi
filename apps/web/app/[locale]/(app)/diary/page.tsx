import { setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';

import { Skeleton } from '@/shared/ui/skeleton';
import { DiaryView } from '@/widgets/diary-view';

export const dynamic = 'force-dynamic';

interface DiaryPageProps {
  params: Promise<{ locale: string }>;
}

export default async function DiaryPage({ params }: DiaryPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<Skeleton className="h-48 w-full" />}>
      <DiaryView />
    </Suspense>
  );
}
