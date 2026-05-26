import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { assertDiaryHypothesisFeedbackInput } from '@repo/api';

import { DiaryHypothesisFeedbackInput } from './dto/diary-hypothesis-feedback.input';
import { AssetInsightSource } from './entities/asset-insight-source.enum';
import { DiaryHypothesisFeedback } from './entities/diary-hypothesis-feedback.type';
import { buildDiaryHypothesisPrompt, buildFallbackDiaryFeedback } from './lib/build-diary-prompt';
import { parseDiaryFeedbackJson } from './lib/parse-diary-feedback';
import { AiProviderFactory } from './providers/ai-provider.factory';

@Injectable()
export class DiaryHypothesisService {
  private readonly logger = new Logger(DiaryHypothesisService.name);

  constructor(private readonly aiFactory: AiProviderFactory) {}

  async getFeedback(input: DiaryHypothesisFeedbackInput): Promise<DiaryHypothesisFeedback> {
    const validated = this.validateInput(input);
    const locale = validated.locale;
    const draft = {
      assetSymbol: validated.assetSymbol,
      action: validated.action,
      horizon: validated.horizon,
      rationale: validated.rationale,
      risks: validated.risks,
      successCriteria: validated.successCriteria,
      failureCriteria: validated.failureCriteria,
      confidence: validated.confidence,
    };

    const provider = this.aiFactory.getActiveProvider();
    if (provider) {
      try {
        const { system, user } = buildDiaryHypothesisPrompt(draft, locale);
        const raw = await provider.complete([
          { role: 'system', content: system },
          { role: 'user', content: user },
        ]);
        const parsed = parseDiaryFeedbackJson(raw);
        if (parsed) {
          return {
            ...parsed,
            source: AssetInsightSource.AI,
            provider: provider.name,
          };
        }
        this.logger.warn(`Diary feedback parse failed for ${draft.assetSymbol}`);
      } catch (error) {
        this.logger.warn(
          `Diary feedback AI failed: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    const fallback = buildFallbackDiaryFeedback(draft, locale);
    return {
      ...fallback,
      source: AssetInsightSource.FALLBACK,
    };
  }

  private validateInput(input: DiaryHypothesisFeedbackInput) {
    try {
      return assertDiaryHypothesisFeedbackInput({
        assetSymbol: input.assetSymbol,
        action: input.action,
        horizon: input.horizon,
        rationale: input.rationale,
        risks: input.risks,
        successCriteria: input.successCriteria,
        failureCriteria: input.failureCriteria,
        confidence: input.confidence,
        locale: input.locale,
      });
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Invalid hypothesis feedback input',
      );
    }
  }
}
