export interface ICreateFillingActBucketDto {
  batchId: string;
  componentId: string;
  workerName: string;
  weight: string | null;
  bucketId: string;
  orderId: string;
}

export interface IFillingActBucketResponseDto {
  id: string;
  componentName: string;
  componentBatch: string;
  workerName: string;
  weight: string | null;
  createdAt: string;
  bucketId: string;
  componentId: string;
  orderId: string;
}
