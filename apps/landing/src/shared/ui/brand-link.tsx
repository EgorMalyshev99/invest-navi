import { cn } from '@repo/ui/lib/utils';
import Image from 'next/image';

import { Link } from '@/i18n/navigation';

type BrandLinkProps = {
  href: React.ComponentProps<typeof Link>['href'];
  label: string;
  /** `desktop` — название только от `md` (лендинг); `sidebar` — скрывается в icon-collapsed сайдбара */
  showLabel?: boolean | 'desktop' | 'sidebar';
  className?: string;
  logoClassName?: string;
  priority?: boolean;
};

export function BrandLink({
  href,
  label,
  showLabel = true,
  className,
  logoClassName,
  priority = false,
}: BrandLinkProps) {
  const labelVisible = showLabel === true;
  const labelHidden = showLabel === false;

  return (
    <Link
      href={href}
      className={cn(
        'hover:text-foreground focus-visible:ring-ring flex min-w-0 items-center gap-2.5 rounded-md outline-none focus-visible:ring-2',
        className,
      )}
      aria-label={labelHidden ? label : undefined}
    >
      <Image
        src="/img/logo.png"
        alt=""
        width={36}
        height={36}
        className={cn('size-9 shrink-0 rounded-lg', logoClassName)}
        priority={priority}
      />
      <span
        className={cn(
          'truncate font-semibold tracking-tight',
          showLabel === 'desktop' && 'hidden md:inline',
          showLabel === 'sidebar' && 'group-data-[collapsible=icon]:hidden',
          labelHidden && 'sr-only',
          labelVisible && 'inline',
        )}
      >
        {label}
      </span>
    </Link>
  );
}
