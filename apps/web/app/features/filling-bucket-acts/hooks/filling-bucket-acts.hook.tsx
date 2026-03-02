import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  createFillContainerAct,
  getAllFillingBucketActs,
} from '../api/filling-bucket-acts.api';

export function useAllFillingBucketActs() {
  return useQuery({
    queryKey: ['filling-bucket-acts'],
    queryFn: getAllFillingBucketActs,
    staleTime: 60_000,
  });
}

export function useCreateFillContainerAct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFillContainerAct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['filling-bucket-acts'] });
    },
  });
}
