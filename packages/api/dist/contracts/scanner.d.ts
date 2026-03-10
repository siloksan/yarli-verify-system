import { ScanResult } from '../dto/index';
export type ScannerCheckParams = {
    orderId: string;
    componentId: string;
    componentName: string;
    validBatches?: string[];
    callback: string;
};
export type ScannerValidationResult = {
    scanResult: ScanResult;
    scannedComponentName: string;
    scannedComponentBatch: string;
};
//# sourceMappingURL=scanner.d.ts.map