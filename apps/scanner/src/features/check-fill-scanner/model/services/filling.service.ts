// filling.service.ts

import { FillingMachine } from '../machine/filling.machine';
import { FillingState } from '../machine/filling.types';
import { getBucketData } from '../../utils';
import { createFillingAct } from '../../api';
import { BucketQRData, HttpError, ICreateFillingActBucketDto } from '@repo/api';

export function getBucketScanState(
  bucketCode: string,
  testedComponentName: string,
): FillingState {
  const parsedData = getBucketData(bucketCode);
  const initialState = FillingMachine.initial();
  if (!parsedData) {
    return FillingMachine.fail(
      'Не валидный QRcode, попробуйте ещё раз, или введите код вручную',
      initialState,
    );
  }

  const isValidBucket = parsedData.componentName === testedComponentName;

  return isValidBucket
    ? FillingMachine.bucketValidated(parsedData)
    : FillingMachine.fail('Сканирована неверная тара', initialState);
}

export async function getComponentScanState(
  createScanEventData: ICreateFillingActBucketDto,
  bucket: BucketQRData,
): Promise<FillingState> {
  try {
    const fillingActData = await createFillingAct(createScanEventData);

    return FillingMachine.componentValidated(fillingActData);
  } catch (error) {
    console.log(error);
    return FillingMachine.fail(
      error instanceof HttpError
        ? error.message
        : 'Ошибка при валидации компонента',
      FillingMachine.bucketValidated(bucket),
    );
  }
}
