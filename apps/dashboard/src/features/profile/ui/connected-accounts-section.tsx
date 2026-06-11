'use client';

import {
  Alert,
  AlertDescription,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui';
import { useMemo, useState } from 'react';

import type { OAuthProvider as DashboardOAuthProvider } from '@/features/auth/lib/oauth-providers';
import type { OAuthProvider as GraphqlOAuthProvider } from '@/shared/api/graphql/generated/graphql';

import { useMeQuery } from '@/features/auth/api/use-me-query';
import { useUnlinkOAuthProviderMutation } from '@/features/auth/api/use-unlink-oauth-mutation';
import {
  hasAnyOAuthProviderConfigured,
  isOAuthProviderConfigured,
} from '@/features/auth/lib/oauth-config';
import { getOAuthAuthorizeUrl } from '@/features/auth/lib/start-oauth';
import { resolveProfileOAuthUrlFeedback } from '@/features/profile/lib/profile-oauth-feedback';
import { useSearchParams } from '@/i18n/navigation';
import { useTranslations } from '@/i18n/react-i18n';
import { GraphqlRequestError } from '@/shared/api/graphql';

const PROVIDERS: GraphqlOAuthProvider[] = ['YANDEX', 'GOOGLE'];

const PROVIDER_TO_DASHBOARD: Record<GraphqlOAuthProvider, DashboardOAuthProvider> = {
  YANDEX: 'yandex',
  GOOGLE: 'google',
};

function getVisibleProviders(): GraphqlOAuthProvider[] {
  return PROVIDERS.filter((provider) => isOAuthProviderConfigured(PROVIDER_TO_DASHBOARD[provider]));
}

export function ConnectedAccountsSection() {
  const t = useTranslations('profile.oauth');
  const tAuth = useTranslations('auth');
  const searchParams = useSearchParams();
  const { data } = useMeQuery({
    refetchOnMount: searchParams.get('linked') ? 'always' : true,
  });
  const unlinkOAuth = useUnlinkOAuthProviderMutation();
  const [actionFeedback, setActionFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const urlFeedback = useMemo(
    () => resolveProfileOAuthUrlFeedback(searchParams.get('linked'), searchParams.get('oauth'), t),
    [searchParams, t],
  );

  const feedback = actionFeedback ?? urlFeedback;

  if (!hasAnyOAuthProviderConfigured()) {
    return null;
  }

  const linkedProviders = new Set(data?.me.oauthProviders ?? []);

  const handleUnlink = async (provider: GraphqlOAuthProvider) => {
    setActionFeedback(null);
    try {
      await unlinkOAuth.mutateAsync(provider);
      setActionFeedback({ type: 'success', message: t('unlinkedSuccess') });
    } catch (error) {
      setActionFeedback({
        type: 'error',
        message: error instanceof GraphqlRequestError ? error.message : t('unlinkFailed'),
      });
    }
  };

  const startLink = (dashboardProvider: DashboardOAuthProvider) => {
    window.location.assign(getOAuthAuthorizeUrl(dashboardProvider, { mode: 'link' }));
  };

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {feedback ? (
          <Alert variant={feedback.type === 'error' ? 'destructive' : 'default'}>
            <AlertDescription>{feedback.message}</AlertDescription>
          </Alert>
        ) : null}
        <ul className="flex flex-col gap-3">
          {getVisibleProviders().map((provider) => {
            const isLinked = linkedProviders.has(provider);
            const dashboardProvider = PROVIDER_TO_DASHBOARD[provider];

            return (
              <li
                key={provider}
                className="border-border flex items-center justify-between gap-3 rounded-lg border p-3"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{t(`providers.${dashboardProvider}`)}</span>
                  <Badge variant={isLinked ? 'default' : 'outline'}>
                    {isLinked ? t('statusLinked') : t('statusNotLinked')}
                  </Badge>
                </div>
                {isLinked ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={unlinkOAuth.isPending}
                    onClick={() => void handleUnlink(provider)}
                  >
                    {t('unlink')}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => startLink(dashboardProvider)}
                  >
                    {tAuth(dashboardProvider === 'yandex' ? 'linkYandex' : 'linkGoogle')}
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
