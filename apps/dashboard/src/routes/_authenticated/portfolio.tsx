import { Skeleton } from '@repo/ui/skeleton';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';


import { PortfolioView } from '@/widgets/portfolio-view';

export const Route = createFileRoute('/_authenticated/portfolio')({
  component: PortfolioPage,
});

function PortfolioPage() {
  return (
    <Suspense fallback={<Skeleton className="h-48 w-full" />}>
      <PortfolioView />
    </Suspense>
  );
}
