import { createFileRoute } from '@tanstack/react-router';

import { MarketOverviewView } from '@/widgets/market-overview';

export const Route = createFileRoute('/_authenticated/overview')({
  component: MarketOverviewView,
});
