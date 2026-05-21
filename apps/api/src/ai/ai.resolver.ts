import { Args, Query, Resolver } from '@nestjs/graphql';

import { AssetInsightService } from './asset-insight.service';
import { AssetInsight } from './entities/asset-insight.type';

@Resolver()
export class AiResolver {
  constructor(private readonly assetInsightService: AssetInsightService) {}

  @Query(() => AssetInsight, { name: 'assetInsight' })
  assetInsight(
    @Args('symbol') symbol: string,
    @Args('locale', { nullable: true, defaultValue: 'ru' }) locale: string,
  ): Promise<AssetInsight> {
    return this.assetInsightService.getInsight(symbol, locale);
  }
}
