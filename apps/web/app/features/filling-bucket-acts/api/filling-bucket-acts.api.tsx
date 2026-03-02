import {
  HTTP_METHODS,
  type ICreateFillingContainerActDto,
  type IFillingActBucketResponseDto,
} from '@repo/api';
import { http } from '~/shared/lib/http';

export type CreateFillContainerActPayload = {
  bucketId: string;
  data: ICreateFillingContainerActDto;
};

export function getAllFillingBucketActs() {
  return http<IFillingActBucketResponseDto[]>('/filling-act-buckets');
}

export function createFillContainerAct({
  bucketId,
  data,
}: CreateFillContainerActPayload) {
  return http<IFillingActBucketResponseDto>(
    `/filling-act-buckets/bucket/${bucketId}`,
    {
      method: HTTP_METHODS.POST,
      body: data,
    },
  );
}
