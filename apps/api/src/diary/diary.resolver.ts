import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Throttle } from '@nestjs/throttler';

import { DiaryRetrospectiveService } from './diary-retrospective.service';
import { DiaryService } from './diary.service';
import { CreateDiaryEntryInput } from './dto/create-diary-entry.input';
import { DiaryStatus } from './dto/diary-status.enum';
import { UpdateDiaryEntryInput } from './dto/update-diary-entry.input';
import { DiaryEntry } from './entities/diary-entry.type';
import { DiaryRetrospective } from './entities/diary-retrospective.type';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

import type { AuthenticatedUser } from '../auth/auth.service';

@Resolver()
export class DiaryResolver {
  constructor(
    private readonly diaryService: DiaryService,
    private readonly retrospectiveService: DiaryRetrospectiveService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [DiaryEntry], { name: 'diaryEntries' })
  diaryEntries(
    @CurrentUser() user: AuthenticatedUser,
    @Args('status', { type: () => DiaryStatus, nullable: true }) status?: DiaryStatus,
  ): Promise<DiaryEntry[]> {
    return this.diaryService.listEntries(user.userId, status);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => DiaryEntry, { name: 'diaryEntry' })
  diaryEntry(@CurrentUser() user: AuthenticatedUser, @Args('id') id: string): Promise<DiaryEntry> {
    return this.diaryService.getEntry(user.userId, id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => DiaryRetrospective, { name: 'diaryRetrospective' })
  diaryRetrospective(
    @CurrentUser() user: AuthenticatedUser,
    @Args('entryId') entryId: string,
    @Args('locale', { nullable: true, defaultValue: 'ru' }) locale: string,
  ): Promise<DiaryRetrospective> {
    return this.retrospectiveService.getRetrospective(user.userId, entryId, locale);
  }

  @UseGuards(GqlAuthGuard)
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @Mutation(() => DiaryEntry, { name: 'createDiaryEntry' })
  createDiaryEntry(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input') input: CreateDiaryEntryInput,
  ): Promise<DiaryEntry> {
    return this.diaryService.createEntry(user.userId, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => DiaryEntry, { name: 'updateDiaryEntry' })
  updateDiaryEntry(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id') id: string,
    @Args('input') input: UpdateDiaryEntryInput,
  ): Promise<DiaryEntry> {
    return this.diaryService.updateEntry(user.userId, id, input);
  }
}
