import { Module } from '@nestjs/common';

import './entities/asset-insight-source.enum';
import { AiResolver } from './ai.resolver';
import { AssetInsightService } from './asset-insight.service';
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
    AiResolver,
  ],
})
export class AiModule {}
