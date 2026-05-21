import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  InstrumentType,
  MarketDataSource,
  type AssetSnapshot,
  type IndexSnapshot,
  type SectorSnapshot,
} from '@repo/api';

import { MarketCacheService } from '../market-cache.service';

interface MoexTable {
  columns: string[];
  data: Array<Array<string | number | null>>;
}

const DEFAULT_MOEX_ISS_BASE_URL = 'https://iss.moex.com/iss';
const CORE_INDEX_CODES = new Set(['IMOEX', 'RGBI']);
const SECTOR_CODES = new Set(['MOEXCH', 'MOEXCN', 'MOEXFN', 'MOEXMM', 'MOEXOG', 'MOEXTL']);

@Injectable()
export class MoexProvider {
  private readonly logger = new Logger(MoexProvider.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly cache: MarketCacheService,
  ) {}

  isConfigured(): boolean {
    return true;
  }

  async getAssets(limit = 20): Promise<AssetSnapshot[]> {
    const cacheKey = `moex:assets:${limit}`;
    const cached = this.cache.get<AssetSnapshot[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const payload = await this.fetchMoex<{
        securities: MoexTable;
        marketdata: MoexTable;
      }>(
        '/engines/stock/markets/shares/boards/TQBR/securities.json?iss.meta=off&iss.only=securities,marketdata&securities.columns=SECID,SHORTNAME,PREVPRICE,LOTSIZE&marketdata.columns=SECID,LAST,VALTODAY',
      );

      const securities = this.toRowMap(payload.securities);
      const marketData = this.toRowMap(payload.marketdata);

      const assets: AssetSnapshot[] = [];

      for (const marketRow of marketData.values()) {
        const symbol = String(marketRow.SECID ?? '').toUpperCase();
        const security = securities.get(symbol);
        const lastPrice = this.toNumber(marketRow.LAST);
        const prevPrice = this.toNumber(security?.PREVPRICE);
        const valueToday = this.toNumber(marketRow.VALTODAY);
        const lotSize = Math.round(this.toNumber(security?.LOTSIZE));

        if (!symbol || !lastPrice) {
          continue;
        }

        assets.push({
          symbol,
          name: String(security?.SHORTNAME ?? symbol),
          lastPrice,
          changePercent: prevPrice ? ((lastPrice - prevPrice) / prevPrice) * 100 : 0,
          lotSize: lotSize || 1,
          valueToday,
          instrumentType: InstrumentType.Share,
          dataSource: MarketDataSource.Moex,
        });
      }

      assets.sort((a, b) => b.valueToday - a.valueToday);
      const sliced = assets.slice(0, Math.max(1, Math.min(limit, 100)));

      this.cache.set(cacheKey, sliced);
      return sliced;
    } catch (error) {
      this.logger.warn(`MOEX assets failed: ${this.toErrorMessage(error)}`);
      const fallback = this.getFallbackAssets();
      this.cache.set(cacheKey, fallback);
      return fallback;
    }
  }

  async getAssetBySymbol(symbol: string): Promise<AssetSnapshot | null> {
    const normalized = symbol.trim().toUpperCase();
    const assets = await this.getAssets(100);
    return assets.find((item) => item.symbol === normalized) ?? null;
  }

  async getIndices(): Promise<IndexSnapshot[]> {
    const cacheKey = 'moex:indices';
    const cached = this.cache.get<IndexSnapshot[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const payload = await this.fetchMoex<{
        securities: MoexTable;
        marketdata: MoexTable;
      }>(
        '/engines/stock/markets/index/boards/SNDX/securities.json?iss.meta=off&iss.only=securities,marketdata&securities.columns=SECID,SHORTNAME&marketdata.columns=SECID,CURRENTVALUE,LASTCHANGEPRC,VALTODAY',
      );

      const securities = this.toRowMap(payload.securities);
      const marketData = this.toRowMap(payload.marketdata);

      const indices: IndexSnapshot[] = [];

      for (const marketRow of marketData.values()) {
        const code = String(marketRow.SECID ?? '');
        if (!CORE_INDEX_CODES.has(code)) {
          continue;
        }

        const security = securities.get(code);

        indices.push({
          code,
          name: String(security?.SHORTNAME ?? code),
          currentValue: this.toNumber(marketRow.CURRENTVALUE),
          changePercent: this.toNumber(marketRow.LASTCHANGEPRC),
          valueToday: this.toNumber(marketRow.VALTODAY),
          dataSource: MarketDataSource.Moex,
        });
      }

      this.cache.set(cacheKey, indices);
      return indices;
    } catch (error) {
      this.logger.warn(`MOEX indices failed: ${this.toErrorMessage(error)}`);
      const fallback = this.getFallbackIndices();
      this.cache.set(cacheKey, fallback);
      return fallback;
    }
  }

