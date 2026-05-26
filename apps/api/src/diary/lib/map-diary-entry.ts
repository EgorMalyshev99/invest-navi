import { DiaryAction } from '../dto/diary-action.enum';
import { DiaryHorizon } from '../dto/diary-horizon.enum';
import { DiaryStatus } from '../dto/diary-status.enum';
import { DiaryEntry } from '../entities/diary-entry.type';

import type { diaryEntries } from '../../database/schema/diary-entries';

type DiaryRow = typeof diaryEntries.$inferSelect;

function parseNumeric(value: string | null | undefined): number | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function mapDiaryEntry(row: DiaryRow): DiaryEntry {
  return {
    id: row.id,
    assetSymbol: row.assetSymbol,
    action: row.action as DiaryAction,
    horizon: row.horizon as DiaryHorizon,
    rationale: row.rationale ?? undefined,
    risks: row.risks ?? undefined,
    successCriteria: row.successCriteria ?? undefined,
    failureCriteria: row.failureCriteria ?? undefined,
    confidence: row.confidence ?? undefined,
    status: row.status as DiaryStatus,
    snapshotPrice: parseNumeric(row.snapshotPrice),
    snapshotIndexValue: parseNumeric(row.snapshotIndexValue),
    reviewAt: row.reviewAt ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
