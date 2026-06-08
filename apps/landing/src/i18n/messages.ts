import type { AppLocale } from '@/lib/locales';

import en from '@/messages/en.json';
import ru from '@/messages/ru.json';

export const messages: Record<AppLocale, typeof ru> = {
  ru,
  en,
};
