import { PLATFORM_KEY, PLATFORM_VALUES } from '@repo/api';

export function createWebPath(originalPath: string) {
  return `${originalPath}?${PLATFORM_KEY}=${PLATFORM_VALUES.APP}`;
}
