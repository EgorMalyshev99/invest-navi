import { setRequestLocale } from 'next-intl/server';

import type { Metadata } from 'next';

import { fetchAssetDetail } from '@/entities/asset';
import { AssetDetail } from '@/widgets/asset-detail';

export const dynamic = 'force-dynamic';

interface AssetPageProps {
  params: Promise<{ locale: string; symbol: string }>;
}

export async function generateMetadata({ params }: AssetPageProps): Promise<Metadata> {
  const { symbol } = await params;
  const normalizedSymbol = symbol.toUpperCase();

  try {
    const { asset } = await fetchAssetDetail(normalizedSymbol);
    return {
      title: `${asset.symbol} — ${asset.name}`,
    };
  } catch {
    return {
      title: normalizedSymbol,
    };
  }
}

export default async function AssetPage({ params }: AssetPageProps) {
  const { locale, symbol } = await params;
  setRequestLocale(locale);

  return <AssetDetail symbol={symbol.toUpperCase()} />;
}
