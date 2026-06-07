import { createFileRoute } from '@tanstack/react-router';

import { RegisterForm } from '@/features/auth';

export const Route = createFileRoute('/register')({
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <RegisterForm />
    </main>
  );
}
