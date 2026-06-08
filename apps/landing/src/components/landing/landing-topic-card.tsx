import { Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from '@repo/ui';

import type { Icon } from '@phosphor-icons/react';

interface LandingTopicCardProps {
  title: string;
  body: string;
  icon: Icon;
  iconClassName?: string;
  className?: string;
}

export function LandingTopicCard({
  title,
  body,
  icon: IconComponent,
  iconClassName,
  className,
}: LandingTopicCardProps) {
  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <div
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-lg',
            iconClassName,
          )}
        >
          <IconComponent className="size-5" weight="duotone" aria-hidden />
        </div>
        <CardTitle className="min-w-0 flex-1 text-base leading-snug">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="w-full text-sm leading-relaxed">{body}</CardDescription>
      </CardContent>
    </Card>
  );
}
