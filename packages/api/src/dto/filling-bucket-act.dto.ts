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

export interface IFillingActBucketResponseDto {
  id: string;
  componentId: string;
  componentName: string;
  componentBatch: string;
  workerName: string;
  weight: string | null;
  createdAt: string;
  bucketId: string;
  orderId: string;
}
