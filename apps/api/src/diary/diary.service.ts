import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { assertCreateDiaryEntryInput, assertUpdateDiaryEntryInput } from '@repo/api';

import { DiaryEntriesRepository } from '../database/repositories/diary-entries.repository';
import { MarketService } from '../market/market.service';
import { CreateDiaryEntryInput } from './dto/create-diary-entry.input';
import { DiaryHorizon } from './dto/diary-horizon.enum';
import { UpdateDiaryEntryInput } from './dto/update-diary-entry.input';
import { DiaryEntry } from './entities/diary-entry.type';
import { computeReviewAt } from './lib/compute-review-at';
import { mapDiaryEntry } from './lib/map-diary-entry';

import type { diaryEntries } from '../database/schema/diary-entries';

@Injectable()
export class DiaryService {
  constructor(
    private readonly diaryEntriesRepository: DiaryEntriesRepository,
    private readonly marketService: MarketService,
  ) {}

  async listEntries(userId: string, status?: string): Promise<DiaryEntry[]> {
    const rows = await this.diaryEntriesRepository.findByUserId(userId, 100);
    const filtered = status ? rows.filter((row) => row.status === status) : rows;
    return filtered.map(mapDiaryEntry);
  }

  async getEntry(userId: string, entryId: string): Promise<DiaryEntry> {
    const row = await this.diaryEntriesRepository.findByIdForUser(entryId, userId);
    if (!row) {
      throw new NotFoundException('Diary entry not found');
    }
    return mapDiaryEntry(row);
  }

  async createEntry(userId: string, input: CreateDiaryEntryInput): Promise<DiaryEntry> {
    const validated = this.validateCreate(input);
    const [asset, indices] = await Promise.all([
      this.marketService.getAsset(validated.assetSymbol),
      this.marketService.getIndices(),
    ]);
    const imoex = indices.find((index) => index.code === 'IMOEX');
    const reviewAt = computeReviewAt(validated.horizon as DiaryHorizon);

    const [created] = await this.diaryEntriesRepository.create({
      userId,
      assetSymbol: validated.assetSymbol,
      action: validated.action,
      horizon: validated.horizon,
      rationale: validated.rationale,
      risks: validated.risks,
      successCriteria: validated.successCriteria,
      failureCriteria: validated.failureCriteria,
      confidence: validated.confidence,
      snapshotPrice: String(asset.lastPrice),
      snapshotIndexValue: imoex ? String(imoex.currentValue) : null,
      reviewAt,
    });

    if (!created) {
      throw new BadRequestException('Failed to create diary entry');
    }

    return mapDiaryEntry(created);
  }

  async updateEntry(
    userId: string,
    entryId: string,
    input: UpdateDiaryEntryInput,
  ): Promise<DiaryEntry> {
    const existing = await this.diaryEntriesRepository.findByIdForUser(entryId, userId);
    if (!existing) {
      throw new NotFoundException('Diary entry not found');
    }

    const updates = this.validateUpdate(input);
    const dbUpdates: Partial<typeof diaryEntries.$inferInsert> = { ...updates };
    if (updates.horizon) {
      dbUpdates.reviewAt = computeReviewAt(updates.horizon as DiaryHorizon, existing.createdAt);
    }

    const [updated] = await this.diaryEntriesRepository.update(entryId, userId, dbUpdates);
    if (!updated) {
      throw new NotFoundException('Diary entry not found');
    }

    return mapDiaryEntry(updated);
  }

  private validateCreate(input: CreateDiaryEntryInput) {
    try {
      return assertCreateDiaryEntryInput({
        assetSymbol: input.assetSymbol,
        action: input.action,
        horizon: input.horizon,
        rationale: input.rationale,
        risks: input.risks,
        successCriteria: input.successCriteria,
        failureCriteria: input.failureCriteria,
        confidence: input.confidence,
      });
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Invalid diary entry input',
      );
    }
  }

  private validateUpdate(input: UpdateDiaryEntryInput) {
    try {
      return assertUpdateDiaryEntryInput({
        action: input.action,
        horizon: input.horizon,
        rationale: input.rationale,
        risks: input.risks,
        successCriteria: input.successCriteria,
        failureCriteria: input.failureCriteria,
        confidence: input.confidence,
        status: input.status,
      });
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Invalid diary entry input',
      );
    }
  }
}
