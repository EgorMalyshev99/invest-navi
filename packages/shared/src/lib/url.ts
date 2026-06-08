export function stripTrailingSlash(value: string): string {
  return value.replace(/\/$/, '');
}

export function buildGraphqlUrl(apiBaseUrl: string): string {
  return `${stripTrailingSlash(apiBaseUrl)}/graphql`;
}
