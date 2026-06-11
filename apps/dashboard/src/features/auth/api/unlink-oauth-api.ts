import { graphqlRequest } from '@/shared/api/graphql';
import {
  UnlinkOAuthProviderDocument,
  type OAuthProvider,
} from '@/shared/api/graphql/generated/graphql';

export async function unlinkOAuthProvider(provider: OAuthProvider) {
  const data = await graphqlRequest(UnlinkOAuthProviderDocument, { provider });
  return data.unlinkOAuthProvider;
}
