import { setRequestLocale } from 'next-intl/server';

import { WatchlistView } from '@/widgets/watchlist-view';

export const dynamic = 'force-dynamic';

interface WatchlistPageProps {
  params: Promise<{ locale: string }>;
}

export default async function WatchlistPage({ params }: WatchlistPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <WatchlistView />;
}
