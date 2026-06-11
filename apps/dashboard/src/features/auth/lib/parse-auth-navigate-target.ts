export type AuthNavigateTarget = {
  to: string;
  search?: Record<string, string>;
};

export function parseAuthNavigateTarget(href: string): AuthNavigateTarget {
  const url = new URL(href, 'http://localhost');
  const search: Record<string, string> = {};

  url.searchParams.forEach((value, key) => {
    search[key] = value;
  });

  return {
    to: url.pathname,
    ...(Object.keys(search).length > 0 ? { search } : {}),
  };
}
