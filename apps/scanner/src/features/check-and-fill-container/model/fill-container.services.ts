import { HttpError, ICreateFillingActBucketDto } from '@repo/api';

import { createFillingAct, getBucketById } from '../api/create-filling-act';
import { getBucketData } from '@/src/entities';

export async function validateComponentForFillContainer(
  bucketId: string,
  createFillContainerAct: ICreateFillingActBucketDto,
) {
  try {
    const fillingAct = await createFillingAct(createFillContainerAct);
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
