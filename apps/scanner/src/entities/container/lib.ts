import { isNonEmptyString, isObject } from '@/src/shared/lib/guards';
import { BucketQRData } from '@repo/api';

export function getBucketData(code: string): BucketQRData | null {
  if (!isNonEmptyString(code)) {
    return null;
  }

  let parsed: unknown;
  console.log('parsed: ', parsed);

  try {
    parsed = JSON.parse(code);
  } catch {
    return null;
  }

  if (!isObject(parsed)) {
    return null;
  }

  const payload = parsed as unknown as BucketQRData;
  const hasRequiredBaseFields =
    isNonEmptyString(payload.id) && isNonEmptyString(payload.creator);

  const componentNameField = isNonEmptyString(payload.componentName);

  const hasValidComponentId =
    payload.componentId === undefined || isNonEmptyString(payload.componentId);

  return hasRequiredBaseFields && componentNameField && hasValidComponentId
    ? payload
    : null;
}
