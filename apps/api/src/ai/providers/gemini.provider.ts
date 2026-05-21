import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { AiMessage, AiProvider } from './ai-provider.interface';

const DEFAULT_MODEL = 'gemini-2.0-flash';

@Injectable()
export class GeminiProvider implements AiProvider {
  readonly name = 'gemini';
  private readonly logger = new Logger(GeminiProvider.name);

  constructor(private readonly configService: ConfigService) {}

  isConfigured(): boolean {
    return Boolean(this.configService.get<string>('GEMINI_API_KEY')?.trim());
  }

  async complete(messages: AiMessage[]): Promise<string> {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY')?.trim();
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const model = this.configService.get<string>('GEMINI_MODEL') ?? DEFAULT_MODEL;
    const system = messages.find((m) => m.role === 'system')?.content ?? '';
    const user = messages.find((m) => m.role === 'user')?.content ?? '';

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: 'user', parts: [{ text: user }] }],
          generationConfig: {
            temperature: 0.35,
            responseMimeType: 'application/json',
          },
        }),
        signal: AbortSignal.timeout(30_000),
      },
    );

    if (!response.ok) {
      const details = await response.text();
      this.logger.warn(`Gemini error ${response.status}: ${details.slice(0, 200)}`);
      throw new Error(`Gemini API responded with ${response.status}`);
    }

    const payload = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };

    const content = payload.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      throw new Error('Gemini API returned empty content');
    }

    return content;
  }
}
