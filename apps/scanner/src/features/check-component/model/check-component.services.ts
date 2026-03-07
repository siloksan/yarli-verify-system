import {
  HttpError,
  ICreateBarcodeScanEventDto,
  ICreateQrCodeScanEventDto,
  ICreateScanEventDto,
} from '@repo/api';

import { getBucketData } from '@/src/entities';
import {
  createScaneEventBarcode,
  createScaneEventQrcode,
} from '../api/create-scan-event';

export async function validateComponent(
  code: string,
  createFillContainerAct: ICreateScanEventDto,
  validBatches: string[],
) {
  const parsedCode = getBucketData(code);

  try {
    if (!parsedCode) {
      const dto: ICreateBarcodeScanEventDto = {
        scannedCode: code,
        ...createFillContainerAct,
        validBatches,
      };

      return await createScaneEventBarcode(dto);
    }

    const dto: ICreateQrCodeScanEventDto = {
      qrData: parsedCode,
      ...createFillContainerAct,
    };

    return await createScaneEventQrcode(dto);
  } catch (error) {
    return {
      errorMessage:
        error instanceof HttpError
          ? error.message
          : 'Компонент не прошёл проверку.',
    };
  }
}
