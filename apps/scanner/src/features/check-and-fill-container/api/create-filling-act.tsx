import { http } from '@/src/api/http';
import {
  API_ROUTES,
  HTTP_METHODS,
  IBucketResponseDto,
  IFillingContainerActResponseDto,
  type ICreateFillingActBucketDto,
} from '@repo/api';

export function createFillingAct(payload: ICreateFillingActBucketDto) {
  return http<IFillingContainerActResponseDto, ICreateFillingActBucketDto>(
    `/${API_ROUTES.filling_act_buckets}`,
    {
      method: HTTP_METHODS.POST,
      body: payload,
    },
  );
}

export function getBucketById(bucketId: string) {
  return http<IBucketResponseDto>(`/buckets/${bucketId}`);
}
