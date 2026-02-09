import { useQuery } from 'react-query';
import { getAllOrders, getOrderById } from '../api/orders.api';

export function useAllOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: getAllOrders,
    staleTime: 60_000, // 1 minute
  });
}

export function useOrder(orderId?: string) {
  return useQuery({
    queryKey: ['orders', orderId],
    queryFn: () => {
      if (!orderId) {
        return Promise.reject(new Error('orderId is required'));
      }
      return getOrderById(orderId);
    },
    enabled: Boolean(orderId),
    staleTime: 60_000,
  });
}
