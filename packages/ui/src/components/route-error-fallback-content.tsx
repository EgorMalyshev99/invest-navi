import { WarningCircleIcon } from '@phosphor-icons/react/WarningCircle';

import { Alert, AlertDescription, AlertTitle } from './alert';
import { Button } from './button';

interface RouteErrorFallbackContentProps {
  title: string;
  description: string;
  retryLabel: string;
  onRetry: () => void;
}

export function RouteErrorFallbackContent({
  title,
  description,
  retryLabel,
  onRetry,
}: RouteErrorFallbackContentProps) {
  return (
    <div className="container flex min-h-[40vh] flex-col items-center justify-center py-12">
      <Alert variant="destructive" className="max-w-md">
        <WarningCircleIcon />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
      <Button type="button" className="mt-6" onClick={onRetry}>
        {retryLabel}
      </Button>
    </div>
  );
}
