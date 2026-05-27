import { Injectable, Logger } from '@nestjs/common';

import { Asset } from '../market/entities/asset.type';
import { MarketIndex } from '../market/entities/index.type';
import { MarketCacheService } from '../market/market-cache.service';
import { MarketService } from '../market/market.service';
import { AssetInsightSource } from './entities/asset-insight-source.enum';
import { AssetInsight } from './entities/asset-insight.type';
import { buildFallbackInsight } from './lib/build-fallback-insight';
import { buildAssetInsightPrompt } from './lib/build-prompt';
import { applyAssetInsightCompliance, formatComplianceViolations } from './lib/compliance';
import { parseInsightJson } from './lib/parse-insight';
import { AiProviderFactory } from './providers/ai-provider.factory';

import type { AssetSnapshot, IndexSnapshot } from '@repo/api';

@Injectable()
export class AssetInsightService {
  private readonly logger = new Logger(AssetInsightService.name);

  constructor(
    private readonly marketService: MarketService,
    private readonly cache: MarketCacheService,
    private readonly aiFactory: AiProviderFactory,
  ) {}

  async getInsight(symbol: string, locale = 'ru'): Promise<AssetInsight> {
    const normalizedLocale = locale === 'en' ? 'en' : 'ru';
    const cacheKey = `ai:insight:${symbol.toUpperCase()}:${normalizedLocale}`;
    const cached = this.cache.get<AssetInsight>(cacheKey);
    if (cached) {
      return cached;
    }

    const [asset, indices] = await Promise.all([
      this.marketService.getAsset(symbol),
      this.marketService.getIndices(),
    ]);

    const snapshot = this.toAssetSnapshot(asset);
    const indexSnapshots = indices.map((index) => this.toIndexSnapshot(index));

    const insight = await this.generateInsight(snapshot, indexSnapshots, normalizedLocale);

    this.cache.set(cacheKey, insight);
    return insight;
  }

  private async generateInsight(
    asset: AssetSnapshot,
    indices: IndexSnapshot[],
    locale: string,
  ): Promise<AssetInsight> {
    const provider = this.aiFactory.getActiveProvider();

    if (provider) {
      try {
        const { system, user } = buildAssetInsightPrompt(asset, indices, locale);
        const raw = await provider.complete([
          { role: 'system', content: system },
          { role: 'user', content: user },
        ]);
        const parsed = parseInsightJson(raw);

        if (parsed) {
          const compliance = applyAssetInsightCompliance(parsed);
          if (compliance.ok && compliance.content) {
            return this.toGraphqlInsight(
              asset.symbol,
              compliance.content,
              AssetInsightSource.AI,
              provider.name,
            );
          }
          this.logger.warn(
            `AI insight compliance rejected for ${asset.symbol}: ${formatComplianceViolations(compliance.violations)}`,
          );
        } else {
          this.logger.warn(`AI insight parse failed for ${asset.symbol}`);
        }
      } catch (error) {
        this.logger.warn(
          `AI insight failed for ${asset.symbol}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    const fallback = buildFallbackInsight(asset, indices, locale);
    return this.toGraphqlInsight(asset.symbol, fallback, AssetInsightSource.FALLBACK);
  }

  private toGraphqlInsight(
    symbol: string,
    content: {
      whatIs: string;
      whatChanged: string;
      whyMatters: string;
      risks: string[];
      forInvestor: string;
      vsIndex?: string;
    },
    source: AssetInsightSource,
    provider?: string,
  ): AssetInsight {
    return {
      symbol,
      source,
      provider,
      whatIs: content.whatIs,
      whatChanged: content.whatChanged,
      whyMatters: content.whyMatters,
      risks: content.risks,
      forInvestor: content.forInvestor,
      vsIndex: content.vsIndex,
    };
  }

  private toAssetSnapshot(asset: Asset): AssetSnapshot {
    return {
      symbol: asset.symbol,
      name: asset.name,
      lastPrice: asset.lastPrice,
      changePercent: asset.changePercent,
      lotSize: asset.lotSize,
      valueToday: asset.valueToday,
      instrumentType: asset.instrumentType,
      currency: asset.currency,
      figi: asset.figi,
      sector: asset.sector,
      dividendYieldPercent: asset.dividendYieldPercent,
      dataSource: asset.dataSource,
    };
  }

  private toIndexSnapshot(index: MarketIndex): IndexSnapshot {
    return {
      code: index.code,
      name: index.name,
      currentValue: index.currentValue,
      changePercent: index.changePercent,
      valueToday: index.valueToday,
      dataSource: index.dataSource,
    };
  }
}
