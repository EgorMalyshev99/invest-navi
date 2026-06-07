import { Card, CardDescription, CardTitle } from '@repo/ui/card';
import { cn } from '@repo/ui/lib/utils';

interface LandingStepCardProps {
  step: number;
  stepLabel: string;
  totalSteps: number;
  title: string;
  body: string;
  className?: string;
}

export function LandingStepCard({
  step,
  stepLabel,
  totalSteps,
  title,
  body,
  className,
}: LandingStepCardProps) {
  return (
    <Card
      className={cn('ring-primary/15 flex h-full flex-col gap-0 overflow-hidden py-0', className)}
    >
      <div className="border-border/60 from-primary/15 via-accent/10 border-b bg-gradient-to-br to-transparent px-5 py-6">
        <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
          {stepLabel}
        </p>
        <div className="flex items-end justify-between gap-3">
          <span className="text-primary text-5xl leading-none font-bold tabular-nums" aria-hidden>
            {step}
          </span>
          <span className="text-muted-foreground pb-1 text-sm tabular-nums">/ {totalSteps}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pt-5 pb-6">
        <CardTitle className="mb-3 text-lg leading-snug">{title}</CardTitle>
        <CardDescription className="text-secondary-foreground w-full flex-1 text-sm leading-relaxed">
          {body}
        </CardDescription>
      </div>
    </Card>
  );
}
