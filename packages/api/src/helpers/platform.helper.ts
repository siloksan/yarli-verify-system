export const PLATFORM_KEY = 'platform';
export const PLATFORM_VALUES = {
  APP: 'app',
  BROWSER: 'browser',
} as const;

export function createWebPathToMobileApp(originalPath: string) {
  return `${originalPath}?${PLATFORM_KEY}=${PLATFORM_VALUES.APP}`;
}
