import { createFileRoute } from '@tanstack/react-router';

import { LoginForm } from '@/features/auth';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <LoginForm />
    </main>
  );
}
