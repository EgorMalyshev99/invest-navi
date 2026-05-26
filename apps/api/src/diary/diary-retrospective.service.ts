import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { AssetInsightSource } from '../ai/entities/asset-insight-source.enum';
import { buildDiaryRetroPrompt, buildFallbackRetro } from '../ai/lib/build-retro-prompt';
import { AiProviderFactory } from '../ai/providers/ai-provider.factory';
import { DiaryEntriesRepository } from '../database/repositories/diary-entries.repository';
import { MarketService } from '../market/market.service';
import { DiaryRetrospective } from './entities/diary-retrospective.type';

function parseNumeric(value: string | null | undefined): number | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function percentChange(from: number, to: number): number {
  if (from === 0) {
    return 0;
  }
  return ((to - from) / from) * 100;
}

@Injectable()
export class DiaryRetrospectiveService {
  private readonly logger = new Logger(DiaryRetrospectiveService.name);

  constructor(
    private readonly diaryEntriesRepository: DiaryEntriesRepository,
    private readonly marketService: MarketService,
    private readonly aiFactory: AiProviderFactory,
  ) {}

  async getRetrospective(
    userId: string,
    entryId: string,
    locale = 'ru',
  ): Promise<DiaryRetrospective> {
    const row = await this.diaryEntriesRepository.findByIdForUser(entryId, userId);
    if (!row) {
      throw new NotFoundException('Diary entry not found');
    }

    const normalizedLocale = locale === 'en' ? 'en' : 'ru';
    const now = new Date();
    const reviewAt = row.reviewAt ?? row.createdAt;
    const isReady = now >= reviewAt;
    const daysElapsed = Math.max(
      0,
      Math.floor((now.getTime() - row.createdAt.getTime()) / (1000 * 60 * 60 * 24)),
    );

    const snapshotPrice = parseNumeric(row.snapshotPrice);
    const snapshotIndex = parseNumeric(row.snapshotIndexValue);

    let priceChangePercent: number | undefined;
    let indexChangePercent: number | undefined;

    if (snapshotPrice !== undefined) {
      try {
        const asset = await this.marketService.getAsset(row.assetSymbol);
        priceChangePercent = percentChange(snapshotPrice, asset.lastPrice);
      } catch {
        priceChangePercent = undefined;
      }
    }

    if (snapshotIndex !== undefined) {
      try {
        const indices = await this.marketService.getIndices();
        const imoex = indices.find((index) => index.code === 'IMOEX');
        if (imoex) {
          indexChangePercent = percentChange(snapshotIndex, imoex.currentValue);
        }
      } catch {
        indexChangePercent = undefined;
      }
    }

    const context = {
      assetSymbol: row.assetSymbol,
      action: row.action,
      horizon: row.horizon,
      rationale: row.rationale,
      successCriteria: row.successCriteria,
      failureCriteria: row.failureCriteria,
      daysElapsed,
      priceChangePercent,
      indexChangePercent,
      locale: normalizedLocale,
    };

    if (!isReady) {
      const pending = buildFallbackRetro(context);
      return {
        entryId: row.id,
        isReady: false,
        daysElapsed,
        priceChangePercent,
        indexChangePercent,
        summary:
          normalizedLocale === 'en'
            ? `Retrospective unlocks on ${reviewAt.toISOString().slice(0, 10)}. You can still review numbers below as context only.`
            : `Ретроспектива откроется ${reviewAt.toISOString().slice(0, 10)}. Пока можно смотреть цифры ниже только как контекст.`,
        questions: pending.questions,
        source: AssetInsightSource.FALLBACK,
      };
    }

    const provider = this.aiFactory.getActiveProvider();
    if (provider) {
      try {
        const { system, user } = buildDiaryRetroPrompt(context);
        const raw = await provider.complete([
          { role: 'system', content: system },
          { role: 'user', content: user },
        ]);
        const parsed = this.parseRetroJson(raw);
        if (parsed) {
          return {
            entryId: row.id,
            isReady: true,
            daysElapsed,
            priceChangePercent,
            indexChangePercent,
            summary: parsed.summary,
            questions: parsed.questions,
            source: AssetInsightSource.AI,
            provider: provider.name,
          };
        }
      } catch (error) {
        this.logger.warn(
          `Diary retro AI failed: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    const fallback = buildFallbackRetro(context);
    return {
      entryId: row.id,
      isReady: true,
      daysElapsed,
      priceChangePercent,
      indexChangePercent,
      summary: fallback.summary,
      questions: fallback.questions,
      source: AssetInsightSource.FALLBACK,
    };
  }

  private parseRetroJson(raw: string): { summary: string; questions: string[] } | null {
    const trimmed = raw.trim();
    const jsonStart = trimmed.indexOf('{');
    const jsonEnd = trimmed.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
      return null;
    }
    try {
      const parsed = JSON.parse(trimmed.slice(jsonStart, jsonEnd + 1)) as Record<string, unknown>;
      const summary = typeof parsed.summary === 'string' ? parsed.summary.trim() : '';
      if (!summary) {
        return null;
      }
      const questions = Array.isArray(parsed.questions)
        ? parsed.questions.filter((q): q is string => typeof q === 'string' && q.trim().length > 0)
        : [];
      return { summary, questions };
    } catch {
      return null;
    }
  }
}
