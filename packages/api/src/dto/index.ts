export interface IOrdersDto {
  orderNumber: string;
  label: string;
  id: string;
}

export enum ScanResult {
  OK = 'OK',
  WRONG = 'WRONG',
}
export const TEST = 'TEST' as const;
export interface IScanEvent {
  id: string;
  batchId: string;
  result: ScanResult;
  deviceId: string;
  operatorId: string;
}

export interface IOrderComponentDto {
  id: string;
  orderId: string;
  componentName: string;
  requiredQty: string;
  unit: string;
  validBatches: string[];
  scanEvents: IScanEvent[];
}

export interface IOrderWithComponentsDto extends IOrdersDto {
  components: IOrderComponentDto[];
}
