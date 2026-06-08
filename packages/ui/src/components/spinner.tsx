import { SpinnerIcon } from '@phosphor-icons/react/Spinner';

import type { ComponentProps } from 'react';

import { cn } from '../lib/utils';

function Spinner({ className }: Pick<ComponentProps<'svg'>, 'className'>) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn('inline-flex size-4 animate-spin', className)}
    >
      <SpinnerIcon size={16} />
    </span>
  );
}

export { Spinner };
