export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-foreground text-3xl font-bold">ИнвестНавигатор</h1>
      <p className="text-secondary-foreground max-w-md text-center">
        AI-платформа для частных инвесторов на российском рынке. Скоро здесь появится интерфейс.
      </p>
      <div className="mt-4 flex gap-3">
        <span className="text-positive text-sm">+2.4% ↑</span>
        <span className="text-muted-foreground text-sm">·</span>
        <span className="text-negative text-sm">−1.1% ↓</span>
        <span className="text-muted-foreground text-sm">·</span>
        <span className="text-primary text-sm">MOEX 3 245</span>
      </div>
    </main>
  );
}
