import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';

import { AssetInsightService } from './asset-insight.service';
import { BondInsightService } from './bond-insight.service';
import { DiaryHypothesisService } from './diary-hypothesis.service';
import { EducationalAnswerService } from './educational-answer.service';
import { DiaryHypothesisFeedbackInput } from './dto/diary-hypothesis-feedback.input';
import { EducationalAnswerInput } from './dto/educational-answer.input';
import { AssetInsight } from './entities/asset-insight.type';
import { BondInsight } from './entities/bond-insight.type';
import { DiaryHypothesisFeedback } from './entities/diary-hypothesis-feedback.type';
import { EducationalAnswer } from './entities/educational-answer.type';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

import type { AuthenticatedUser } from '../auth/auth.service';

@Resolver()
export class AiResolver {
  constructor(
    private readonly assetInsightService: AssetInsightService,
    private readonly bondInsightService: BondInsightService,
    private readonly diaryHypothesisService: DiaryHypothesisService,
    private readonly educationalAnswerService: EducationalAnswerService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Throttle({ default: { limit: 15, ttl: 60_000 } })
  @Query(() => AssetInsight, { name: 'assetInsight' })
  assetInsight(
    @Args('symbol') symbol: string,
    @Args('locale', { nullable: true, defaultValue: 'ru' }) locale: string,
  ): Promise<AssetInsight> {
    return this.assetInsightService.getInsight(symbol, locale);
  }

  @UseGuards(GqlAuthGuard)
  @Throttle({ default: { limit: 15, ttl: 60_000 } })
  @Query(() => BondInsight, { name: 'bondInsight' })
  bondInsight(
    @Args('symbol') symbol: string,
    @Args('locale', { nullable: true, defaultValue: 'ru' }) locale: string,
  ): Promise<BondInsight> {
    return this.bondInsightService.getInsight(symbol, locale);
  }

  @UseGuards(GqlAuthGuard)
  @Throttle({ default: { limit: 15, ttl: 60_000 } })
  @Query(() => DiaryHypothesisFeedback, { name: 'diaryHypothesisFeedback' })
  diaryHypothesisFeedback(
    @CurrentUser() _user: AuthenticatedUser,
    @Args('input') input: DiaryHypothesisFeedbackInput,
  ): Promise<DiaryHypothesisFeedback> {
    return this.diaryHypothesisService.getFeedback(input);
  }

  @UseGuards(GqlAuthGuard)
  @Throttle({ default: { limit: 15, ttl: 60_000 } })
  @Mutation(() => EducationalAnswer, { name: 'educationalAnswer' })
  educationalAnswer(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: EducationalAnswerInput,
  ): Promise<EducationalAnswer> {
    return this.educationalAnswerService.getAnswer(user.userId, input);
  }
}
