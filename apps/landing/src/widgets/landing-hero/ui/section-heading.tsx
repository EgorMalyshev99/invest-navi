import { cn } from '@repo/ui/lib/utils';
import { Typography } from '@repo/ui/typography';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeading({ title, subtitle, className }: SectionHeadingProps) {
  return (
    <div className={cn('mb-10 text-center', className)}>
      <Typography variant="h2" className="border-0 pb-0 text-2xl md:text-3xl">
        {title}
      </Typography>
      {subtitle ? (
        <Typography variant="lead" className="text-secondary-foreground mt-3 text-base md:text-lg">
          {subtitle}
        </Typography>
      ) : null}
    </div>
  );
}
