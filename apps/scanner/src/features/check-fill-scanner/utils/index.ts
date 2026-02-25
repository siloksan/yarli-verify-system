import { BucketQRData } from '@repo/api';

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function getBucketData(code: string): BucketQRData | null {
  if (!isNonEmptyString(code)) {
    return null;
  }

  let parsed: unknown;

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
