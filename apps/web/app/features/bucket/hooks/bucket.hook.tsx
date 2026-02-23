import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createBucket, getAllBuckets} from '../api/bucket.api';

export function useAllBuckets(search?: string) {
  return useQuery({
    queryKey: ['buckets', search ?? ''],
    queryFn: () => getAllBuckets(search),
    staleTime: 60_000,
  });
}

export function useCreateBucket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBucket,
    onSuccess: () => {
      // Инвалидируем кеш queries с ключом 'buckets' после успешного создания
      queryClient.invalidateQueries({ queryKey: ['buckets'] });
    },
  });
}