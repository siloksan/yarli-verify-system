import { http } from '@/src/api/http';
import {
  API_ROUTES,
  HTTP_METHODS,
  type ICreateScanEventDto,
  type IScanEventDto,
} from '@repo/api';

export function validateCode(payload: ICreateScanEventDto) {
  return http<IScanEventDto, ICreateScanEventDto>(
    `/${API_ROUTES.scan_events}`,
    {
      method: HTTP_METHODS.POST,
      body: payload,
    },
  );
}
