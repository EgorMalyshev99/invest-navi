import {
  cn,
  Skeleton,
} from '@repo/ui';

type LocaleSwitcherSkeletonProps = {
  className?: string;
};

export function LocaleSwitcherSkeleton({ className }: LocaleSwitcherSkeletonProps) {
  return <Skeleton className={cn('h-9 w-[4.5rem] rounded-md', className)} aria-hidden />;
}
