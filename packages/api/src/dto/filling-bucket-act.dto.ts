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

// filling act without relation with order
// fill any container, validate only componentId

export interface ICreateFillingContainerActDto {
  workerName: string;
  componentBarcode: string;
  weight?: string;
}

export interface IFillingContainerActResponseDto {
  id: string;
  workerName: string;
  weight: string;
  componentName: string;
  componentBatchNumber: string;
  createdAt: string;
}
