/** Imperative buy/sell/hold and recommendation phrasing (ru + en). */
export const TRADING_DIRECTIVE_PATTERNS: RegExp[] = [
  /(?:^|[\s,.!?;:()«»"—-])(?:покупай|продавай|держи|купи|продай)(?:$|[\s,.!?;:()«»"—-])/giu,
  /(?:рекомендуем|рекомендую)\s+(?:купить|продать|держать)/giu,
  /(?:стоит|нужно|следует)\s+(?:купить|продать)/giu,
  /(?:срочно\s+)?(?:купите|продайте)/giu,
  /\b(?:strong\s+)?(?:buy|sell)\s+now\b/giu,
  /\byou\s+should\s+(?:buy|sell|hold)\b/giu,
  /\b(?:recommend|recommends|recommended)\s+(?:buying|selling|to\s+buy|to\s+sell)\b/giu,
  /\b(?:must|should)\s+buy\b/giu,
  /\b(?:must|should)\s+sell\b/giu,
];

/** Guaranteed return / risk-free claims. */
export const GUARANTEED_RETURN_PATTERNS: RegExp[] = [
  /гарантированн\w*\s+(?:доход|прибыл\w*|возврат)/giu,
  /(?:^|[\s,.!?;:()«»"—-])(?:без\s+риска|нулевой\s+риск)(?:$|[\s,.!?;:()«»"—-])/giu,
  /(?:точно|обязательно)\s+(?:вырастет|выроснет|принесёт|принесет)/giu,
  /\bguaranteed\s+(?:return|profit|yield)\b/giu,
  /\brisk[- ]free\b/giu,
  /\bwill\s+definitely\s+(?:rise|grow|increase)\b/giu,
  /\b(?:sure|guaranteed)\s+profit\b/giu,
];

/** Deposit / savings comparison triggers. */
export const DEPOSIT_MENTION_PATTERN =
  /(?:банковск\w*\s+)?вклад\w*|депозит\w*|как\s+у\s+вклада|лучше\s+вклада|выше\s+вклада/giu;

export const EN_DEPOSIT_MENTION_PATTERN =
  /\b(?:bank\s+deposit|savings\s+account|like\s+a\s+deposit|better\s+than\s+a\s+deposit)\b/giu;

/** Risk caveats that make deposit comparisons acceptable in context. */
export const DEPOSIT_RISK_CAVEAT_PATTERN =
  /(?:риск|дефолт|default|цена\s+может|price\s+may|не\s+гарант|not\s+guaranteed|волатильн|volatil|может\s+измениться|may\s+fall|may\s+lose)/giu;
