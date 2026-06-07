import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { ReactNode } from 'react';

type TranslationValues = Record<string, unknown>;
type RichValues = Record<string, unknown>;
type TranslationFunction = {
  (key: string, values?: TranslationValues): string;
  rich: (key: string, values: RichValues & TranslationValues) => ReactNode;
};

export const useTranslations = (namespace?: string) => {
  const { t } = useTranslation();

  return useMemo<TranslationFunction>(() => {
    return Object.assign(
      (key: string, values?: TranslationValues) => {
        const fullKey = namespace ? `${namespace}.${key}` : key;
        return t(fullKey, values);
      },
      {
        rich: (key: string, values: RichValues & TranslationValues) => {
          const fullKey = namespace ? `${namespace}.${key}` : key;
          const message = t(fullKey, values);

          return message.split(/(\{[a-zA-Z0-9_.-]+\})/g).map((part) => {
            const match = part.match(/^\{([a-zA-Z0-9_.-]+)\}$/);
            if (!match) {
              return part;
            }

            const token = match[1];
            if (!token) {
              return part;
            }

            const render = values[token];
            return typeof render === 'function' ? (
              <span key={`${token}-${part}`}>{(render as (chunks?: ReactNode) => ReactNode)()}</span>
            ) : (
              part
            );
          });
        },
      },
    );
  }, [namespace, t]);
};

export const useLocale = () => {
  const { i18n } = useTranslation();
  return i18n.resolvedLanguage ?? i18n.language;
};
