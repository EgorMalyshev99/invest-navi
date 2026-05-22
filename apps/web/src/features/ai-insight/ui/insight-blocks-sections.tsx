'use client';

import type { EducationBlock } from '@/features/asset-education';

import { blocksForInsightSection, INSIGHT_SECTIONS } from '../lib/insight-sections';

import { AiInsightBlock } from './ai-insight-block';

interface InsightBlocksSectionsProps {
  blocks: EducationBlock[];
  sectionTitles: Record<'overview' | 'fit', string>;
  isAi: boolean;
  aiBadgeLabel: string;
  templateBadgeLabel: string;
}

export function InsightBlocksSections({
  blocks,
  sectionTitles,
  isAi,
  aiBadgeLabel,
  templateBadgeLabel,
}: InsightBlocksSectionsProps) {
  return (
    <div className="space-y-10">
      {INSIGHT_SECTIONS.map((section) => {
        const sectionBlocks = blocksForInsightSection(blocks, section.blockIds);
        if (sectionBlocks.length === 0) {
          return null;
        }

        const headingId = `insight-section-${section.key}`;

        return (
          <section key={section.key} className="space-y-4" aria-labelledby={headingId}>
            <h2 id={headingId} className="text-lg font-semibold tracking-tight">
              {sectionTitles[section.key]}
            </h2>
            <div className={section.gridClassName}>
              {sectionBlocks.map((block) => (
                <AiInsightBlock
                  key={block.id}
                  title={block.title}
                  body={block.body}
                  isAi={isAi}
                  aiBadgeLabel={aiBadgeLabel}
                  templateBadgeLabel={templateBadgeLabel}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
