import { useQuery } from 'react-query';
import { getAllComponents } from '../api/components.api';

export function useAllComponents(search?: string) {
  return useQuery({
    queryKey: ['components', search ?? ''],
    queryFn: () => getAllComponents(search),
    staleTime: 60_000,
  });
}
