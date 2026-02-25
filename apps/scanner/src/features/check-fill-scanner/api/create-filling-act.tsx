import { http } from '@/src/api/http';
import {
  API_ROUTES,
  HTTP_METHODS,
  type ICreateFillingActBucketDto,
  type IFillingActBucketResponseDto,
} from '@repo/api';

export function createFillingAct(payload: ICreateFillingActBucketDto) {
  return http<IFillingActBucketResponseDto, ICreateFillingActBucketDto>(
    `/${API_ROUTES.filling_act_buckets}`,
    {
      method: HTTP_METHODS.POST,
      body: payload,
    },
  );
}
