import {
  Skeleton,
} from '@repo/ui';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

import { BondDetail } from '@/widgets/bond-detail';

export const Route = createFileRoute('/_authenticated/bonds/$symbol')({
  component: BondDetailPage,
});

function BondDetailPage() {
  const { symbol } = Route.useParams();

  return (
    <Suspense fallback={<Skeleton className="h-48 w-full" />}>
      <BondDetail symbol={symbol.toUpperCase()} />
    </Suspense>
  );
}
