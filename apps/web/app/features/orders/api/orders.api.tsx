import { http } from '~/shared/lib/http';
import type { IOrderWithComponentsDto, IOrderDto } from '@repo/api';

export function getAllOrders() {
  return http<IOrderDto[]>('/orders/list');
}

export function getOrderById(orderId: string) {
  return http<IOrderWithComponentsDto>(`/orders/${orderId}/recipe`);
}
