import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { GeminiProvider } from './gemini.provider';
import { GroqProvider } from './groq.provider';
import { OpenRouterProvider } from './openrouter.provider';

import type { AiProvider } from './ai-provider.interface';

export type AiProviderName = 'groq' | 'gemini' | 'openrouter';

@Injectable()
export class AiProviderFactory {
  constructor(
    private readonly configService: ConfigService,
    private readonly groq: GroqProvider,
    private readonly gemini: GeminiProvider,
    private readonly openrouter: OpenRouterProvider,
  ) {}

  getActiveProvider(): AiProvider | null {
    const configured = this.configService.get<string>('AI_PROVIDER')?.trim().toLowerCase();
    const providers: Record<AiProviderName, AiProvider> = {
      groq: this.groq,
      gemini: this.gemini,
      openrouter: this.openrouter,
    };

    if (!configured || !(configured in providers)) {
      return null;
    }

    const provider = providers[configured as AiProviderName];
    return provider.isConfigured() ? provider : null;
  }

  getActiveProviderName(): AiProviderName | null {
    const provider = this.getActiveProvider();
    if (!provider) {
      return null;
    }
    return provider.name as AiProviderName;
  }
}
