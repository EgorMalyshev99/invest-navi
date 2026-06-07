import type { EducationBlock } from '@/features/asset-education';

export type InsightSectionKey = 'overview' | 'fit';

export const INSIGHT_SECTIONS: ReadonlyArray<{
  key: InsightSectionKey;
  blockIds: readonly string[];
  gridClassName: string;
}> = [
  {
    key: 'overview',
    blockIds: ['what-is', 'what-changed', 'why-matters'],
    gridClassName: 'grid gap-4 md:grid-cols-2 xl:grid-cols-3',
  },
  {
    key: 'fit',
    blockIds: ['risks', 'for-investor'],
    gridClassName: 'grid gap-4 md:grid-cols-2',
  },
];

export function blocksForInsightSection(
  blocks: EducationBlock[],
  blockIds: readonly string[],
): EducationBlock[] {
  const byId = new Map(blocks.map((block) => [block.id, block]));
  return blockIds
    .map((id) => byId.get(id))
    .filter((block): block is EducationBlock => block !== undefined);
}
