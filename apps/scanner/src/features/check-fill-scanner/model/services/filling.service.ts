// filling.service.ts

import { FillingMachine } from '../machine/filling.machine';
import { FillingState } from '../machine/filling.types';
import { getBucketData } from '../../utils';
import { createFillingAct } from '../../api';
import { HttpError } from '@repo/api';

export function getBucketScanState(currentState: FillingState) {
  if (currentState.step !== 'bucket_validating') {
    return currentState;
  }

  const { bucketValidationData } = currentState;
  const parsedData = getBucketData(bucketValidationData.bucketCode);

  if (!parsedData) {
    return FillingMachine.fail(
      'Не валидный QRcode, попробуйте ещё раз, или введите код вручную',
      currentState,
    );
  }

  const isValidBucket =
    parsedData.componentName === bucketValidationData.testedComponentName;

  return isValidBucket
    ? FillingMachine.bucketValidated(parsedData)
    : FillingMachine.fail('Сканирована неверная тара', currentState);
}

export async function getComponentScanState(
  currentState: FillingState,
): Promise<FillingState> {
  if (currentState.step !== 'component_validating') {
    return currentState;
  }

  try {
    const fillingActData = await createFillingAct(
      currentState.createScanEventData,
    );

    return FillingMachine.componentValidated(fillingActData);
  } catch (error) {
    console.error(error);

    return FillingMachine.fail(
      error instanceof HttpError
        ? error.message
        : 'Ошибка при валидации компонента',
      FillingMachine.bucketValidated(currentState.bucket),
    );
  }
}
