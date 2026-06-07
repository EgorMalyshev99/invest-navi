import type ruMessages from '@repo/i18n-messages/ru.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof ruMessages;
    };
  }
}
