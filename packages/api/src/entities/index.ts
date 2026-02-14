export class Batch {
  batchId: string;
  batch: string;
  componentId: string;
  componentName: string;
}

export interface IQrCodeInfo {
  componentName: string;
  batch: string;
  expiresAt: Date;
  componentId: string;
  componentCode: string;
}

export interface IComponentBatchQrPayload {
  batchId: string;
  batch: string;
  componentId: string;
  componentName: string;
}
