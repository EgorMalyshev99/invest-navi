import { Skeleton } from '@repo/ui/skeleton';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';


import { BondsView } from '@/widgets/bonds-view';

export const Route = createFileRoute('/_authenticated/bonds')({
  component: BondsPage,
});

function BondsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-48 w-full" />}>
      <BondsView />
    </Suspense>
  );
}
