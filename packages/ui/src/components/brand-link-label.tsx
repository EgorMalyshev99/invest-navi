import { cn } from '../lib/utils';

export type BrandLinkShowLabel = boolean | 'desktop' | 'sidebar';

interface BrandLinkLabelProps {
  label: string;
  showLabel?: BrandLinkShowLabel;
}

export function BrandLinkLabel({ label, showLabel = true }: BrandLinkLabelProps) {
  const labelVisible = showLabel === true;
  const labelHidden = showLabel === false;

  return (
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
  );
}
