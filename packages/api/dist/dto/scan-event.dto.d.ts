import { BucketQRData } from 'entities/bucket.entity';
export interface ICreateScanEventDto {
    componentName: string;
    componentId: string;
    orderId: string;
    deviceId: string;
    operatorId: string;
}
export interface ICreateBarcodeScanEventDto extends ICreateScanEventDto {
    scannedCode: string;
    validBatches: string[];
}
export interface ICreateQrCodeScanEventDto extends ICreateScanEventDto {
    qrData: BucketQRData;
}
//# sourceMappingURL=scan-event.dto.d.ts.map