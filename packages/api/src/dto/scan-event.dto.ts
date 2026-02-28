export interface ICreateBarcodeScanEventDto {
  scannedCode: string;
  componentName: string;
  componentId: string;
  orderId: string;
  deviceId: string;
  operatorId: string;
  validBatches: string[];
}

export interface ICreateQrcodeScanEventDto {
  qrData: BucketQRData;
  componentName: string;
  componentId: string;
  orderId: string;
  deviceId: string;
  operatorId: string;
  validBatches: string[];
}
