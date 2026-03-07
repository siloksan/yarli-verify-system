import { HttpError, ICreateFillingContainerActDto } from '@repo/api';

import { getBucketData } from '@/src/entities';
import {
  createFillingContainerAct,
  getBucketById,
} from '../api/create-filling-container-act';

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
          : 'Компонент не подходит для заполнения данной ёмкости. Попробуйте ещё раз.',
    };
  }
}

export function validateContainerQrCode(bucketQrCode: string) {
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
