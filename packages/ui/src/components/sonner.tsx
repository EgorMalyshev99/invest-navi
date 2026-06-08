'use client';

import { CheckCircleIcon } from '@phosphor-icons/react/CheckCircle';
import { InfoIcon } from '@phosphor-icons/react/Info';
import { SpinnerIcon } from '@phosphor-icons/react/Spinner';
import { WarningIcon } from '@phosphor-icons/react/Warning';
import { XCircleIcon } from '@phosphor-icons/react/XCircle';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

import { useResolvedTheme } from '../hooks/use-resolved-theme';

const Toaster = ({ ...props }: ToasterProps) => {
  const theme = useResolvedTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: (
          <span className="inline-flex size-4" aria-hidden>
            <CheckCircleIcon size={16} />
          </span>
        ),
        info: (
          <span className="inline-flex size-4" aria-hidden>
            <InfoIcon size={16} />
          </span>
        ),
        warning: (
          <span className="inline-flex size-4" aria-hidden>
            <WarningIcon size={16} />
          </span>
        ),
        error: (
          <span className="inline-flex size-4" aria-hidden>
            <XCircleIcon size={16} />
          </span>
        ),
        loading: (
          <span className="inline-flex size-4 animate-spin" aria-hidden>
            <SpinnerIcon size={16} />
          </span>
        ),
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: 'cn-toast',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
