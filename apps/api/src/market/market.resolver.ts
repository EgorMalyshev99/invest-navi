import { Args, Int, Query, Resolver } from '@nestjs/graphql';

import { Asset } from './entities/asset.type';
import { MarketIndex } from './entities/index.type';
import { MarketProvidersStatusType } from './entities/providers-status.type';
import { Sector } from './entities/sector.type';
import { MarketService } from './market.service';

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

  @Query(() => [MarketIndex], { description: 'Core MOEX indices (IMOEX, RGBI)' })
  indices(): Promise<MarketIndex[]> {
    return this.marketService.getIndices();
  }

  @Query(() => [Sector], { description: 'MOEX sector indices' })
  sectors(): Promise<Sector[]> {
    return this.marketService.getSectors();
  }

  @Query(() => MarketProvidersStatusType, {
    description: 'Which market data providers are active',
  })
  marketProviders(): MarketProvidersStatusType {
    return this.marketService.getProvidersStatus();
  }
}
