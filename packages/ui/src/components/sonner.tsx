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
        success: <CheckCircleIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <WarningIcon className="size-4" />,
        error: <XCircleIcon className="size-4" />,
        loading: <SpinnerIcon className="size-4 animate-spin" />,
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
