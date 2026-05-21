import type { AssetSnapshot, IndexSnapshot } from '@repo/api';

export function buildAssetInsightPrompt(
  asset: AssetSnapshot,
  indices: IndexSnapshot[],
  locale: string,
): { system: string; user: string } {
  const imoex = indices.find((index) => index.code === 'IMOEX');
  const language = locale === 'en' ? 'English' : 'Russian';

  const system = `You are an educational assistant for Russian market investors.
Write in ${language}.
NEVER recommend buy, sell, or hold.
NEVER promise returns or compare to deposits without risk caveats.
Use cautious wording: "may", "possibly", "worth considering".
Respond with JSON only:
{
  "whatIs": "string",
  "whatChanged": "string",
  "whyMatters": "string",
  "risks": ["string", "string", "string"],
  "forInvestor": "string",
  "vsIndex": "string or null"
}`;

  const user = `Explain asset for education:
Symbol: ${asset.symbol}
Name: ${asset.name}
Price: ${asset.lastPrice} ${asset.currency ?? 'RUB'}
Change %: ${asset.changePercent}
Sector: ${asset.sector ?? 'unknown'}
Volume today: ${asset.valueToday}
Dividend yield %: ${asset.dividendYieldPercent ?? 'n/a'}
IMOEX change %: ${imoex?.changePercent ?? 'n/a'}`;

  return { system, user };
}
