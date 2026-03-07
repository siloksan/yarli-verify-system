import {
  BucketQRData,
  HttpError,
  ICreateBarcodeScanEventDto,
  ICreateQrCodeScanEventDto,
  ICreateScanEventDto,
  ScanResult,
} from '@repo/api';

import { getBucketData } from '@/src/entities';
import {
  createScaneEventBarcode,
  createScaneEventQrcode,
} from '../api/create-scan-event';

export async function validateComponent(
  code: string,
  createScanComponent: ICreateScanEventDto,
  validBatches: string[],
) {
  const parsedCode = getBucketData(code);

  try {
    if (!parsedCode) {
      const dto: ICreateBarcodeScanEventDto = {
        scannedCode: code,
        ...createScanComponent,
        validBatches,
      };

      // const scanEvent = await createScaneEventBarcode(dto);

      return await validateBarcodeData(dto);
    } else {
      const dto: ICreateQrCodeScanEventDto = {
        qrData: parsedCode,
        ...createScanComponent,
      };

      return await validateQrData(dto);
    }
  } catch (error) {
    return {
      errorMessage:
        error instanceof HttpError
          ? error.message
          : 'Компонент не прошёл проверку.',
    };
  }
}

async function validateQrData(dto: ICreateQrCodeScanEventDto) {
  const scanEvent = await createScaneEventQrcode(dto);

  if (scanEvent.result === ScanResult.WRONG) {
    return {
      errorMessage: `Отсканирован ${scanEvent.scannedComponentName} требуется ${dto.componentName}`,
    };
  } else {
    return scanEvent;
  }
}

async function validateBarcodeData(dto: ICreateBarcodeScanEventDto) {
  const scanEvent = await createScaneEventBarcode(dto);

  if (scanEvent.result === ScanResult.WRONG) {
    return {
      errorMessage: `Отсканирован ${scanEvent.scannedComponentName} требуется ${dto.componentName}`,
    };
  } else {
    return scanEvent;
  }
}
