import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  clampMarketAssetsLimit,
  MarketDataSource,
  type AssetSnapshot,
  type MarketProvidersStatus,
} from '@repo/api';

import { Asset } from './entities/asset.type';
import { MarketIndex } from './entities/index.type';
import { MarketProvidersStatusType } from './entities/providers-status.type';
import { Sector } from './entities/sector.type';
import { MarketCacheService } from './market-cache.service';
import { MoexProvider } from './providers/moex.provider';
import { TinkoffProvider } from './providers/tinkoff.provider';

@Injectable()
export class MarketService {
  constructor(
    private readonly moex: MoexProvider,
    private readonly tinkoff: TinkoffProvider,
    private readonly cache: MarketCacheService,
  ) {}

  async getAssets(limit = 20): Promise<Asset[]> {
    const safeLimit = clampMarketAssetsLimit(limit);
    const cacheKey = `market:assets:${safeLimit}:${this.tinkoff.isConfigured()}`;
    const cached = this.cache.get<Asset[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const moexAssets = await this.moex.getAssets(safeLimit);
    const enriched = this.tinkoff.isConfigured()
      ? await this.tinkoff.enrichAssets(moexAssets)
      : moexAssets;

    const result = enriched.map((item) => this.toAsset(item));
    this.cache.set(cacheKey, result);
    return result;
  }

  async getAsset(symbol: string): Promise<Asset> {
    const normalizedSymbol = this.normalizeSymbol(symbol);
    const cacheKey = `market:asset:${normalizedSymbol}`;
    const cached = this.cache.get<Asset>(cacheKey);
    if (cached) {
      return cached;
    }

    const moexAsset = await this.moex.getAssetBySymbol(normalizedSymbol);
    const tinkoffAsset = this.tinkoff.isConfigured()
      ? await this.tinkoff.findShareAsset(normalizedSymbol)
      : null;

    const merged = this.mergeAssetSnapshots(moexAsset, tinkoffAsset);
    if (!merged) {
      throw new NotFoundException(`Asset "${normalizedSymbol}" not found`);
    }

    const result = this.toAsset(merged);
    this.cache.set(cacheKey, result);
    return result;
  }

  async getIndices(): Promise<MarketIndex[]> {
    const indices = await this.moex.getIndices();
    return indices.map((item) => ({
      code: item.code,
      name: item.name,
      currentValue: item.currentValue,
      changePercent: item.changePercent,
      valueToday: item.valueToday,
      dataSource: item.dataSource,
    }));
  }

  async getSectors(): Promise<Sector[]> {
    const sectors = await this.moex.getSectors();
    return sectors.map((item) => ({
      code: item.code,
      name: item.name,
      currentValue: item.currentValue,
      changePercent: item.changePercent,
      dataSource: item.dataSource,
    }));
  }

  getProvidersStatus(): MarketProvidersStatusType {
    const status: MarketProvidersStatus = {
      moex: this.moex.isConfigured(),
      tinkoff: this.tinkoff.isConfigured(),
      cacheTtlSeconds: this.cache.ttlSeconds,
    };
    return status;
  }

  private mergeAssetSnapshots(
    moex: AssetSnapshot | null,
    tinkoff: AssetSnapshot | null,
  ): AssetSnapshot | null {
    if (!moex && !tinkoff) {
      return null;
    }
    if (!moex) {
      return tinkoff;
    }
    if (!tinkoff) {
      return moex;
    }

    return {
      ...moex,
      name: tinkoff.name || moex.name,
      lastPrice: tinkoff.lastPrice > 0 ? tinkoff.lastPrice : moex.lastPrice,
      lotSize: tinkoff.lotSize > 0 ? tinkoff.lotSize : moex.lotSize,
      currency: tinkoff.currency,
      figi: tinkoff.figi,
      sector: tinkoff.sector,
      dividendYieldPercent: tinkoff.dividendYieldPercent,
      dataSource: MarketDataSource.Merged,
    };
  }

  private normalizeSymbol(symbol: string): string {
    const normalized = symbol.trim().toUpperCase();
    if (!/^[A-Z0-9.-]{1,20}$/.test(normalized)) {
      throw new BadRequestException('Invalid asset symbol');
    }
    return normalized;
  }

  private toAsset(snapshot: AssetSnapshot): Asset {
    return {
      symbol: snapshot.symbol,
      name: snapshot.name,
      lastPrice: snapshot.lastPrice,
      changePercent: snapshot.changePercent,
      lotSize: snapshot.lotSize,
      valueToday: snapshot.valueToday,
      instrumentType: snapshot.instrumentType,
      currency: snapshot.currency,
      figi: snapshot.figi,
      sector: snapshot.sector,
      dividendYieldPercent: snapshot.dividendYieldPercent,
      dataSource: snapshot.dataSource,
    };
  }
}