  async getSectors(): Promise<SectorSnapshot[]> {
    const cacheKey = 'moex:sectors';
    const cached = this.cache.get<SectorSnapshot[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const payload = await this.fetchMoex<{
        securities: MoexTable;
        marketdata: MoexTable;
      }>(
        '/engines/stock/markets/index/boards/SNDX/securities.json?iss.meta=off&iss.only=securities,marketdata&securities.columns=SECID,SHORTNAME&marketdata.columns=SECID,CURRENTVALUE,LASTCHANGEPRC',
      );

      const securities = this.toRowMap(payload.securities);
      const marketData = this.toRowMap(payload.marketdata);

      const sectors: SectorSnapshot[] = [];

      for (const marketRow of marketData.values()) {
        const code = String(marketRow.SECID ?? '');
        if (!SECTOR_CODES.has(code)) {
          continue;
        }

        const security = securities.get(code);

        sectors.push({
          code,
          name: String(security?.SHORTNAME ?? code),
          currentValue: this.toNumber(marketRow.CURRENTVALUE),
          changePercent: this.toNumber(marketRow.LASTCHANGEPRC),
          dataSource: MarketDataSource.Moex,
        });
      }

      this.cache.set(cacheKey, sectors);
      return sectors;
    } catch (error) {
      this.logger.warn(`MOEX sectors failed: ${this.toErrorMessage(error)}`);
      const fallback = this.getFallbackSectors();
      this.cache.set(cacheKey, fallback);
      return fallback;
    }
  }

  private get baseUrl(): string {
    return this.configService.get<string>('MOEX_ISS_BASE_URL') ?? DEFAULT_MOEX_ISS_BASE_URL;
  }

  private async fetchMoex<T>(path: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      throw new Error(`MOEX ISS responded with ${response.status}`);
    }

    return (await response.json()) as T;
  }

  private toRowMap(table: MoexTable): Map<string, Record<string, string | number | null>> {
    const rows = table.data.map((values) =>
      table.columns.reduce<Record<string, string | number | null>>((acc, column, index) => {
        acc[column] = values[index] ?? null;
        return acc;
      }, {}),
    );

    return new Map(rows.map((row) => [String(row.SECID ?? '').toUpperCase(), row]));
  }

  private toNumber(value: unknown): number {
    if (typeof value === 'number') {
      return Number.isFinite(value) ? value : 0;
    }
    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  }

  private toErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }

  private getFallbackAssets(): AssetSnapshot[] {
    return [
      {
        symbol: 'SBER',
        name: 'Сбербанк',
        lastPrice: 322.5,
        changePercent: 0,
        lotSize: 10,
        valueToday: 0,
        instrumentType: InstrumentType.Share,
        dataSource: MarketDataSource.Moex,
      },
      {
        symbol: 'GAZP',
        name: 'Газпром',
        lastPrice: 158.2,
        changePercent: 0,
        lotSize: 10,
        valueToday: 0,
        instrumentType: InstrumentType.Share,
        dataSource: MarketDataSource.Moex,
      },
    ];
  }

  private getFallbackIndices(): IndexSnapshot[] {
    return [
      {
        code: 'IMOEX',
        name: 'Индекс МосБиржи',
        currentValue: 0,
        changePercent: 0,
        valueToday: 0,
        dataSource: MarketDataSource.Moex,
      },
      {
        code: 'RGBI',
        name: 'Индекс гос. облигаций',
        currentValue: 0,
        changePercent: 0,
        valueToday: 0,
        dataSource: MarketDataSource.Moex,
      },
    ];
  }

  private getFallbackSectors(): SectorSnapshot[] {
    return [
      {
        code: 'MOEXFN',
        name: 'Финансовый сектор',
        currentValue: 0,
        changePercent: 0,
        dataSource: MarketDataSource.Moex,
      },
      {
        code: 'MOEXOG',
        name: 'Нефть и газ',
        currentValue: 0,
        changePercent: 0,
        dataSource: MarketDataSource.Moex,
      },
    ];
  }
}
