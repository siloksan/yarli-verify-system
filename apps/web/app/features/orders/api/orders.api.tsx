import { http } from "~/shared/lib/http";
import type { IOrderWithComponentsDto, IOrdersDto } from "@repo/api";

export function getAllOrders() {
    return http<IOrdersDto[]>('/orders/list') 
}

export function getOrderById(orderId: string) {
    return http<IOrderWithComponentsDto>(`/orders/${orderId}/recipe`)
}
