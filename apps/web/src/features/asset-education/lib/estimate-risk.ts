import type { Asset, RiskLevel } from '@/entities/asset';

export function estimateRiskLevel(asset: Asset): RiskLevel {
  const absChange = Math.abs(asset.changePercent);
  const volatileSector = asset.sector?.toLowerCase().includes('og') ?? false;

  if (absChange >= 3 || volatileSector) {
    return 'high';
  }
  if (absChange >= 1.2) {
    return 'medium';
  }
  return 'low';
}
