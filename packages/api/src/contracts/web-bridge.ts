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

export type AppToWebMessage = {
  type: 'SCAN_RESULT';
  payload: ScannerValidationResponse;
};

export const WEB_TO_APP_MESSAGE_TYPES = {
  SCAN_COMPONENT: 'SCAN_COMPONENT',
  FILLING_BUCKET_ACT: 'FILLING_BUCKET_ACT',
} as const;

interface WebToAppMessageMap {
  [WEB_TO_APP_MESSAGE_TYPES.SCAN_COMPONENT]: ScannerRequestPayload;
  [WEB_TO_APP_MESSAGE_TYPES.FILLING_BUCKET_ACT]: ScannerRequestPayload;
}

export type WebToAppMessage = {
  [K in keyof WebToAppMessageMap]: {
    type: K;
    payload: WebToAppMessageMap[K];
  };
}[keyof WebToAppMessageMap];
