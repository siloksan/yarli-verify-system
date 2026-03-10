export interface ICreateFillingActBucketDto {
    workerName: string;
    weight: string | null;
    bucketId: string;
    orderId: string;
    validBatchesId: string[];
    componentBarcode: string;
    recipeComponentId: string;
    recipeComponentName: string;
}
export interface ICreateFillingContainerActDto {
    workerName: string;
    componentBarcode: string;
    weight?: string;
}
export interface IFillingContainerActResponseDto {
    id: string;
    workerName: string;
    componentName: string;
    componentId: string;
    componentBatch: string;
    weight: string | null;
    createdAt: string;
    bucketId?: string;
    orderId?: string;
}
//# sourceMappingURL=filling-bucket-act.dto.d.ts.map