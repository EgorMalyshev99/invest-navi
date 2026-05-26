import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';

import { AssetInsightService } from './asset-insight.service';
import { AssetInsight } from './entities/asset-insight.type';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver()
export class AiResolver {
  constructor(private readonly assetInsightService: AssetInsightService) {}

  @UseGuards(GqlAuthGuard)
  @Throttle({ default: { limit: 15, ttl: 60_000 } })
  @Query(() => AssetInsight, { name: 'assetInsight' })
  assetInsight(
    @Args('symbol') symbol: string,
    @Args('locale', { nullable: true, defaultValue: 'ru' }) locale: string,
  ): Promise<AssetInsight> {
    return this.assetInsightService.getInsight(symbol, locale);
  }
}
