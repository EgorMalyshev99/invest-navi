import { Skeleton } from '@repo/ui/skeleton';

export function DashboardShellSkeleton() {
  return (
    <div className="bg-background flex min-h-screen w-full">
      <aside
        className="border-border hidden w-64 shrink-0 flex-col border-r p-4 md:flex"
        aria-hidden
      >
        <Skeleton className="h-9 w-36" />
        <div className="mt-8 flex flex-col gap-2">
          {(['nav-a', 'nav-b', 'nav-c', 'nav-d'] as const).map((id) => (
            <Skeleton key={id} className="h-9 w-full" />
          ))}
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-border flex h-14 items-center gap-2 border-b px-4 md:hidden">
          <Skeleton className="size-9 shrink-0" />
          <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
        </div>
        <main className="flex flex-1 flex-col px-4 py-6 md:px-8">
          <div className="flex flex-col gap-8">
            <div className="grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72 max-w-full" />
            <div className="grid gap-4 sm:grid-cols-2">
              {(['main-a', 'main-b'] as const).map((id) => (
                <Skeleton key={id} className="h-40 w-full" />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
