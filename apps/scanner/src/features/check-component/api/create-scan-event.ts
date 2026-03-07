import { http } from '@/src/api/http';
import {
  API_ROUTES,
  HTTP_METHODS,
  ICreateQrCodeScanEventDto,
  type ICreateBarcodeScanEventDto,
  type IScanEvent,
} from '@repo/api';

export function createScaneEventBarcode(payload: ICreateBarcodeScanEventDto) {
  return http<IScanEvent, ICreateBarcodeScanEventDto>(
    `/${API_ROUTES.SCAN_EVENTS.root}/${API_ROUTES.SCAN_EVENTS.barcode}`,
    {
      method: HTTP_METHODS.POST,
      body: payload,
    },
  );
}

export function createScaneEventQrcode(payload: ICreateQrCodeScanEventDto) {
  return http<IScanEvent, ICreateQrCodeScanEventDto>(
    `/${API_ROUTES.SCAN_EVENTS.root}/${API_ROUTES.SCAN_EVENTS.qrCode}`,
    {
      method: HTTP_METHODS.POST,
      body: payload,
    },
  );
}
