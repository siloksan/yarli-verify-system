import { BucketQRData } from 'entities/bucket.entity';

export interface ICreateBarcodeScanEventDto {
  scannedCode: string;
  componentName: string;
  componentId: string;
  orderId: string;
  deviceId: string;
  operatorId: string;
  validBatches: string[];
}

export interface ICreateQrCodeScanEventDto {
  qrData: BucketQRData;
  recipeComponentName: string;
  recipeComponentId: string;
  orderId: string;
  deviceId: string;
  operatorId: string;
}
