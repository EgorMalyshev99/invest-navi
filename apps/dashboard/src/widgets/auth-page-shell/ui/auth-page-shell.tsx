'use client';

import { Card, CardContent, CardHeader, Typography } from '@repo/ui';

import { PublicShell } from '@/widgets/public-shell';

type AuthPageShellProps = {
  title: string;
  children: React.ReactNode;
};

export function AuthPageShell({ title, children }: AuthPageShellProps) {
  return (
    <PublicShell variant="auth">
      <div className="container flex flex-1 items-center justify-center py-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <Typography variant="h1">{title}</Typography>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </PublicShell>
  );
}
