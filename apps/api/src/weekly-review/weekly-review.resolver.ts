import { Args, Query, Resolver } from '@nestjs/graphql';
import { SkipThrottle } from '@nestjs/throttler';

import { WeeklyMarketReview } from './entities/weekly-market-review.type';
import { WeeklyReviewService } from './weekly-review.service';

@SkipThrottle()
@Resolver()
export class WeeklyReviewResolver {
  constructor(private readonly weeklyReviewService: WeeklyReviewService) {}

  @Query(() => WeeklyMarketReview, {
    description: 'Educational weekly MOEX market review (cached per ISO week)',
  })
  weeklyMarketReview(
    @Args('locale', { type: () => String, nullable: true, defaultValue: 'ru' }) locale: string,
  ): Promise<WeeklyMarketReview> {
    return this.weeklyReviewService.getWeeklyReview(locale);
  }
}
