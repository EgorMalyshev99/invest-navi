import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface CacheEntry<T> {
  expiresAt: number;
  value: T;
}

@Injectable()
export class MarketCacheService {
  private readonly store = new Map<string, CacheEntry<unknown>>();

  constructor(private readonly configService: ConfigService) {}

  get ttlMs(): number {
    const seconds = Number(this.configService.get<string>('MARKET_CACHE_TTL_SECONDS') ?? 60);
    return Math.max(15, Math.min(seconds, 300)) * 1000;
  }

  get ttlSeconds(): number {
    return Math.round(this.ttlMs / 1000);
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) {
      return null;
    }
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value as T;
  }

  set<T>(key: string, value: T): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs,
    });
  }
}
