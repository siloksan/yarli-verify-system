import { http } from '@/src/api/http';
import {
  API_ROUTES,
  HTTP_METHODS,
  type IBucketResponseDto,
  type ICreateFillingContainerActDto,
  type IFillingContainerActResponseDto,
} from '@repo/api';

export function createFillingContainerAct(
  bucketId: string,
  payload: ICreateFillingContainerActDto,
) {
  return http<IFillingContainerActResponseDto, ICreateFillingContainerActDto>(
    `/${API_ROUTES.filling_act_buckets}/bucket/${bucketId}`,
    {
      method: HTTP_METHODS.POST,
      body: payload,
    },
  );
}

export function getBucketById(bucketId: string) {
  return http<IBucketResponseDto>(`/buckets/${bucketId}`);
}
