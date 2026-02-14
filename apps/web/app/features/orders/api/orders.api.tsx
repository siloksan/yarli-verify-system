import { http } from '~/shared/lib/http';
import {
  OrderStatus,
  type IOrderWithComponentsDto,
  type IOrderDto,
} from '@repo/api';

export function getAllOrders(
  statuses: OrderStatus[] = Object.values(OrderStatus),
) {
  return http<IOrderDto[]>('/orders/list', {
    params: {
      statuses,
    },
  });
}

export function getOrderById(orderId: string) {
  return http<IOrderWithComponentsDto>(`/orders/${orderId}/recipe`);
}
