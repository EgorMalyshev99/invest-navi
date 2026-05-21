import type { ReactNode } from 'react';

/** Root layout — locale-specific html/body live under `app/[locale]/`. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
