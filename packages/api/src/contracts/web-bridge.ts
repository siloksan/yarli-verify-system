import { ScanResult } from '../dto/index';

export interface ScannerRequestPayload {
  orderId: string;
  componentId: string;
  componentName: string;
  validBatches: string[];
}

export type ScannerValidationResponse = {
  scanResult: ScanResult;
  scannedComponentName: string;
  scannedComponentBatch: string;
};

export type WebToAppMessage = {
  type: 'SCAN_COMPONENT';
  payload: ScannerRequestPayload;
};

export type AppToWebMessage = {
  type: 'SCAN_RESULT';
  payload: ScannerValidationResponse;
};

export const TEST1 = 'test1';
