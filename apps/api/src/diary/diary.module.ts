import { Module } from '@nestjs/common';

import './register-enums';
import { DiaryRetrospectiveService } from './diary-retrospective.service';
import { DiaryResolver } from './diary.resolver';
import { DiaryService } from './diary.service';
import { AiModule } from '../ai/ai.module';
import { MarketModule } from '../market/market.module';

@Module({
  imports: [MarketModule, AiModule],
  providers: [DiaryService, DiaryRetrospectiveService, DiaryResolver],
})
export class DiaryModule {}
