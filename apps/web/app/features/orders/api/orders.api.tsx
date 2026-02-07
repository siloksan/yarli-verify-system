import { http } from "~/shared/lib/http";
import { type IOrdersDto } from "@repo/api";

export function getAllOrders() {
    return http<IOrdersDto[]>() 
}

