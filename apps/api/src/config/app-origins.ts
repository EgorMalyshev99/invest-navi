type AppOriginEnv = {
  LANDING_URL?: string;
  DASHBOARD_URL?: string;
};

export function parseAppOrigins(env: AppOriginEnv): string[] {
  const origins = [env.LANDING_URL, env.DASHBOARD_URL]
    .map((value) => value?.trim().replace(/\/$/, ''))
    .filter((value): value is string => Boolean(value));

  return [...new Set(origins)];
}
