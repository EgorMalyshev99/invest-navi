import { print } from 'graphql';

import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

import { refreshAccessTokenViaRest } from '@/shared/auth/auth-session';
import { clearAccessToken, getAccessToken } from '@/shared/auth/token-store';
import { getGraphqlUrl } from '@/shared/config/env';

export class GraphqlRequestError extends Error {
  constructor(
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'GraphqlRequestError';
  }
}

function isAuthHttpError(error: unknown): boolean {
  return (
    error instanceof GraphqlRequestError &&
    typeof error.details === 'object' &&
    error.details !== null &&
    'status' in error.details &&
    (error.details.status === 401 || error.details.status === 403)
  );
}

interface GraphqlResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

function isUnauthorizedError(errors?: Array<{ message: string }>): boolean {
  return errors?.some((error) => /unauthorized|forbidden|jwt|token/i.test(error.message)) ?? false;
}

async function executeGraphql<TResult, TVariables>(
  document: TypedDocumentNode<TResult, TVariables>,
  variables: TVariables | undefined,
  accessToken: string | undefined,
): Promise<GraphqlResponse<TResult>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(getGraphqlUrl(), {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify({
      query: print(document),
      variables: variables ?? {},
    }),
    cache: 'no-store',
  });

  if (response.status === 401 || response.status === 403) {
    throw new GraphqlRequestError(`GraphQL HTTP ${response.status}`, { status: response.status });
  }

  if (!response.ok) {
    throw new GraphqlRequestError(`GraphQL HTTP ${response.status}`);
  }

  return response.json() as Promise<GraphqlResponse<TResult>>;
}

export async function graphqlRequest<TResult, TVariables = Record<string, never>>(
  document: TypedDocumentNode<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
): Promise<TResult> {
  let accessToken = getAccessToken();
  let payload: GraphqlResponse<TResult>;

  try {
    payload = await executeGraphql(document, variables, accessToken);
  } catch (error) {
    if (!isAuthHttpError(error)) {
      throw error;
    }

    accessToken = await refreshAccessTokenViaRest();
    if (!accessToken) {
      throw error;
    }

    payload = await executeGraphql(document, variables, accessToken);
  }

  if (isUnauthorizedError(payload.errors)) {
    accessToken = await refreshAccessTokenViaRest();
    if (accessToken) {
      payload = await executeGraphql(document, variables, accessToken);
    } else {
      clearAccessToken({ expired: true });
    }
  }

  if (payload.errors?.length) {
    throw new GraphqlRequestError(payload.errors.map((e) => e.message).join('; '), payload.errors);
  }

  if (!payload.data) {
    throw new GraphqlRequestError('GraphQL response has no data');
  }

  return payload.data;
}
