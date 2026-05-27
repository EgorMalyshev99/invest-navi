import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { SkipThrottle } from '@nestjs/throttler';

import { Asset } from './entities/asset.type';
import { Bond } from './entities/bond.type';
import { FxRate } from './entities/fx-rate.type';
import { MarketIndex } from './entities/index.type';
import { MarketProvidersStatusType } from './entities/providers-status.type';
import { Sector } from './entities/sector.type';
import { MarketService } from './market.service';

@SkipThrottle()
@Resolver()
export class MarketResolver {
  constructor(private readonly marketService: MarketService) {}

  @Query(() => [Asset], {
    description: 'Top MOEX assets by traded value (Tinkoff enrichment when configured)',
  })
  assets(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 20 }) limit: number,
  ): Promise<Asset[]> {
    return this.marketService.getAssets(limit);
  }

  @Query(() => Asset, { description: 'Single share by ticker (MOEX + Tinkoff when configured)' })
  asset(@Args('symbol') symbol: string): Promise<Asset> {
    return this.marketService.getAsset(symbol);
  }

  @Query(() => [Bond], { description: 'Top MOEX bonds by traded value (TQOB board)' })
  bonds(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 20 }) limit: number,
  ): Promise<Bond[]> {
    return this.marketService.getBonds(limit);
  }

  @Query(() => Bond, { description: 'Single bond by MOEX security id' })
  bond(@Args('symbol') symbol: string): Promise<Bond> {
    return this.marketService.getBond(symbol);
  }

  @Query(() => [MarketIndex], { description: 'Core MOEX indices (IMOEX, RGBI)' })
  indices(): Promise<MarketIndex[]> {
    return this.marketService.getIndices();
  }

  @Query(() => [Sector], { description: 'MOEX sector indices' })
  sectors(): Promise<Sector[]> {
    return this.marketService.getSectors();
  }

  @Query(() => [FxRate], {
    description: 'MOEX FX pairs vs RUB (USD, EUR, CNY) and RUB/USD reference',
  })
  fxRates(): Promise<FxRate[]> {
    return this.marketService.getFxRates();
  }

  @Query(() => MarketProvidersStatusType, {
    description: 'Which market data providers are active',
  })
  marketProviders(): MarketProvidersStatusType {
    return this.marketService.getProvidersStatus();
  }
}
