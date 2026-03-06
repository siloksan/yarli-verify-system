import { useQuery } from 'react-query';
import { getAllFillingBucketActs } from '../api/filling-bucket-acts.api';

export function useAllFillingBucketActs() {
  return useQuery({
    queryKey: ['filling-bucket-acts'],
    queryFn: getAllFillingBucketActs,
    staleTime: 60_000,
  });
}
