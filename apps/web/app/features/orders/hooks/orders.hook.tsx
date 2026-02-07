import { useQuery } from 'react-query';
import { getAllOrders } from '../api/orders.api';

export function useAllOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: getAllOrders,
    staleTime: 60_000, // 1 minute
  });
}
