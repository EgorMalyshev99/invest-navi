import type { EducationBlock } from '@/features/asset-education';

export interface AssetInsightPayload {
  whatIs: string;
  whatChanged: string;
  whyMatters: string;
  risks: string[];
  forInvestor: string;
  vsIndex?: string | null;
}

export function insightToBlocks(
  insight: AssetInsightPayload,
  titles: {
    whatIs: string;
    whatChanged: string;
    whyMatters: string;
    risks: string;
    forInvestor: string;
  },
): EducationBlock[] {
  return [
    { id: 'what-is', title: titles.whatIs, body: insight.whatIs },
    { id: 'what-changed', title: titles.whatChanged, body: insight.whatChanged },
    { id: 'why-matters', title: titles.whyMatters, body: insight.whyMatters },
    {
      id: 'risks',
      title: titles.risks,
      body: insight.risks.map((item) => `• ${item}`).join('\n'),
    },
    { id: 'for-investor', title: titles.forInvestor, body: insight.forInvestor },
  ];
}
