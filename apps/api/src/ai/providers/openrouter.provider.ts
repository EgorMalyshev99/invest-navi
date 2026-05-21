import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { AiMessage, AiProvider } from './ai-provider.interface';

const DEFAULT_MODEL = 'meta-llama/llama-3.3-70b-instruct:free';

@Injectable()
export class OpenRouterProvider implements AiProvider {
  readonly name = 'openrouter';
  private readonly logger = new Logger(OpenRouterProvider.name);

  constructor(private readonly configService: ConfigService) {}

  isConfigured(): boolean {
    return Boolean(this.configService.get<string>('OPENROUTER_API_KEY')?.trim());
  }

  async complete(messages: AiMessage[]): Promise<string> {
    const apiKey = this.configService.get<string>('OPENROUTER_API_KEY')?.trim();
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    const model = this.configService.get<string>('OPENROUTER_MODEL') ?? DEFAULT_MODEL;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://invest-navi.local',
        'X-Title': 'Invest Navigator',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.35,
        response_format: { type: 'json_object' },
      }),
      signal: AbortSignal.timeout(45_000),
    });

    if (!response.ok) {
      const details = await response.text();
      this.logger.warn(`OpenRouter error ${response.status}: ${details.slice(0, 200)}`);
      throw new Error(`OpenRouter API responded with ${response.status}`);
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = payload.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('OpenRouter API returned empty content');
    }

    return content;
  }
}
