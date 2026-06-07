import enMessages from '@repo/i18n-messages/en.json';
import ruMessages from '@repo/i18n-messages/ru.json';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ICU from 'i18next-icu';
import { initReactI18next } from 'react-i18next';

import { routing } from './routing';

void i18n
  .use(ICU)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: routing.defaultLocale,
    supportedLngs: [...routing.locales],
    defaultNS: 'translation',
    resources: {
      en: { translation: enMessages },
      ru: { translation: ruMessages },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export { i18n };
