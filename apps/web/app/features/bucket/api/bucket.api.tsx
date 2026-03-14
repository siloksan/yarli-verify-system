import {
  HTTP_METHODS,
  type IBucketCreateDto,
  type IBucketResponseDto,
} from '@repo/api';
import { http } from '~/shared/lib/http';

export function getAllBuckets(search?: string) {
  if (search?.trim()) {
    return http<IBucketResponseDto[]>('/buckets', {
      params: { q: search.trim() },
    });
  }

  return http<IBucketResponseDto[]>('/buckets');
}

export function createBucket(createData: IBucketCreateDto) {
  return http<IBucketResponseDto>('/buckets', {
    method: HTTP_METHODS.POST,
    body: createData,
  });
}
