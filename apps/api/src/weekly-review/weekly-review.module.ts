import { Module } from '@nestjs/common';

import { AiModule } from '../ai';
import { MarketModule } from '../market/market.module';
import { WeeklyReviewResolver } from './weekly-review.resolver';
import { WeeklyReviewService } from './weekly-review.service';

@Module({
  imports: [MarketModule, AiModule],
  providers: [WeeklyReviewService, WeeklyReviewResolver],
  exports: [WeeklyReviewService],
})
export class WeeklyReviewModule {}
