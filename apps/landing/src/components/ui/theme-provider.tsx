'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

import type { ComponentProps, ReactNode } from 'react';

type NextThemesProviderProps = ComponentProps<typeof NextThemesProvider>;

type ThemeProviderProps = Omit<NextThemesProviderProps, 'children'> & {
  children: ReactNode;
};

const ThemesProvider = NextThemesProvider as (
  props: NextThemesProviderProps & { children?: ReactNode },
) => React.JSX.Element;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const scriptProps =
    typeof window === 'undefined' ? undefined : ({ type: 'application/json' } as const);

  return (
    <ThemesProvider scriptProps={scriptProps} {...props}>
      {children}
    </ThemesProvider>
  );
}
