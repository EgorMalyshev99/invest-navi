import { setRequestLocale } from 'next-intl/server';

import { MarketOverviewView } from '@/widgets/market-overview';

interface OverviewPageProps {
  params: Promise<{ locale: string }>;
}

export default async function OverviewPage({ params }: OverviewPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <MarketOverviewView />;
}
