import { getBucketData } from '../../utils';
import { createFillingAct } from '../../api';
import {
  BucketQRData,
  HttpError,
  ICreateFillingActBucketDto,
  IFillingActBucketResponseDto,
} from '@repo/api';

// Result types for FSM
export type BucketValidationResult =
  | { success: true; bucket: BucketQRData }
  | { success: false; message: string };

export type ComponentValidationResult =
  | { success: true; fillingAct: IFillingActBucketResponseDto }
  | { success: false; message: string };

// ---------------------------
// Bucket validation
// ---------------------------
export function validateBucket(
  bucketCode: string,
  testedComponentName: string,
): BucketValidationResult {
  const parsedData = getBucketData(bucketCode);

  if (!parsedData) {
    return {
      success: false,
      message:
        'Не валидный QRcode, попробуйте ещё раз, или введите код вручную',
    };
  }

  if (parsedData.componentName !== testedComponentName) {
    return { success: false, message: 'Сканирована неверная тара' };
  }

  return { success: true, bucket: parsedData };
}

// ---------------------------
// Component validation
// ---------------------------
export async function validateComponent(
  createScanEventData: ICreateFillingActBucketDto,
): Promise<ComponentValidationResult> {
  try {
    const fillingActData = await createFillingAct(createScanEventData);
    return { success: true, fillingAct: fillingActData };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof HttpError
          ? error.message
          : 'Ошибка при валидации компонента',
    };
  }
}
