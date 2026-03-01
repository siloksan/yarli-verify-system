import { http } from '@/src/api/http';
import {
  API_ROUTES,
  HTTP_METHODS,
  type ICreateBarcodeScanEventDto,
  type IScanEventDto,
} from '@repo/api';

export function validateCode(payload: ICreateBarcodeScanEventDto) {
  return http<IScanEventDto, ICreateBarcodeScanEventDto>(
    `/${API_ROUTES.SCAN_EVENTS.root}/${API_ROUTES.SCAN_EVENTS.barcode}`,
    {
      method: HTTP_METHODS.POST,
      body: payload,
    },
  );
}
