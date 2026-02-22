export * from './bucket.dto';
export * from './filling-bucket-act.dto';

export enum OrderStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
}

export interface IOrderDto {
  orderNumber: string;
  status: OrderStatus;
  label: string;
  id: string;
}

export enum ScanResult {
  OK = 'OK',
  WRONG = 'WRONG',
}

export interface IScanEvent {
  id: string;
  batchId: string;
  result: ScanResult;
  deviceId: string;
  operatorId: string;
  scannedComponentBatch?: string;
}

export interface IOrderComponentDto {
  id: string;
  orderId: string;
  componentName: string;
  requiredQty: string;
  position: number;
  unit: string;
  validBatches: string[];
  scanEvents: IScanEvent[];
}

export interface IOrderWithComponentsDto extends IOrderDto {
  components: IOrderComponentDto[];
}

export interface IBatchInfo {
  id: string;
  batchNumber: string;
  barcode: string;
}

export interface IComponentDto {
  id: string;
  name: string;
  batches: IBatchInfo[];
}

export interface IBatchDto {
  id: string;
  batch: string;
  componentId: string;
  componentName: string;
  code: string;
}

export interface ICreateScanEventDto {
  scannedCode: string;
  componentName: string;
  componentId: string;
  orderId: string;
  deviceId: string;
  operatorId: string;
  validBatches: string[];
}

export interface IScanEventDto {
  id: string;
  orderId: string;
  scannedComponentName: string;
  scannedComponentBatch: string;
  scanResult: ScanResult;
}
