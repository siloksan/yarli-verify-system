import {
  API_ROUTES,
  HTTP_METHODS,
  type ICreateScanEventDto,
  type IScanEventDto,
} from '@repo/api';
import { http } from './http';

export function validateCode(payload: ICreateScanEventDto) {
  console.log('payload: ', payload);
  return http<IScanEventDto, ICreateScanEventDto>(`/${API_ROUTES.scan_events}`, {
    method: HTTP_METHODS.POST,
    body: payload,
  });
}
