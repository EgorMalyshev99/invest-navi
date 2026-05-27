import { Injectable, Logger } from '@nestjs/common';

import { Bond } from '../market/entities/bond.type';
import { MarketCacheService } from '../market/market-cache.service';
import { MarketService } from '../market/market.service';
import { AssetInsightSource } from './entities/asset-insight-source.enum';
import { BondInsight } from './entities/bond-insight.type';
import { buildBondFallbackInsight } from './lib/build-bond-fallback-insight';
import { buildBondInsightPrompt } from './lib/build-bond-prompt';
import { applyBondInsightCompliance, formatComplianceViolations } from './lib/compliance';
import { parseBondInsightJson } from './lib/parse-bond-insight';
import { AiProviderFactory } from './providers/ai-provider.factory';

import type { BondSnapshot } from '@repo/api';

@Injectable()
export class BondInsightService {
  private readonly logger = new Logger(BondInsightService.name);

  constructor(
    private readonly marketService: MarketService,
    private readonly cache: MarketCacheService,
    private readonly aiFactory: AiProviderFactory,
  ) {}

  async getInsight(symbol: string, locale = 'ru'): Promise<BondInsight> {
    const normalizedLocale = locale === 'en' ? 'en' : 'ru';
    const cacheKey = `ai:bond-insight:${symbol.toUpperCase()}:${normalizedLocale}`;
    const cached = this.cache.get<BondInsight>(cacheKey);
    if (cached) {
      return cached;
    }

    const bond = await this.marketService.getBond(symbol);
    const snapshot = this.toBondSnapshot(bond);
    const insight = await this.generateInsight(snapshot, normalizedLocale);

    this.cache.set(cacheKey, insight);
    return insight;
  }

  private async generateInsight(bond: BondSnapshot, locale: string): Promise<BondInsight> {
    const provider = this.aiFactory.getActiveProvider();

    if (provider) {
      try {
        const { system, user } = buildBondInsightPrompt(bond, locale);
        const raw = await provider.complete([
          { role: 'system', content: system },
          { role: 'user', content: user },
        ]);
        const parsed = parseBondInsightJson(raw);

        if (parsed) {
          const compliance = applyBondInsightCompliance(parsed);
          if (compliance.ok && compliance.content) {
            return this.toGraphqlInsight(
              bond,
              compliance.content,
              AssetInsightSource.AI,
              provider.name,
            );
          }
          this.logger.warn(
            `AI bond insight compliance rejected for ${bond.symbol}: ${formatComplianceViolations(compliance.violations)}`,
          );
        } else {
          this.logger.warn(`AI bond insight parse failed for ${bond.symbol}`);
        }
      } catch (error) {
        this.logger.warn(
          `AI bond insight failed for ${bond.symbol}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    const fallback = buildBondFallbackInsight(bond, locale);
    return this.toGraphqlInsight(bond, fallback, AssetInsightSource.FALLBACK);
  }

  private toGraphqlInsight(
    bond: BondSnapshot,
    content: {
      overview: string;
      couponAndMaturity: string;
      yieldContext: string;
      rateSensitivity: string;
      risks: string[];
      questionsBeforeBuy: string[];
      liquidityNote?: string;
    },
    source: AssetInsightSource,
    provider?: string,
  ): BondInsight {
    return {
      symbol: bond.symbol,
      name: bond.name,
      source,
      provider,
      overview: content.overview,
      couponAndMaturity: content.couponAndMaturity,
      yieldContext: content.yieldContext,
      rateSensitivity: content.rateSensitivity,
      risks: content.risks,
      questionsBeforeBuy: content.questionsBeforeBuy,
      liquidityNote: content.liquidityNote,
    };
  }

  private toBondSnapshot(bond: Bond): BondSnapshot {
    return {
      symbol: bond.symbol,
      name: bond.name,
      lastPrice: bond.lastPrice,
      changePercent: bond.changePercent,
      lotSize: bond.lotSize,
      valueToday: bond.valueToday,
      couponPercent: bond.couponPercent,
      maturityDate: bond.maturityDate,
      yieldAtPrice: bond.yieldAtPrice,
      faceValue: bond.faceValue,
      currency: bond.currency,
      dataSource: bond.dataSource,
    };
  }
}
