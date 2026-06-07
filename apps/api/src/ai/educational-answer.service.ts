import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { assertEducationalQuestionInput } from '@repo/api';

import { EducationalAnswerInput } from './dto/educational-answer.input';
import { AssetInsightSource } from './entities/asset-insight-source.enum';
import { EducationalAnswer } from './entities/educational-answer.type';
import {
  buildEducationalAnswerPrompt,
  buildFallbackEducationalAnswer,
  type EducationalKnowledgeLevel,
} from './lib/build-educational-answer-prompt';
import { formatComplianceViolations, scanComplianceText } from './lib/compliance';
import { AiProviderFactory } from './providers/ai-provider.factory';
import { KnowledgeLevel } from '../auth/dto/knowledge-level.enum';
import { UsersRepository } from '../database/repositories/users.repository';

@Injectable()
export class EducationalAnswerService {
  private readonly logger = new Logger(EducationalAnswerService.name);

  constructor(
    private readonly aiFactory: AiProviderFactory,
    private readonly usersRepository: UsersRepository,
  ) {}

  async getAnswer(userId: string, input: EducationalAnswerInput): Promise<EducationalAnswer> {
    const validated = this.validateInput(input);
    const knowledgeLevel = await this.resolveKnowledgeLevel(userId);
    const provider = this.aiFactory.getActiveProvider();

    if (provider) {
      try {
        const { system, user } = buildEducationalAnswerPrompt({
          question: validated.question,
          locale: validated.locale,
          knowledgeLevel,
        });
        const raw = await provider.complete([
          { role: 'system', content: system },
          { role: 'user', content: user },
        ]);
        const answer = raw.trim();
        if (answer.length > 0) {
          const compliance = scanComplianceText(answer);
          if (compliance.ok) {
            return {
              answer,
              source: AssetInsightSource.AI,
              provider: provider.name,
            };
          }
          this.logger.warn(
            `Educational answer compliance rejected: ${formatComplianceViolations(compliance.violations)}`,
          );
        }
      } catch (error) {
        this.logger.warn(
          `Educational answer AI failed: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    return {
      answer: buildFallbackEducationalAnswer(validated.locale),
      source: AssetInsightSource.FALLBACK,
    };
  }

  private async resolveKnowledgeLevel(userId: string): Promise<EducationalKnowledgeLevel> {
    const user = await this.usersRepository.findById(userId);
    const level = user?.knowledgeLevel;
    if (level === KnowledgeLevel.ADVANCED) {
      return 'advanced';
    }
    if (level === KnowledgeLevel.INTERMEDIATE) {
      return 'intermediate';
    }
    return 'beginner';
  }

  private validateInput(input: EducationalAnswerInput) {
    try {
      return assertEducationalQuestionInput(input.question, input.locale);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Invalid educational question input',
      );
    }
  }
}
