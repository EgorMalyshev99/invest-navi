import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from './empty';

import type { ReactNode } from 'react';

interface RouteNotFoundLayoutProps {
  title: string;
  description: string;
  actions: ReactNode;
}

export function RouteNotFoundLayout({ title, description, actions }: RouteNotFoundLayoutProps) {
  return (
    <div className="container flex min-h-[50vh] flex-col items-center justify-center py-16">
      <Empty className="max-w-md">
        <EmptyHeader>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
        <div className="flex flex-wrap items-center justify-center gap-3">{actions}</div>
      </Empty>
    </div>
  );
}
