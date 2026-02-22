import { ScanResult } from '@repo/api';

export type ValidationResultState = {
  scanResult: ScanResult;
  scannedComponentName: string;
  scannedComponentBatch: string;
};

export type ScannerState =
  | { status: 'idle' }
  | { status: 'validating'; data: string }
  | {
      status: 'success';
      result: ValidationResultState;
      data: string;
    }
  | {
      status: 'error';
      message: string;
      data?: string;
    };
