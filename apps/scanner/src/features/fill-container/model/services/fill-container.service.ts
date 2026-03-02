import {
  HttpError,
  ICreateFillingContainerActDto,
  BucketQRData,
} from '@repo/api';

import {
  createFillingContainerAct,
  getBucketById,
} from '../../api/create-filling-container-act';
import { getBucketData } from '@/src/features/check-fill-scanner/utils';
import { ErrorState } from '../../hooks/useFillContainer';

export type BucketValidationResult =
  | { success: true; bucket: BucketQRData }
  | { success: false; message: string };

export type ComponentValidationResult =
  | {
      success: true;
      fillingAct: Awaited<ReturnType<typeof createFillingContainerAct>>;
    }
  | { success: false; message: string };

export async function validateBucketForFillContainer(
  bucketQrCode: string,
): Promise<BucketValidationResult> {
  const parsedData = getBucketData(bucketQrCode);

  if (!parsedData) {
    return {
      success: false,
      message: 'Invalid bucket QR code. Please scan again.',
    };
  }

  try {
    const bucket = await getBucketById(parsedData.id);

    if (bucket.component.name !== parsedData.componentName) {
      return {
        success: false,
        message: 'Bucket component mismatch. Scan the correct bucket.',
      };
    }

    return { success: true, bucket: parsedData };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof HttpError
          ? error.message
          : 'Failed to verify bucket. Please try again.',
    };
  }
}
// payload: {
//   bucketId: string;
// } & ICreateFillingContainerActDto,
export async function validateComponentForFillContainer(
  bucketId: string,
  createFillContainerAct: ICreateFillingContainerActDto,
) {
  try {
    const fillingAct = await createFillingContainerAct(
      bucketId,
      createFillContainerAct,
    );
    return fillingAct;
  } catch (error) {
    return {
      errorMessage:
        error instanceof HttpError
          ? error.message
          : 'Компонент не может подходит для заполнения данной ёмкости. Попробуйте ещё раз.',
    };
  }
}

export function validateBucketQrCode(bucketQrCode: string) {
  const parsedData = getBucketData(bucketQrCode);

  return (
    parsedData || {
      errorMessage:
        'Не валидный qr-код сканируйте ещё раз или попробуйте ввести код вручную',
    }
  );
}

export async function validateContainerById(containerId: string) {
  try {
    const bucket = await getBucketById(containerId);

    return bucket;
  } catch (error) {
    return {
      errorMessage:
        error instanceof HttpError
          ? error.message
          : 'Не удалось проверить ёмкость попробуйте ещё раз',
    };
  }
}
