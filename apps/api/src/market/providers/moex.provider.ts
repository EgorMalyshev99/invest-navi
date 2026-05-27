import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  InstrumentType,
  MarketDataSource,
  type AssetSnapshot,
  type BondSnapshot,
  type FxRateSnapshot,
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

const FX_MOEX_PAIRS: Array<{ code: string; secId: string; name: string }> = [
  { code: 'USD', secId: 'USD000UTSTOM', name: 'USD/RUB' },
  { code: 'EUR', secId: 'EUR_RUB__TOM', name: 'EUR/RUB' },
  { code: 'CNY', secId: 'CNYRUB_TOM', name: 'CNY/RUB' },
  { code: 'RUB', secId: 'USD000UTSTOM', name: 'RUB/USD' },
];

const FX_MOEX_SEC_IDS = new Set(FX_MOEX_PAIRS.map((pair) => pair.secId));

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

  async getBonds(limit = 20): Promise<BondSnapshot[]> {
    const cacheKey = `moex:bonds:${limit}`;
    const cached = this.cache.get<BondSnapshot[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const payload = await this.fetchMoex<{
        securities: MoexTable;
        marketdata: MoexTable;
      }>(
        '/engines/stock/markets/bonds/boards/TQOB/securities.json?iss.meta=off&iss.only=securities,marketdata&securities.columns=SECID,SHORTNAME,COUPONPERCENT,MATDATE,PREVPRICE,LOTSIZE,FACEUNIT,FACEVALUE&marketdata.columns=SECID,LAST,YIELDATWAPRICE,VALTODAY',
      );

      const bonds = this.mapBondSnapshots(payload);
      bonds.sort((a, b) => b.valueToday - a.valueToday);
      const sliced = bonds.slice(0, Math.max(1, Math.min(limit, 100)));
      this.cache.set(cacheKey, sliced);
      return sliced;
    } catch (error) {
      this.logger.warn(`MOEX bonds failed: ${this.toErrorMessage(error)}`);
      const fallback = this.getFallbackBonds();
      this.cache.set(cacheKey, fallback);
      return fallback;
    }
  }

  async getBondBySymbol(symbol: string): Promise<BondSnapshot | null> {
    const normalized = symbol.trim().toUpperCase();
    const cacheKey = `moex:bond:${normalized}`;
    const cached = this.cache.get<BondSnapshot>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const payload = await this.fetchMoex<{
        securities: MoexTable;
        marketdata: MoexTable;
      }>(
        `/engines/stock/markets/bonds/boards/TQOB/securities/${normalized}.json?iss.meta=off&iss.only=securities,marketdata&marketdata.columns=SECID,LAST,YIELDATWAPRICE,VALTODAY`,
      );

      const bonds = this.mapBondSnapshots(payload);
      const bond = bonds[0] ?? null;
      if (bond) {
        this.cache.set(cacheKey, bond);
      }
      return bond;
    } catch (error) {
      this.logger.warn(`MOEX bond ${normalized} failed: ${this.toErrorMessage(error)}`);
      return null;
    }
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

  async getFxRates(): Promise<FxRateSnapshot[]> {
    const cacheKey = 'moex:fx';
    const cached = this.cache.get<FxRateSnapshot[]>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const payload = await this.fetchMoex<{
        securities: MoexTable;
        marketdata: MoexTable;
      }>(
        '/engines/currency/markets/selt/boards/CETS/securities.json?iss.meta=off&iss.only=securities,marketdata&securities.columns=SECID,SHORTNAME,PREVPRICE&marketdata.columns=SECID,LAST,VALTODAY',
      );

      const securities = this.toRowMap(payload.securities);
      const marketData = this.toRowMap(payload.marketdata);

      const bySecId = new Map<string, FxRateSnapshot>();

      for (const marketRow of marketData.values()) {
        const secId = String(marketRow.SECID ?? '').toUpperCase();
        if (!FX_MOEX_SEC_IDS.has(secId)) {
          continue;
        }

        const security = securities.get(secId);
        const lastPrice = this.toNumber(marketRow.LAST);
        const prevPrice = this.toNumber(security?.PREVPRICE);
        const currentValue = lastPrice > 0 ? lastPrice : prevPrice;
        const changePercent =
          prevPrice > 0 && currentValue > 0
            ? ((currentValue - prevPrice) / prevPrice) * 100
            : 0;

        bySecId.set(secId, {
          code: secId,
          name: String(security?.SHORTNAME ?? secId),
          currentValue,
          changePercent,
          valueToday: this.toNumber(marketRow.VALTODAY),
          dataSource: MarketDataSource.Moex,
        });
      }

      const rates: FxRateSnapshot[] = [];

      for (const pair of FX_MOEX_PAIRS) {
        const row = bySecId.get(pair.secId);
        if (!row || row.currentValue <= 0) {
          continue;
        }

        if (pair.code === 'RUB') {
          rates.push({
            code: pair.code,
            name: pair.name,
            currentValue: 1 / row.currentValue,
            changePercent: row.changePercent !== 0 ? -row.changePercent : 0,
            valueToday: row.valueToday,
            dataSource: MarketDataSource.Moex,
          });
          continue;
        }

        rates.push({
          code: pair.code,
          name: pair.name,
          currentValue: row.currentValue,
          changePercent: row.changePercent,
          valueToday: row.valueToday,
          dataSource: MarketDataSource.Moex,
        });
      }

      const result = rates.length > 0 ? rates : this.getFallbackFxRates();
      this.cache.set(cacheKey, result);
      return result;
    } catch (error) {
      this.logger.warn(`MOEX FX failed: ${this.toErrorMessage(error)}`);
      const fallback = this.getFallbackFxRates();
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

  private mapBondSnapshots(payload: {
    securities: MoexTable;
    marketdata: MoexTable;
  }): BondSnapshot[] {
    const securities = this.toRowMap(payload.securities);
    const marketData = this.toRowMap(payload.marketdata);
    const bonds: BondSnapshot[] = [];

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

      const maturityRaw = security?.MATDATE;
      const maturityDate =
        typeof maturityRaw === 'string' && maturityRaw.length >= 10
          ? maturityRaw.slice(0, 10)
          : undefined;

      bonds.push({
        symbol,
        name: String(security?.SHORTNAME ?? symbol),
        lastPrice,
        changePercent: prevPrice ? ((lastPrice - prevPrice) / prevPrice) * 100 : 0,
        lotSize: lotSize || 1,
        valueToday,
        couponPercent: this.toOptionalNumber(security?.COUPONPERCENT),
        maturityDate,
        yieldAtPrice: this.toOptionalNumber(marketRow.YIELDATWAPRICE),
        faceValue: this.toOptionalNumber(security?.FACEVALUE),
        currency: this.mapFaceUnit(security?.FACEUNIT),
        dataSource: MarketDataSource.Moex,
      });
    }

    return bonds;
  }

  private mapFaceUnit(value: unknown): string | undefined {
    const unit = String(value ?? '').toUpperCase();
    if (unit === 'SUR' || unit === 'RUB') {
      return 'RUB';
    }
    if (unit === 'CNY') {
      return 'CNY';
    }
    if (unit === 'USD') {
      return 'USD';
    }
    return unit || undefined;
  }

  private toOptionalNumber(value: unknown): number | undefined {
    const parsed = this.toNumber(value);
    return parsed > 0 ? parsed : undefined;
  }

  private getFallbackBonds(): BondSnapshot[] {
    return [
      {
        symbol: 'SU26207RMFS9',
        name: 'ОФЗ 26207',
        lastPrice: 96.9,
        changePercent: 0,
        lotSize: 1,
        valueToday: 0,
        couponPercent: 8.15,
        maturityDate: '2027-02-03',
        yieldAtPrice: 13.3,
        faceValue: 1000,
        currency: 'RUB',
        dataSource: MarketDataSource.Moex,
      },
    ];
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

  private getFallbackFxRates(): FxRateSnapshot[] {
    return [
      {
        code: 'USD',
        name: 'USD/RUB',
        currentValue: 0,
        changePercent: 0,
        valueToday: 0,
        dataSource: MarketDataSource.Moex,
      },
      {
        code: 'EUR',
        name: 'EUR/RUB',
        currentValue: 0,
        changePercent: 0,
        valueToday: 0,
        dataSource: MarketDataSource.Moex,
      },
      {
        code: 'CNY',
        name: 'CNY/RUB',
        currentValue: 0,
        changePercent: 0,
        valueToday: 0,
        dataSource: MarketDataSource.Moex,
      },
      {
        code: 'RUB',
        name: 'RUB/USD',
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
