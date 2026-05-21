import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InstrumentType, MarketDataSource, type AssetSnapshot } from '@repo/api';

import { quotationToNumber, type QuotationLike } from '../lib/quotation';
import { MarketCacheService } from '../market-cache.service';

const DEFAULT_TINKOFF_API_URL = 'https://invest-public-api.tinkoff.ru/rest';
const TINKOFF_API_PREFIX = 'tinkoff.public.invest.api.contract.v1';
const MOEX_EXCHANGES = new Set(['MOEX', 'MOEX_EVENING_WEEKEND']);

interface TinkoffShareInstrument {
  figi: string;
  ticker: string;
  classCode: string;
  name: string;
  currency: string;
  lot: number;
  sector?: string;
  exchange: string;
  dividendYield?: QuotationLike;
}

interface TinkoffLastPrice {
  figi: string;
  price?: QuotationLike;
}

@Injectable()
export class TinkoffProvider {
  private readonly logger = new Logger(TinkoffProvider.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly cache: MarketCacheService,
  ) {}

  isConfigured(): boolean {
    const token = this.configService.get<string>('TINKOFF_INVEST_TOKEN');
    return Boolean(token?.trim());
  }

  async enrichAssets(assets: AssetSnapshot[]): Promise<AssetSnapshot[]> {
    if (!this.isConfigured() || assets.length === 0) {
      return assets;
    }

    try {
      const sharesByTicker = await this.getMoexSharesByTicker();
      const figis = assets
        .map((asset) => sharesByTicker.get(asset.symbol)?.figi)
        .filter((figi): figi is string => Boolean(figi));

      const lastPrices = await this.getLastPricesByFigi(figis);

      return assets.map((asset) => {
        const instrument = sharesByTicker.get(asset.symbol);
        if (!instrument) {
          return asset;
        }

        const tinkoffPrice = lastPrices.get(instrument.figi);
        const dividendYieldPercent = quotationToNumber(instrument.dividendYield) * 100;

        return {
          ...asset,
          name: instrument.name || asset.name,
          lastPrice: tinkoffPrice && tinkoffPrice > 0 ? tinkoffPrice : asset.lastPrice,
          lotSize: instrument.lot > 0 ? instrument.lot : asset.lotSize,
          currency: instrument.currency,
          figi: instrument.figi,
          sector: instrument.sector,
          dividendYieldPercent: dividendYieldPercent > 0 ? dividendYieldPercent : undefined,
          dataSource: MarketDataSource.Merged,
        } satisfies AssetSnapshot;
      });
    } catch (error) {
      this.logger.warn(`Tinkoff enrich failed: ${this.toErrorMessage(error)}`);
      return assets;
    }
  }

  async findShareAsset(symbol: string): Promise<AssetSnapshot | null> {
    if (!this.isConfigured()) {
      return null;
    }

    const normalized = symbol.trim().toUpperCase();
    const cacheKey = `tinkoff:asset:${normalized}`;
    const cached = this.cache.get<AssetSnapshot>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await this.post<{ instruments: TinkoffShareInstrument[] }>(
        'InstrumentsService/FindInstrument',
        {
          query: normalized,
          instrumentKind: 'INSTRUMENT_TYPE_SHARE',
          apiTradeAvailableFlag: true,
        },
      );

      const instrument = response.instruments?.find(
        (item) =>
          item.ticker.toUpperCase() === normalized &&
          MOEX_EXCHANGES.has(item.exchange.toUpperCase()),
      );

      if (!instrument) {
        return null;
      }

      const lastPrices = await this.getLastPricesByFigi([instrument.figi]);
      const lastPrice = lastPrices.get(instrument.figi) ?? 0;
      const dividendYieldPercent = quotationToNumber(instrument.dividendYield) * 100;

      const asset: AssetSnapshot = {
        symbol: normalized,
        name: instrument.name,
        lastPrice,
        changePercent: 0,
        lotSize: instrument.lot || 1,
        valueToday: 0,
        instrumentType: InstrumentType.Share,
        currency: instrument.currency,
        figi: instrument.figi,
        sector: instrument.sector,
        dividendYieldPercent: dividendYieldPercent > 0 ? dividendYieldPercent : undefined,
        dataSource: MarketDataSource.Tinkoff,
      };

      this.cache.set(cacheKey, asset);
      return asset;
    } catch (error) {
      this.logger.warn(`Tinkoff find ${normalized} failed: ${this.toErrorMessage(error)}`);
      return null;
    }
  }

  private async getMoexSharesByTicker(): Promise<Map<string, TinkoffShareInstrument>> {
    const cacheKey = 'tinkoff:moex-shares-map';
    const cached = this.cache.get<Map<string, TinkoffShareInstrument>>(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await this.post<{ instruments: TinkoffShareInstrument[] }>(
      'InstrumentsService/Shares',
      { instrumentStatus: 'INSTRUMENT_STATUS_BASE' },
    );

    const map = new Map<string, TinkoffShareInstrument>();
    for (const instrument of response.instruments ?? []) {
      if (!MOEX_EXCHANGES.has(instrument.exchange.toUpperCase())) {
        continue;
      }
      map.set(instrument.ticker.toUpperCase(), instrument);
    }

    this.cache.set(cacheKey, map);
    return map;
  }

  private async getLastPricesByFigi(figis: string[]): Promise<Map<string, number>> {
    const uniqueFigis = [...new Set(figis)];
    if (uniqueFigis.length === 0) {
      return new Map();
    }

    const cacheKey = `tinkoff:last:${uniqueFigis.sort().join(',')}`;
    const cached = this.cache.get<Map<string, number>>(cacheKey);
    if (cached) {
      return cached;
    }

    const response = await this.post<{ lastPrices: TinkoffLastPrice[] }>(
      'MarketDataService/GetLastPrices',
      { figi: uniqueFigis },
    );

    const map = new Map<string, number>();
    for (const item of response.lastPrices ?? []) {
      const price = quotationToNumber(item.price);
      if (price > 0) {
        map.set(item.figi, price);
      }
    }

    this.cache.set(cacheKey, map);
    return map;
  }

  private get apiBaseUrl(): string {
    return (
      this.configService.get<string>('TINKOFF_INVEST_API_URL')?.replace(/\/$/, '') ??
      DEFAULT_TINKOFF_API_URL
    );
  }

  private get token(): string | undefined {
    return this.configService.get<string>('TINKOFF_INVEST_TOKEN')?.trim();
  }

  private async post<T>(method: string, body: Record<string, unknown>): Promise<T> {
    const token = this.token;
    if (!token) {
      throw new Error('TINKOFF_INVEST_TOKEN is not configured');
    }

    const response = await fetch(`${this.apiBaseUrl}/${TINKOFF_API_PREFIX}.${method}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(12_000),
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`Tinkoff API ${response.status}: ${details.slice(0, 200)}`);
    }

    return (await response.json()) as T;
  }

  private toErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }
}
