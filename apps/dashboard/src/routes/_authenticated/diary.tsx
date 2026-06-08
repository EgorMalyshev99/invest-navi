import {
  Skeleton,
} from '@repo/ui';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense } from 'react';

import { DiaryView } from '@/widgets/diary-view';

export const Route = createFileRoute('/_authenticated/diary')({
  component: DiaryPage,
});

function DiaryPage() {
  return (
    <Suspense fallback={<Skeleton className="h-48 w-full" />}>
      <DiaryView />
    </Suspense>
  );
}
