import { createFileRoute } from '@tanstack/react-router';

import { WatchlistView } from '@/widgets/watchlist-view';

export const Route = createFileRoute('/_authenticated/watchlist')({
  component: WatchlistView,
});
