'use client';

import { Button } from '@repo/ui';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="ru">
      <body className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center gap-6 p-8 font-sans antialiased">
        <div className="flex max-w-md flex-col gap-2 text-center">
          <h1 className="text-xl font-semibold">Что-то пошло не так</h1>
          <p className="text-muted-foreground text-sm">
            Не удалось загрузить приложение. Попробуйте обновить страницу.
          </p>
        </div>
        <Button onClick={() => reset()}>Повторить</Button>
      </body>
    </html>
  );
}
