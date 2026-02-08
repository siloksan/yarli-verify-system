export interface IOrdersDto {
    orderNumber: string;
    label: string;
    id: string;
}

export interface IOrderComponentDto {
        id: string;
        componentName: string;
        orderId: string;
        requiredQty: string;
        unit: string | null;
        validBatches: string[];
}
