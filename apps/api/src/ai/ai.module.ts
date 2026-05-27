import { Module } from '@nestjs/common';

import './entities/asset-insight-source.enum';
import { AiResolver } from './ai.resolver';
import { AssetInsightService } from './asset-insight.service';
import { BondInsightService } from './bond-insight.service';
import { DiaryHypothesisService } from './diary-hypothesis.service';
import { EducationalAnswerService } from './educational-answer.service';
import { MarketModule } from '../market/market.module';
import { AiProviderFactory } from './providers/ai-provider.factory';
import { GeminiProvider } from './providers/gemini.provider';
import { GroqProvider } from './providers/groq.provider';
import { OpenRouterProvider } from './providers/openrouter.provider';

@Module({
  imports: [MarketModule],
  providers: [
    GroqProvider,
    GeminiProvider,
    OpenRouterProvider,
    AiProviderFactory,
    AssetInsightService,
    BondInsightService,
    DiaryHypothesisService,
    EducationalAnswerService,
    AiResolver,
  ],
  exports: [AiProviderFactory, DiaryHypothesisService, EducationalAnswerService],
})
export class AiModule {}
