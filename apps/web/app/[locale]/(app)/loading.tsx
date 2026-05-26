import { Skeleton } from '@/shared/ui/skeleton';

export default function AppSegmentLoading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-3 sm:grid-cols-2">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
        <div className="grid gap-4 sm:grid-cols-2">
          {(['a', 'b', 'c', 'd'] as const).map((id) => (
            <Skeleton key={id} className="h-40 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
