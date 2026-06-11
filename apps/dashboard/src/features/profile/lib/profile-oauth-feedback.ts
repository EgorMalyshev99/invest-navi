type ProfileOAuthFeedback = {
  type: 'success' | 'error';
  message: string;
};

type ProfileOAuthTranslate = (key: string) => string;

export function resolveProfileOAuthUrlFeedback(
  linked: string | null,
  oauth: string | null,
  t: ProfileOAuthTranslate,
): ProfileOAuthFeedback | null {
  if (linked === 'yandex' || linked === 'google') {
    return { type: 'success', message: t('linkedSuccess') };
  }

  if (oauth === 'denied') {
    return { type: 'error', message: t('linkDenied') };
  }

  if (oauth === 'invalid') {
    return { type: 'error', message: t('linkInvalid') };
  }

  if (oauth === 'failed') {
    return { type: 'error', message: t('linkFailed') };
  }

  return null;
}
