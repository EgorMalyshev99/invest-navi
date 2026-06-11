import { Injectable, Logger } from '@nestjs/common';

import { AssetInsightSource } from '../ai/entities/asset-insight-source.enum';
import { applyWeeklyReviewCompliance, formatComplianceViolations } from '../ai/lib/compliance';
import { AiProviderFactory } from '../ai/providers/ai-provider.factory';
import { WeeklyMarketReviewsRepository } from '../database/repositories/weekly-market-reviews.repository';
import { Asset } from '../market/entities/asset.type';
import { MarketIndex } from '../market/entities/index.type';
import { Sector } from '../market/entities/sector.type';
import { MarketService } from '../market/market.service';
import {
  buildFallbackWeeklyReview,
  buildWeeklyReviewPrompt,
} from './lib/build-weekly-review-prompt';
import { parseWeeklyReviewJson } from './lib/parse-weekly-review';
import { WeeklyMarketReview } from './entities/weekly-market-review.type';

import type { AssetSnapshot, IndexSnapshot, SectorSnapshot, WeeklyReviewContent } from '@repo/api';

function getIsoWeekStart(date = new Date()): Date {
  const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = utc.getUTCDay() || 7;
  if (day !== 1) {
    utc.setUTCDate(utc.getUTCDate() - (day - 1));
  }
  utc.setUTCHours(0, 0, 0, 0);
  return utc;
}

@Injectable()
export class WeeklyReviewService {
  private readonly logger = new Logger(WeeklyReviewService.name);

  constructor(
    private readonly marketService: MarketService,
    private readonly reviewsRepository: WeeklyMarketReviewsRepository,
    private readonly aiFactory: AiProviderFactory,
  ) {}

  async getWeeklyReview(locale = 'ru'): Promise<WeeklyMarketReview> {
    const normalizedLocale = locale === 'en' ? 'en' : 'ru';
    const weekStart = getIsoWeekStart();

    const cached = await this.reviewsRepository.findByWeekAndLocale(weekStart, normalizedLocale);
    if (cached) {
      return this.toGraphqlReview(
        {
          weekStart: cached.weekStart,
          locale: cached.locale,
          content: cached.content as WeeklyReviewContent,
          source: cached.source,
          generatedAt: cached.generatedAt,
        },
        cached.source as AssetInsightSource,
      );
    }

    const [indices, sectors, assets] = await Promise.all([
      this.marketService.getIndices(),
      this.marketService.getSectors(),
      this.marketService.getAssets(20),
    ]);

    const review = await this.generateReview(
      indices.map((index) => this.toIndexSnapshot(index)),
      sectors.map((sector) => this.toSectorSnapshot(sector)),
      assets.map((asset) => this.toAssetSnapshot(asset)),
      normalizedLocale,
    );

    const saved = await this.reviewsRepository.upsertReview({
      weekStart,
      locale: normalizedLocale,
      content: {
        summary: review.summary,
        sectors: review.sectors,
        bondsAndRub: review.bondsAndRub,
        events: review.events,
        risksForNextWeek: review.risksForNextWeek,
      },
      source: review.source,
    });

    return this.toGraphqlReview(saved, review.source, review.provider);
  }

  private async generateReview(
    indices: IndexSnapshot[],
    sectors: SectorSnapshot[],
    topMovers: AssetSnapshot[],
    locale: string,
  ): Promise<WeeklyMarketReview> {
    const provider = this.aiFactory.getActiveProvider();

    if (provider) {
      try {
        const { system, user } = buildWeeklyReviewPrompt({
          indices,
          sectors,
          topMovers,
          locale,
        });
        const raw = await provider.complete([
          { role: 'system', content: system },
          { role: 'user', content: user },
        ]);
        const parsed = parseWeeklyReviewJson(raw);

        if (parsed) {
          const compliance = applyWeeklyReviewCompliance(parsed);
          if (compliance.ok && compliance.content) {
            return {
              weekStart: getIsoWeekStart(),
              locale,
              ...compliance.content,
              source: AssetInsightSource.AI,
              provider: provider.name,
              generatedAt: new Date(),
            };
          }
          this.logger.warn(
            `Weekly review compliance rejected: ${formatComplianceViolations(compliance.violations)}`,
          );
        } else {
          this.logger.warn('Weekly review parse failed');
        }
      } catch (error) {
        this.logger.warn(
          `Weekly review AI failed: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    const fallback = buildFallbackWeeklyReview(locale);
    return {
      weekStart: getIsoWeekStart(),
      locale,
      ...fallback,
      source: AssetInsightSource.FALLBACK,
      generatedAt: new Date(),
    };
  }

  private toGraphqlReview(
    record: {
      weekStart: Date;
      locale: string;
      content: {
        summary: string;
        sectors: string[];
        bondsAndRub: string;
        events: string[];
        risksForNextWeek: string[];
      };
      source: string;
      generatedAt: Date;
    },
    source: AssetInsightSource,
    provider?: string,
  ): WeeklyMarketReview {
    return {
      weekStart: record.weekStart,
      locale: record.locale,
      summary: record.content.summary,
      sectors: record.content.sectors,
      bondsAndRub: record.content.bondsAndRub,
      events: record.content.events,
      risksForNextWeek: record.content.risksForNextWeek,
      source,
      provider,
      generatedAt: record.generatedAt,
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

  private toSectorSnapshot(sector: Sector): SectorSnapshot {
    return {
      code: sector.code,
      name: sector.name,
      currentValue: sector.currentValue,
      changePercent: sector.changePercent,
      dataSource: sector.dataSource,
    };
  }
}
