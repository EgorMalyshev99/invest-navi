import { setRequestLocale } from 'next-intl/server';

import { AssetDetail } from '@/widgets/asset-detail';

export const dynamic = 'force-dynamic';

interface AssetPageProps {
  params: Promise<{ locale: string; symbol: string }>;
}

export default async function AssetPage({ params }: AssetPageProps) {
  const { locale, symbol } = await params;
  setRequestLocale(locale);

  return <AssetDetail symbol={symbol.toUpperCase()} />;
}
