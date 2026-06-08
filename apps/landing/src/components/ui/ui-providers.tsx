'use client';

import { TooltipProvider } from '@repo/ui';

export function UiProviders({ children }: { children: React.ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>;
}
