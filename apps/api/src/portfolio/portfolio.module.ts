import { Module } from '@nestjs/common';

import { PortfolioResolver } from './portfolio.resolver';
import { PortfolioService } from './portfolio.service';
import { MarketModule } from '../market/market.module';

@Module({
  imports: [MarketModule],
  providers: [PortfolioService, PortfolioResolver],
})
export class PortfolioModule {}
