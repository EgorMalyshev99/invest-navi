import { cn } from '@repo/ui';
import { BrandLinkLabel, type BrandLinkShowLabel } from '@repo/ui/components/brand-link-label';

import { Link } from '@/i18n/navigation';

type BrandLinkProps = {
  href: React.ComponentProps<typeof Link>['href'];
  label: string;
  /** `desktop` — название только от `md` (лендинг); `sidebar` — скрывается в icon-collapsed сайдбара */
  showLabel?: BrandLinkShowLabel;
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
      <img
        src="/img/logo.png"
        alt=""
        width={36}
        height={36}
        className={cn('size-9 shrink-0 rounded-lg', logoClassName)}
        loading={priority ? 'eager' : 'lazy'}
      />
      <BrandLinkLabel label={label} showLabel={showLabel} />
    </Link>
  );
}
