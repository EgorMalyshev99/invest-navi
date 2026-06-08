import { cn } from '../lib/utils';

interface AiDisclaimerTextProps {
  text: string;
  className?: string;
}

export function AiDisclaimerText({ text, className }: AiDisclaimerTextProps) {
  return <p className={cn('text-muted-foreground text-xs', className)}>{text}</p>;
}
