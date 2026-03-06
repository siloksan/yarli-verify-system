import { type IFillingActBucketResponseDto } from '@repo/api';
import { http } from '~/shared/lib/http';

export function getAllFillingBucketActs() {
  return http<IFillingActBucketResponseDto[]>('/filling-act-buckets');
}
