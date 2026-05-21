import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { AiMessage, AiProvider } from './ai-provider.interface';

const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

@Injectable()
export class GroqProvider implements AiProvider {
  readonly name = 'groq';
  private readonly logger = new Logger(GroqProvider.name);

  constructor(private readonly configService: ConfigService) {}

  isConfigured(): boolean {
    return Boolean(this.configService.get<string>('GROQ_API_KEY')?.trim());
  }

  async complete(messages: AiMessage[]): Promise<string> {
    const apiKey = this.configService.get<string>('GROQ_API_KEY')?.trim();
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not configured');
    }

    const model = this.configService.get<string>('GROQ_MODEL') ?? DEFAULT_MODEL;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.35,
        response_format: { type: 'json_object' },
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      const details = await response.text();
      this.logger.warn(`Groq error ${response.status}: ${details.slice(0, 200)}`);
      throw new Error(`Groq API responded with ${response.status}`);
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = payload.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('Groq API returned empty content');
    }

    return content;
  }
}
