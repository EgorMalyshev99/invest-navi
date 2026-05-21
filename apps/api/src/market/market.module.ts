import { Module } from '@nestjs/common';

import './register-enums';
import { MarketCacheService } from './market-cache.service';
import { MarketResolver } from './market.resolver';
import { MarketService } from './market.service';
import { MoexProvider } from './providers/moex.provider';
import { TinkoffProvider } from './providers/tinkoff.provider';

@Module({
  providers: [MarketCacheService, MoexProvider, TinkoffProvider, MarketService, MarketResolver],
  exports: [MarketService, MarketCacheService],
})
export class MarketModule {}
