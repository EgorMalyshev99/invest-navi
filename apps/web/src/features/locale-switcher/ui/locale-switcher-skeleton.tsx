import { cn } from '@/lib/utils';
import { Skeleton } from '@/shared/ui/skeleton';

type LocaleSwitcherSkeletonProps = {
  className?: string;
};

export function LocaleSwitcherSkeleton({ className }: LocaleSwitcherSkeletonProps) {
  return <Skeleton className={cn('h-9 w-[4.5rem] rounded-md', className)} aria-hidden />;
}
