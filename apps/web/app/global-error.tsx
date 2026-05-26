'use client';

import './globals.css';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="ru">
      <body className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center gap-6 p-8 font-sans antialiased">
        <div className="max-w-md space-y-2 text-center">
          <h1 className="text-xl font-semibold">Что-то пошло не так</h1>
          <p className="text-muted-foreground text-sm">
            Не удалось загрузить приложение. Попробуйте обновить страницу.
          </p>
        </div>
        <button
          type="button"
          onClick={() => reset()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-medium"
        >
          Повторить
        </button>
      </body>
    </html>
  );
}
