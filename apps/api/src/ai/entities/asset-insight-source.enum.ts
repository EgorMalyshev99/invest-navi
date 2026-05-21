import { registerEnumType } from '@nestjs/graphql';

export enum AssetInsightSource {
  AI = 'AI',
  FALLBACK = 'FALLBACK',
}

registerEnumType(AssetInsightSource, { name: 'AssetInsightSource' });
