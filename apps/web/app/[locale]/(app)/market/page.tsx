import { setRequestLocale } from 'next-intl/server';

import { AssetCatalog } from '@/widgets/asset-catalog';

interface MarketPageProps {
  params: Promise<{ locale: string }>;
}

export default async function MarketPage({ params }: MarketPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AssetCatalog />;
}
