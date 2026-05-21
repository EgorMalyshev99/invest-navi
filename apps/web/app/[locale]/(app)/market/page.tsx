import { setRequestLocale } from 'next-intl/server';

import { AssetCatalog } from '@/widgets/asset-catalog';
import { MarketIndicesStrip } from '@/widgets/market-indices-strip';

/** Client widgets use @uidotdev/usehooks localStorage — skip static prerender. */
export const dynamic = 'force-dynamic';

interface MarketPageProps {
  params: Promise<{ locale: string }>;
}

export default async function MarketPage({ params }: MarketPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="space-y-8">
      <MarketIndicesStrip />
      <AssetCatalog />
    </div>
  );
}
